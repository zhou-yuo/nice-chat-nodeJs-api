/**
 * @origin https://blog.csdn.net/qq_34707272/article/details/121857485
 */
var CryptoJS = require("crypto-js");

const SECRET_KEY = CryptoJS.enc.Utf8.parse("wiHl1iCjdfvZ0ih9EvSOHwu1voiJFaWn");
const SECRET_IV = CryptoJS.enc.Utf8.parse("gW0XoZx1oFEG0OL4");

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
function encrypt(data) {
  if (typeof data === "object") {
    try {
      // eslint-disable-next-line no-param-reassign
      data = JSON.stringify(data);
    } catch (error) {
      console.log("encrypt error:", error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
function decrypt(data) {
  const decrypt = CryptoJS.AES.decrypt(data, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function md5(data) {
  return CryptoJS.MD5(data).toString().toUpperCase()
}

module.exports = {
  encrypt,
  decrypt,
  md5
}