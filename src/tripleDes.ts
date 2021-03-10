import Des from "./des";

function splitKeys(keyHex: string) {
  const key1 = keyHex.slice(0, 16);
  let key2 = keyHex.slice(16, 32);
  let key3 = keyHex.slice(32, 48);

  if (!key2) {
    key2 = key1;
  }

  if (!key3) {
    key3 = key1;
  }
  return { key1, key2, key3 };
}

const TripleDes = {
  /**
   * @param {string} plainTextHex
   * @param {string} keyHex Key should be 16 , 32 or 48 characters
   */
  encrypt(plainTextHex: string, keyHex: any) {
    const { key1, key2, key3 } = splitKeys(keyHex);

    const firstPass = Des.encrypt(plainTextHex, key1);

    const secondPass = Des.decrypt(firstPass, key2);

    const thirdPass = Des.encrypt(secondPass, key3);

    return thirdPass;
  },
  /**
   * @param {string} cipher
   * @param {string} keyHex Key should be 16 , 32 or 48 characters
   */
  decrypt(cipher: string, keyHex: any) {
    const { key1, key2, key3 } = splitKeys(keyHex);

    const firstPass = Des.decrypt(cipher, key3);

    const secondPass = Des.encrypt(firstPass, key2);

    const thirdPass = Des.decrypt(secondPass, key1);

    return thirdPass;
  },
};
export default TripleDes;
