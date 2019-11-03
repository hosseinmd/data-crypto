"use strict";
const { Aes } = require("../../");

var slowCreateBuffer = Aes._arrayTest.coerceArray;

var testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var testBuffer = Buffer.from(testArray);

// We mimic some weird non-array-but-sortof-like-an-array object that people on
// obscure browsers seem to have problems with, for the purpose of testing our
// slowCreateBuffer.
function WeirdBuffer(data) {
  this.length = data.length;
  for (var i = 0; i < data.length; i++) {
    this[i] = data[i];
  }
}

function buffersEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

test("test-slowCreate", () => {
  //var result = new AES(testArray).key;
  var result = slowCreateBuffer(testArray);
  expect(buffersEqual(testArray, result)).toBe(true);

  result = slowCreateBuffer(testBuffer);
  expect(buffersEqual(testBuffer, result)).toBe(true);

  result = slowCreateBuffer(new WeirdBuffer(testArray));
  expect(buffersEqual(testBuffer, result)).toBe(true);
});
