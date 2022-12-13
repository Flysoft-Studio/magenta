// @ts-ignore
export const isTauri = window.__TAURI__ != undefined;
// @ts-ignore
export const isDev = process.env.NODE_ENV != "production";
