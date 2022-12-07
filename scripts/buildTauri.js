"use strict";

const fs = require("fs-extra");
const path = require("path");
const cp = require("child_process");
const cli = require("@tauri-apps/cli/main");
const paths = require("../config/paths");
const { basename } = require("path");
const { copyFileSync } = require("fs");

process.env.NODE_ENV = "production";
require("../config/env");

let targets = {
    win32: [["aarch64", "i686", "x86_64"], "pc-windows-msvc"],
    linux: [["aarch64", "i686", "x86_64"], "unknown-linux-musl"],
    darwin: [["aarch64", "x86_64"], "apple-darwin"],
};

let packageJson = fs.readJSONSync(paths.appPackageJson);
let commit;
try {
    let git = cp.spawnSync("git", ["rev-parse", "--short", "HEAD"]);
    commit = git.stdout.toString().replace("\n", "");
    if (commit.length < 1) commit = null;
} catch {}
if (!commit) commit = "unknown";

async function main() {
    const platform = process.platform;
    let target = targets[platform];
    let targetArch = process.env["TARGET_ARCH"]
        ? process.env["TARGET_ARCH"].split(",")
        : null;
    for (const arch of target[0]) {
        if (targetArch && !targetArch.includes(arch)) continue;
        let targetName = arch + "-" + target[1];

        let tauriConfJson = fs.readJSONSync(paths.tauriConfJson);
        tauriConfJson.tauri.bundle.active = !(platform == "win32" && arch == "aarch64");
        fs.writeJSONSync(paths.tauriConfJson, tauriConfJson);

        let cli = cp.fork(
            path.resolve(__dirname + "/../node_modules/@tauri-apps/cli/tauri.js"),
            ["build", "--target=" + targetName]
        );
        await new Promise((resolve) => {
            cli.on("exit", () => resolve());
        });

        let targetPath = path.join(paths.tauriTarget, targetName, "release");
        if (!fs.existsSync(targetPath))
            targetPath = path.join(paths.tauriTarget, "release");
        let bundlePath = path.join(targetPath, "bundle");
        let bundlePaths = [];
        if (tauriConfJson.tauri.bundle.active)
            if (platform == "win32") bundlePaths.push(path.join(bundlePath, "msi"));
            else if (platform == "linux")
                bundlePaths.push(
                    path.join(bundlePath, "appimage"),
                    path.join(bundlePath, "deb")
                );
            else if (platform == "darwin") bundlePaths.push(path.join(bundlePath, "dmg"));
            else throw Error("Unsupported platform.");

        for (const bundlePath of bundlePaths) {
            for (const file of fs.readdirSync(bundlePath)) {
                let filePath = path.join(bundlePath, file);
                let fileExt = path.extname(filePath);
                let newFileName;
                if (fileExt == ".AppImage" || fileExt == ".deb")
                    newFileName = basename(filePath, fileExt);
                else if (fileExt == ".msi")
                    newFileName =
                        packageJson.name +
                        "-setup-msi-v" +
                        packageJson.version +
                        "-" +
                        commit +
                        "-" +
                        arch;
                else if (fileExt == ".dmg")
                    newFileName =
                        packageJson.name +
                        "-setup-v" +
                        packageJson.version +
                        "-" +
                        commit +
                        "-" +
                        arch;
                else continue;

                let newFilePath = path.join(paths.appOut, newFileName + fileExt);
                if (fs.existsSync(newFilePath)) fs.rmSync(newFilePath);
                fs.moveSync(filePath, newFilePath);
            }
        }

        if (platform == "win32") {
            let date = new Date();
            let standaloneExecutable = path.join(
                targetPath,
                tauriConfJson.package.productName + ".exe"
            );
            let innoScript = fs.readFileSync(paths.innoTemplate).toString();

            let allowedIArch = "";
            if (arch == "aarch64") allowedIArch = "arm64";
            else if (arch == "x86_64") allowedIArch = "x64";
            else if (arch == "i686") allowedIArch = "x64 x86";
            else throw Error("Unsupported architecture.");
            innoScript = innoScript
                .replace("{version}", packageJson.version)
                .replace("{commit}", commit)
                .replace("{year}", date.getUTCFullYear())
                .replace("{arch}", arch)
                .replace("{allowed_arch}", allowedIArch)
                .replace("{executable}", standaloneExecutable);
            fs.writeFileSync(paths.innoFile, innoScript);

            let compiler = cp.spawn(paths.innoCompiler, [paths.innoFile]);
            compiler.stdout.pipe(process.stdout);
            compiler.stderr.pipe(process.stderr);
            await new Promise((resolve) => {
                compiler.on("exit", () => resolve());
            });

            copyFileSync(
                standaloneExecutable,
                path.join(
                    paths.appOut,
                    packageJson.name +
                        "-standalone-v" +
                        packageJson.version +
                        "-" +
                        commit +
                        "-" +
                        arch +
                        ".exe"
                )
            );
        }
    }
}

main();
