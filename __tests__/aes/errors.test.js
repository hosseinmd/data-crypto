"use strict";
const { Aes } = require("../../");

function newBuffer(length) {
  var buffer = Buffer.alloc(length);
  buffer.fill(42);
  return buffer;
}

// Invalid key sizes to try
var keySizes = [0, 1, 2, 7, 8, 9, 15, 17, 23, 25, 31, 33, 100];

test("test-errors-key-size", function() {
  for (var i = 0; i < keySizes.length; i++) {
    expect(function() {
      var moo = new Aes.ModeOfOperation.ecb(newBuffer(keySizes[i]));
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "invalid key size (must be 16, 24 or 32 bytes)";
    }).toThrowError(Error);
  }
});

test("test-errors-iv-size", function() {
  var ivSizes = [0, 15, 17, 100];
  for (var i = 0; i < 3; i++) {
    var keySize = 16 + i * 8;

    for (var j = 0; j < ivSizes.length; j++) {
      expect(function() {
        var moo = new Aes.ModeOfOperation.cbc(
          newBuffer(keySize),
          newBuffer(ivSizes[j]),
        );
      }).toThrowError(Error);
      expect(function(error) {
        return (
          error.message ===
          "invalid initialation vector size (must be 16 bytes)"
        );
      }).toThrowError(Error);

      expect(function() {
        var moo = new Aes.ModeOfOperation.ofb(
          newBuffer(keySize),
          newBuffer(ivSizes[j]),
        );
      }).toThrowError(Error);
      expect(function(error) {
        return (
          error.message ===
          "invalid initialation vector size (must be 16 bytes)"
        );
      }).toThrowError(Error);
    }
  }
});

test("test-errors-segment-size", function() {
  var key = newBuffer(16);
  var iv = newBuffer(16);
  for (var i = 1; i < 17; i++) {
    for (var j = 1; j < 17; j++) {
      if (j % i === 0) {
        continue;
      }

      var moo = new Aes.ModeOfOperation.cfb(key, iv, i);

      expect(function() {
        moo.encrypt(newBuffer(j));
      }).toThrowError(Error);
      expect(function(error) {
        return (
          error.message === "invalid plaintext size (must be segmentSize bytes)"
        );
      }).toThrowError(Error);
    }
  }
});

test("test-errors-text-size", function() {
  var textSizes = [1, 2, 15, 17, 31, 33];

  for (var i = 0; i < 3; i++) {
    var key = newBuffer(16 + i * 8);
    for (var j = 0; j < textSizes.length; j++) {
      for (var k = 0; k < 2; k++) {
        var text = newBuffer(textSizes[j]);
        if (k === 0) {
          var moo = new Aes.ModeOfOperation.ecb(key);
        } else {
          var moo = new Aes.ModeOfOperation.cbc(key, newBuffer(16));
        }

        expect(function() {
          moo.encrypt(text);
        }).toThrowError(Error);
        expect(function(error) {
          return (
            error.message ===
            "invalid plaintext size (must be multiple of 16 bytes)"
          );
        }).toThrowError(Error);
      }
    }
  }

  for (var i = 0; i < 3; i++) {
    var key = newBuffer(16 + i * 8);
    for (var j = 0; j < textSizes.length; j++) {
      for (var k = 0; k < 2; k++) {
        var text = newBuffer(textSizes[j]);
        if (k === 0) {
          var moo = new Aes.ModeOfOperation.ecb(key);
        } else {
          var moo = new Aes.ModeOfOperation.cbc(key, newBuffer(16));
        }

        expect(function() {
          moo.decrypt(text);
        }).toThrowError(Error);
        expect(function(error) {
          return (
            error.message ===
            "invalid ciphertext size (must be multiple of 16 bytes)"
          );
        }).toThrowError(Error);
      }
    }
  }
});

test("test-errors-counter", function() {
  var textSizes = [0, 1, 2, 15, 17];
  for (var i = 0; i < textSizes.length; i++) {
    expect(function() {
      var counter = new Aes.Counter(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "invalid counter bytes size (must be 16 bytes)";
    }).toThrowError(Error);

    var counter = new Aes.Counter();
    expect(function() {
      counter.setBytes(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "invalid counter bytes size (must be 16 bytes)";
    }).toThrowError(Error);

    var counter = new Aes.Counter();
    expect(function() {
      counter.setValue(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "invalid counter value (must be an integer)";
    }).toThrowError(Error);
  }

  expect(function() {
    var counter = new Aes.Counter(1.5);
  }).toThrowError(Error);
  expect(function(error) {
    return error.message === "invalid counter value (must be an integer)";
  }).toThrowError(Error);

  var counter = new Aes.Counter();
  expect(function() {
    counter.setValue(1.5);
  }).toThrowError(Error);
  expect(function(error) {
    return error.message === "invalid counter value (must be an integer)";
  }).toThrowError(Error);

  expect(function() {
    var counter = new Aes.Counter(Number.MAX_SAFE_INTEGER + 1);
  }).toThrowError(Error);
  expect(function(error) {
    return error.message === "integer value out of safe range";
  }).toThrowError(Error);

  var badThings = [0, 1.5, 1];
  for (var i = 0; i < badThings.length; i++) {
    var counter = new Aes.Counter();
    expect(function() {
      counter.setBytes(badThings[i]);
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "unsupported array-like object";
    }).toThrowError(Error);
  }

  var badThings = [1.5, "foobar", {}];
  for (var i = 0; i < badThings.length; i++) {
    var counter = new Aes.Counter();
    expect(function() {
      counter.setBytes(badThings[i]);
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "unsupported array-like object";
    }).toThrowError(Error);

    var counter = new Aes.Counter();
    expect(function() {
      counter.setValue(badThings[i]);
    }).toThrowError(Error);
    expect(function(error) {
      return error.message === "invalid counter value (must be an integer)";
    }).toThrowError(Error);
  }
});
