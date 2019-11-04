const { Aes } = require("../../");

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

function makeTest(options) {
  var modeOfOperation = options.modeOfOperation;
  var mo = Aes.ModeOfOperation[modeOfOperation];

  var plaintext = [];
  for (var i = 0; i < options.plaintext.length; i++) {
    plaintext.push(Buffer.from(options.plaintext[i]));
  }

  var key = Buffer.from(options.key);

  var iv = null;
  if (options.iv) {
    iv = Buffer.from(options.iv);
  }

  var segmentSize = 0;
  if (options.segmentSize) {
    segmentSize = options.segmentSize;
  }

  var ciphertext = [];
  for (var i = 0; i < options.encrypted.length; i++) {
    ciphertext.push(Buffer.from(options.encrypted[i]));
  }

  return function() {
    var func;
    switch (modeOfOperation) {
      case "ecb":
        func = function() {
          return new mo(key);
        };
        break;
      case "cfb":
        func = function() {
          return new mo(key, iv, segmentSize);
        };
        break;
      case "ofb":
      case "cbc":
        func = function() {
          return new mo(key, iv);
        };
        break;
      case "ctr":
        func = function() {
          return new mo(key, new Aes.Counter(0));
        };
        break;
      default:
        throw new Error("unknwon mode of operation");
    }

    var encrypter = func(),
      decrypter = func();
    for (var i = 0; i < plaintext.length; i++) {
      var ciphertext2 = encrypter.encrypt(plaintext[i]);
      expect(bufferEquals(ciphertext2, ciphertext[i])).toBe(true);

      var plaintext2 = decrypter.decrypt(ciphertext2);
      expect(bufferEquals(plaintext2, plaintext[i])).toBe(true);
    }
  };
}

const testVectors = require("./test-vectors.json");

const counts = {};
for (var i = 0; i < testVectors.length; i++) {
  let name = testVectors[i].modeOfOperation + "-" + testVectors[i].key.length;
  counts[name] = (counts[name] || 0) + 1;
  test("test-" + name + "-" + counts[name], makeTest(testVectors[i]));
}

test("test manual AES CTR", () => {
  // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Convert text to bytes
  var text = "Text may be any length you wish, no padding is required.";
  var textBytes = Buffer.from(text, "ascii");
  // console.log(textBytes.toString("hex"));
  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
  //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  var decryptedText = Buffer.from(decryptedBytes);
  // "Text may be any length you wish, no padding is required."
  expect(decryptedText.toString("ascii")).toBe(text);
});

test("test manual AES CBC", () => {
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes (text must be a multiple of 16 bytes)
  var text = "TextMustBe16Byte";
  var textBytes = Buffer.from(text, "ascii");

  var aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
  var encryptedBytes = aesCbc.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "104fb073f9a131f2cab49184bb864ca2"

  // The cipher-block chaining mode of operation maintains internal
  // state, so to decrypt a new instance must be instantiated.
  aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
  var decryptedBytes = aesCbc.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBe16Byte"
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES cfb", () => {
  // An example 128-bit key
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes (must be a multiple of the segment size you choose below)
  var text = "TextMustBeAMultipleOfSegmentSize";
  var textBytes = Buffer.from(text, "ascii");

  // The segment size is optional, and defaults to 1
  var segmentSize = 8;
  var aesCfb = new Aes.ModeOfOperation.cfb(key, iv, segmentSize);
  var encryptedBytes = aesCfb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "55e3af2638c560b4fdb9d26a630733ea60197ec23deb85b1f60f71f10409ce27"

  // The cipher feedback mode of operation maintains internal state,
  // so to decrypt a new instance must be instantiated.
  aesCfb = new Aes.ModeOfOperation.cfb(key, iv, 8);
  var decryptedBytes = aesCfb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBeAMultipleOfSegmentSize"
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES ofb", () => {
  // An example 128-bit key
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // The initialization vector (must be 16 bytes)
  var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  // Convert text to bytes
  var text = "Text may be any length you wish, no padding is required.";
  var textBytes = Buffer.from(text, "ascii");

  var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
  var encryptedBytes = aesOfb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "55e3af2655dd72b9f32456042f39bae9accff6259159e608be55a1aa313c598d
  //  b4b18406d89c83841c9d1af13b56de8eda8fcfe9ec8e75e8"

  // The output feedback mode of operation maintains internal state,
  // so to decrypt a new instance must be instantiated.
  var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
  var decryptedBytes = aesOfb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "Text may be any length you wish, no padding is required."
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES ecb", () => {
  // An example 128-bit key
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Convert text to bytes
  var text = "TextMustBe16Byte";
  var textBytes = Buffer.from(text, "ascii");

  var aesEcb = new Aes.ModeOfOperation.ecb(key);
  var encryptedBytes = aesEcb.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  var encryptedBytes = Buffer.from(encryptedBytes);
  // console.log(encryptedBytes.toString("hex"));
  // "a7d93b35368519fac347498dec18b458"

  // Since electronic codebook does not store state, we can
  // reuse the same instance.
  //var aesEcb = new aesjs.ModeOfOperation.ecb(key);
  var decryptedBytes = aesEcb.decrypt(encryptedBytes);

  // Convert our bytes back into text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "TextMustBe16Byte"
  expect(decryptedBytes.toString("ascii")).toBe(text);
});

test("test manual AES", () => {
  // the AES block cipher algorithm works on 16 byte bloca ks, no more, no less
  var text = "ABlockIs16Bytes!";
  var textAsBytes = Buffer.from(text, "ascii");
  // console.log(textAsBytes.toString("hex"));
  // [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

  // create an instance of the block cipher algorithm
  var key = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
  var aes = new Aes.AES(key);

  // encrypt...
  var encryptedBytes = aes.encrypt(textAsBytes);
  // console.log(encryptedBytes);
  // [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109]

  // To print or store the binary data, you may convert it to hex
  var encryptedHex = Buffer.from(encryptedBytes);
  // console.log(encryptedHex.toString("hex"));
  // "880fc7ae7685e9b18f2f2ad360376b6d"

  // decrypt...
  var decryptedBytes = aes.decrypt(encryptedHex);
  // console.log(decryptedBytes);
  // [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

  // decode the bytes back into our original text
  decryptedBytes = Buffer.from(decryptedBytes);
  // console.log(decryptedBytes.toString("ascii"));
  // "ABlockIs16Bytes!"
  expect(decryptedBytes.toString("ascii")).toBe(text);
});
