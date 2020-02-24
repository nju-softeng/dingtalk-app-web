import Identicon from "identicon.js";
import crypto from "crypto";

export function getavatar(name) {
  let hash = crypto.createHash("md5");
  hash.update(name); // 传入用户名
  let imgData = new Identicon(hash.digest("hex")).toString();
  return "data:image/png;base64," + imgData;
}
