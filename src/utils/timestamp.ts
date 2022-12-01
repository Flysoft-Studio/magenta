export function timestampToDurationStr(ts: number) {
    let second = Math.round(ts / 1000 - Math.floor(ts / 1000 / 60) * 60);
    let minute = Math.floor(ts / 1000 / 60 - Math.floor(ts / 1000 / 60 / 60) * 60);
    let hour = Math.floor(ts / 1000 / 60 / 60);

    return [hour > 0 ? hour.toString() : undefined]
        .concat(
            [minute, second].map((value) => {
                let str = "0" + value;
                return str.substring(str.length - 2, str.length);
            })
        )
        .filter(Boolean)
        .join(":");
}
