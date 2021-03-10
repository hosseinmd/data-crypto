"use strict";
import { Aes } from "../../";

function newBuffer(length) {
  const buffer = Buffer.alloc(length);
  buffer.fill(42);
  return buffer;
}

// Invalid key sizes to try
const keySizes = [0, 1, 2, 7, 8, 9, 15, 17, 23, 25, 31, 33, 100];

test("test-errors-key-size", function () {
  for (let i = 0; i < keySizes.length; i++) {
    expect(function () {
      const moo = new Aes.ModeOfOperation.ecb(newBuffer(keySizes[i]));
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "invalid key size (must be 16, 24 or 32 bytes)";
    }).toThrowError(Error);
  }
});

test("test-errors-iv-size", function () {
  const ivSizes = [0, 15, 17, 100];
  for (let i = 0; i < 3; i++) {
    const keySize = 16 + i * 8;

    for (let j = 0; j < ivSizes.length; j++) {
      expect(function () {
        const moo = new Aes.ModeOfOperation.cbc(
          newBuffer(keySize),
          newBuffer(ivSizes[j]),
        );
      }).toThrowError(Error);
      expect(function (error) {
        return (
          error.message ===
          "invalid initialation vector size (must be 16 bytes)"
        );
      }).toThrowError(Error);

      expect(function () {
        const moo = new Aes.ModeOfOperation.ofb(
          newBuffer(keySize),
          newBuffer(ivSizes[j]),
        );
      }).toThrowError(Error);
      expect(function (error) {
        return (
          error.message ===
          "invalid initialation vector size (must be 16 bytes)"
        );
      }).toThrowError(Error);
    }
  }
});

test("test-errors-segment-size", function () {
  const key = newBuffer(16);
  const iv = newBuffer(16);
  for (let i = 1; i < 17; i++) {
    for (let j = 1; j < 17; j++) {
      if (j % i === 0) {
        continue;
      }

      const moo = new Aes.ModeOfOperation.cfb(key, iv, i);

      expect(function () {
        moo.encrypt(newBuffer(j));
      }).toThrowError(Error);
      expect(function (error) {
        return (
          error.message === "invalid plaintext size (must be segmentSize bytes)"
        );
      }).toThrowError(Error);
    }
  }
});

test("test-errors-text-size", function () {
  const textSizes = [1, 2, 15, 17, 31, 33];

  for (let i = 0; i < 3; i++) {
    const key = newBuffer(16 + i * 8);
    let moo;
    for (let j = 0; j < textSizes.length; j++) {
      for (let k = 0; k < 2; k++) {
        const text = newBuffer(textSizes[j]);
        if (k === 0) {
          moo = new Aes.ModeOfOperation.ecb(key);
        } else {
          moo = new Aes.ModeOfOperation.cbc(key, newBuffer(16));
        }

        expect(function () {
          moo.encrypt(text);
        }).toThrowError(Error);
        expect(function (error) {
          return (
            error.message ===
            "invalid plaintext size (must be multiple of 16 bytes)"
          );
        }).toThrowError(Error);
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    const key = newBuffer(16 + i * 8);
    let moo;
    for (let j = 0; j < textSizes.length; j++) {
      for (let k = 0; k < 2; k++) {
        const text = newBuffer(textSizes[j]);
        if (k === 0) {
          moo = new Aes.ModeOfOperation.ecb(key);
        } else {
          moo = new Aes.ModeOfOperation.cbc(key, newBuffer(16));
        }

        expect(function () {
          moo.decrypt(text);
        }).toThrowError(Error);
        expect(function (error) {
          return (
            error.message ===
            "invalid ciphertext size (must be multiple of 16 bytes)"
          );
        }).toThrowError(Error);
      }
    }
  }
});

test("test-errors-counter", function () {
  const textSizes = [0, 1, 2, 15, 17];
  for (let i = 0; i < textSizes.length; i++) {
    expect(function () {
      const counter = new Aes.Counter(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "invalid counter bytes size (must be 16 bytes)";
    }).toThrowError(Error);

    let counter = new Aes.Counter();
    expect(function () {
      counter.setBytes(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "invalid counter bytes size (must be 16 bytes)";
    }).toThrowError(Error);

    counter = new Aes.Counter();
    expect(function () {
      counter.setValue(newBuffer(textSizes[i]));
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "invalid counter value (must be an integer)";
    }).toThrowError(Error);
  }

  expect(function () {
    const counter = new Aes.Counter(1.5);
  }).toThrowError(Error);
  expect(function (error) {
    return error.message === "invalid counter value (must be an integer)";
  }).toThrowError(Error);

  const counter = new Aes.Counter();
  expect(function () {
    counter.setValue(1.5);
  }).toThrowError(Error);
  expect(function (error) {
    return error.message === "invalid counter value (must be an integer)";
  }).toThrowError(Error);

  expect(function () {
    const counter = new Aes.Counter(Number.MAX_SAFE_INTEGER + 1);
  }).toThrowError(Error);
  expect(function (error) {
    return error.message === "integer value out of safe range";
  }).toThrowError(Error);

  const badThings = [0, 1.5, 1];
  for (let i = 0; i < badThings.length; i++) {
    const counter = new Aes.Counter();
    expect(function () {
      counter.setBytes(badThings[i]);
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "unsupported array-like object";
    }).toThrowError(Error);
  }

  const badThings2 = [1.5, "foobar", {}];
  for (let i = 0; i < badThings2.length; i++) {
    let counter = new Aes.Counter();
    expect(function () {
      counter.setBytes(badThings2[i]);
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "unsupported array-like object";
    }).toThrowError(Error);

    counter = new Aes.Counter();
    expect(function () {
      counter.setValue(badThings2[i]);
    }).toThrowError(Error);
    expect(function (error) {
      return error.message === "invalid counter value (must be an integer)";
    }).toThrowError(Error);
  }
});
