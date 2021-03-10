import { Aes } from "../../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import testVectors from "./test-vectors.json";

function bufferEquals(a, b) {
  if (a.length != b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
}

function makeTest(options: any) {
  const modeOfOperation = options.modeOfOperation as keyof typeof Aes["ModeOfOperation"];

  const plaintext: Uint8Array[] = [];
  for (let i = 0; i < options.plaintext.length; i++) {
    plaintext.push(Buffer.from(options.plaintext[i]));
  }

  const key = Buffer.from(options.key);

  let iv: Buffer;
  if (options.iv) {
    iv = Buffer.from(options.iv);
  }

  let segmentSize = 0;
  if (options.segmentSize) {
    segmentSize = options.segmentSize;
  }

  const ciphertext: Buffer[] = [];
  for (let i = 0; i < options.encrypted.length; i++) {
    ciphertext.push(Buffer.from(options.encrypted[i]));
  }

  return function () {
    let func;
    switch (modeOfOperation) {
      case "ecb":
        func = function () {
          const mo = Aes.ModeOfOperation.ecb;

          return new mo(key);
        };
        break;
      case "cfb":
        func = function () {
          const mo = Aes.ModeOfOperation.cfb;

          return new mo(key, iv, segmentSize);
        };
        break;
      case "ofb":
      case "cbc":
        func = function () {
          const mo = Aes.ModeOfOperation[modeOfOperation];

          return new mo(key, iv);
        };
        break;
      case "ctr":
        func = function () {
          const mo = Aes.ModeOfOperation[modeOfOperation];

          return new mo(key, new Aes.Counter(0));
        };
        break;
      default:
        throw new Error("unknwon mode of operation");
    }

    const encrypter = func(),
      decrypter = func();
    for (let i = 0; i < plaintext.length; i++) {
      const ciphertext2 = encrypter.encrypt(plaintext[i]);
      expect(bufferEquals(ciphertext2, ciphertext[i])).toBe(true);

      const plaintext2 = decrypter.decrypt(ciphertext2);
      expect(bufferEquals(plaintext2, plaintext[i])).toBe(true);
    }
  };
}

const counts: { [x: string]: number | undefined } = {};
for (let i = 0; i < testVectors.length; i++) {
  const name = testVectors[i].modeOfOperation + "-" + testVectors[i].key.length;
  counts[name] = (counts[name] || 0) + 1;
  test("test-" + name + "-" + counts[name], makeTest(testVectors[i]));
}

test("test manual AES CTR", () => {
  // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
  const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Convert text to bytes
  const text = "Text may be any length you wish, no padding is required.";
  const textBytes = Buffer.from(text, "ascii");
  // console.log(textBytes.toString("hex"));
  // The counter is optional, and if omitted will begin at 1
  let aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
  let encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
  //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  const decryptedText = Buffer.from(decryptedBytes);
  // "Text may be any length you wish, no padding is required."
  expect(decryptedText.toString("ascii")).toBe(text);
});

test("test manual AES CBC", () => {
  const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes (text must be a multiple of 16 bytes)
  const text = "TextMustBe16Byte";
  const textBytes = Buffer.from(text, "ascii");

  let aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
  let encryptedBytes = aesCbc.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "104fb073f9a131f2cab49184bb864ca2"

  // The cipher-block chaining mode of operation maintains internal
  // state, so to decrypt a new instance must be instantiated.
  aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
  let decryptedBytes = aesCbc.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBe16Byte"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES cfb", () => {
  // An example 128-bit key
  const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes (must be a multiple of the segment size you choose below)
  const text = "TextMustBeAMultipleOfSegmentSize";
  const textBytes = Buffer.from(text, "ascii");

  // The segment size is optional, and defaults to 1
  const segmentSize = 8;
  let aesCfb = new Aes.ModeOfOperation.cfb(key, iv, segmentSize);
  let encryptedBytes = aesCfb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "55e3af2638c560b4fdb9d26a630733ea60197ec23deb85b1f60f71f10409ce27"

  // The cipher feedback mode of operation maintains internal state,
  // so to decrypt a new instance must be instantiated.
  aesCfb = new Aes.ModeOfOperation.cfb(key, iv, 8);
  let decryptedBytes = aesCfb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBeAMultipleOfSegmentSize"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES ofb", () => {
  // An example 128-bit key
  const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes
  const text = "Text may be any length you wish, no padding is required.";
  const textBytes = Buffer.from(text, "ascii");

  let aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
  let encryptedBytes = aesOfb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "55e3af2655dd72b9f32456042f39bae9accff6259159e608be55a1aa313c598d
  //  b4b18406d89c83841c9d1af13b56de8eda8fcfe9ec8e75e8"

  // The output feedback mode of operation maintains internal state,
  // so to decrypt a new instance must be instantiated.
  aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
  let decryptedBytes = aesOfb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "Text may be any length you wish, no padding is required."
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES ecb", () => {
  // An example 128-bit key
  const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Convert text to bytes
  const text = "TextMustBe16Byte";
  const textBytes = Buffer.from(text, "ascii");

  const aesEcb = new Aes.ModeOfOperation.ecb(key);
  let encryptedBytes = aesEcb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "a7d93b35368519fac347498dec18b458"

  // Since electronic codebook does not store state, we can
  // reuse the same instance.
  //let aesEcb = new aesjs.ModeOfOperation.ecb(key);
  let decryptedBytes = aesEcb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBe16Byte"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES", () => {
  // the AES block cipher algorithm works on 16 byte bloca ks, no more, no less
  const text = "ABlockIs16Bytes!";
  const textAsBytes = Buffer.from(text, "ascii");
  // console.log(textAsBytes.toString("hex"));
  // [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

  // create an instance of the block cipher algorithm
  const key = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
  const aes = new Aes.AES(key);

  // encrypt...
  const encryptedBytes = aes.encrypt(textAsBytes);
  // console.log(encryptedBytes);
  // [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109]

  // To print or store the binary data, you may convert it to hex
  const encryptedHex = Buffer.from(encryptedBytes);
  // console.log(encryptedHex.toString("hex"));
  // "880fc7ae7685e9b18f2f2ad360376b6d"

  // decrypt...
  let decryptedBytes = aes.decrypt(encryptedHex);
  // console.log(decryptedBytes);
  // [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

  // decode the bytes back into our original text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "ABlockIs16Bytes!"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  expect(decryptedBytes.toString("ascii")).toBe(text);
});
