import * as CryptoJS from 'crypto-js';

class EncryptionService {
  private static _instant: EncryptionService;

  private constructor() {}

  public static getInstant() {
    if (!this._instant) {
      this._instant = new EncryptionService();
    }

    return this._instant;
  }

  get jsonFormatter() {
    return {
      stringify: (cipherParams: any) => {
        const jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), iv: null, s: null };
        if (cipherParams.iv) {
          jsonObj.iv = cipherParams.iv.toString();
        }
        if (cipherParams.salt) {
          jsonObj.s = cipherParams.salt.toString();
        }
        return JSON.stringify(jsonObj);
      },
      parse: (jsonStr) => {
        const jsonObj = JSON.parse(jsonStr);
        // extract ciphertext from json object, and create cipher params object
        const cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
        });
        if (jsonObj.iv) {
          cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
        }
        if (jsonObj.s) {
          cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
        }
        return cipherParams;
      },
    };
  }
  /* Method for Encryption */
  encrypt(value: any) {
    const key = 'crypto_js_key'; // SECRET KEY FOR ENCRYPTION
    value = value instanceof String ? value : JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(value, key, {
      format: this.jsonFormatter,
      mode: CryptoJS.mode.CBC,
    }).toString();
    return encrypted;
  }

  /* Method for Decryption */
  decrypt(value: any): any {
    const key = 'crypto_js_key'; //SECRET KEY FOR ENCRYPTION
    const decrypted = CryptoJS.AES.decrypt(value, key, { format: this.jsonFormatter }).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
}

export const encryptionService = EncryptionService.getInstant();
