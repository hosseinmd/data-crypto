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
