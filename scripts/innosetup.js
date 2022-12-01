"use strict";

const fs = require("fs-extra");
const cp = require("child_process");
const paths = require("../config/paths");

let version = JSON.parse(fs.readFileSync(paths.appPackageJson).toString()).version;
let buildNumber = fs.readFileSync(paths.buildNumber).toString();
let date = new Date();
let issTemplate = fs.readFileSync(paths.innoTemplate).toString();

issTemplate = issTemplate
    .replace("{version}", version)
    .replace("{build_number}", buildNumber)
    .replace("{year}", date.getUTCFullYear());
fs.writeFileSync(paths.innoFile, issTemplate);

let compiler = cp.spawn(paths.innoCompiler, [paths.innoFile]);
compiler.stdout.pipe(process.stdout);
compiler.stderr.pipe(process.stderr);
