"use strict";

const fs = require("fs-extra");
const path = require("path");
const cp = require("child_process");
const cli = require("@tauri-apps/cli/main");
const paths = require("../config/paths");
const { basename } = require("path");
const { copyFileSync } = require("fs");

let packageJson = JSON.parse(fs.readFileSync(paths.appPackageJson).toString());
let tauriConfJson = JSON.parse(fs.readFileSync(paths.tauriConfJson).toString());
let buildNumber = fs.readFileSync(paths.buildNumber).toString();

async function main() {
    await cli.run(["build"], null);
    let bundlePaths = [];
    if (process.platform == "win32")
        bundlePaths.push(path.join(paths.tauriBundle, "msi"));
    else if (process.platform == "linux")
        bundlePaths.push(
            path.join(paths.tauriBundle, "appimage"),
            path.join(paths.tauriBundle, "deb")
        );
    else if (process.platform == "darwin")
        bundlePaths.push(path.join(paths.tauriBundle, "dmg"));
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
                    "-b" +
                    buildNumber +
                    "-" +
                    process.arch;
            else if (fileExt == ".dmg")
                newFileName =
                    packageJson.name +
                    "-setup-v" +
                    packageJson.version +
                    "-b" +
                    buildNumber +
                    "-" +
                    process.arch;
            else continue;

            let newFilePath = path.join(paths.appOut, newFileName + fileExt);
            if (fs.existsSync(newFilePath)) fs.rmSync(newFilePath);
            fs.moveSync(filePath, newFilePath);
        }
    }

    if (process.platform == "win32") {
        let date = new Date();
        let innoScript = fs.readFileSync(paths.innoTemplate).toString();

        innoScript = innoScript
            .replace("{version}", packageJson.version)
            .replace("{build_number}", buildNumber)
            .replace("{year}", date.getUTCFullYear());
        fs.writeFileSync(paths.innoFile, innoScript);

        let compiler = cp.spawn(paths.innoCompiler, [paths.innoFile]);
        compiler.stdout.pipe(process.stdout);
        compiler.stderr.pipe(process.stderr);

        copyFileSync(
            path.join(paths.tauriTarget, tauriConfJson.package.productName + ".exe"),
            path.join(
                paths.appOut,
                packageJson.name +
                    "-standalone-v" +
                    packageJson.version +
                    "-b" +
                    buildNumber +
                    "-" +
                    process.arch +
                    ".exe"
            )
        );
    }
}

main();
