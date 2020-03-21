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
    return (
      "「" +
      time.toISOString().slice(5, 10) +
      " " +
      time.toISOString().slice(11, 16) +
      "」"
    );
  }
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date) {
  if (!date) {
    return;
  }
  if (date.length <= 10) {
    return date.replace(/\-/g, "/");
  } else {
    return date.slice(0, 10).replace(/\-/g, "/");
  }
}
