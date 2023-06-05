let currentGroup = getTime();

export const debug = (...data) => {
    let now = getTime();
    if (currentGroup !== now) console.groupCollapsed(`%cDebug %c${currentGroup}`, "font-weight: bold; color: blue", "font-weight: normal; color: cornflowerblue");

    Function.prototype.apply.call(console.log, window.console, data);
    if (currentGroup !== now) {
        console.groupEnd();
    }
    currentGroup = getTime();
};

function getTime() {
    return new Date().toISOString().split("T")[1].slice(0, -3);
}