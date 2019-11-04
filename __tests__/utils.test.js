var { bytesToHex } = require("../index");

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

test("hex to bytes then bytes to hex", () => {
  var hexString = "1C1C1C1C08198415156472801C11234656C1C1";

  const bytesArray = Buffer.from(hexString, "hex");
  expect(bytesToHex(bytesArray)).toBe(hexString);
});

test("bytes to hex then hex to bytes ", () => {
  var bytes = [
    215,
    238,
    74,
    62,
    188,
    204,
    110,
    226,
    60,
    165,
    249,
    53,
    192,
    105,
    170,
    242,
  ];
  const hexString = bytesToHex(bytes);
  expect(bufferEqual(Buffer.from(hexString, "hex"), bytes)).toBe(true);
});
