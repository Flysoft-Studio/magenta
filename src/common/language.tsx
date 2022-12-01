let data = {
    "en-us": require("../languages/en-us.json"),
    "zh-cn": require("../languages/zh-cn.json"),
};

export function l(language: string, id: string, replacements?: string[]) {
    return data[language][id];
}
