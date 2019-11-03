"use strict";

const { Aes } = require("../../");

function bufferEqual(a, b) {
  if (a.length != b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

test("test-padding", function() {
  for (var size = 0; size < 100; size++) {
    // Create a random piece of data
    var data = [];
    for (var i = 0; i < size; i++) {
      data.push(42);
    }

    // Pad it
    var padded = Aes.padding.pkcs7.pad(data);
    expect(padded.length % 16).toBe(0);
    expect(
      data.length <= padded.length && padded.length <= data.length + 16,
    ).toBe(true);
    expect(
      padded[padded.length - 1] >= 1 && padded[padded.length - 1] <= 16,
    ).toBe(true);

    // Trim it
    var trimmed = Aes.padding.pkcs7.strip(padded);
    expect(bufferEqual(data, trimmed)).toBe(true); //"Failed to trim to original data"
  }
});
