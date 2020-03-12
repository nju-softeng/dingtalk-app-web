// import parseTime, formatTime and set to filter
export { parseTime, formatTime, formatWeek } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label + "前";
  }
  return time + label + "前";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time) / 1000;
  if (between < 3600) {
    return pluralize(~~(between / 60), " 分钟");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " 小时");
  } else {
    return pluralize(~~(between / 86400), " 天");
  }
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
