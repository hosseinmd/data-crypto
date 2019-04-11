const { numToHex } = require("./utils");

function pinBlock(PAN, PIN) {
  const PANLen = PAN.length;
  const PINLen = PIN.length;
  const code = [[0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], []];
  const index = PANLen - 13; 
  code[0][0] = PINLen;
  for (let i = 0; i < PINLen / 2; i++)
    code[0][i + 1] = parseInt(PIN[2 * i]) * 16 + parseInt(PIN[2 * i + 1]);

  if (PINLen % 2 != 0)
    code[0][PINLen / 2 + 1] = parseInt(PIN[PINLen - 1]) * 16 + 15;

  code[1][0] = 0;
  code[1][1] = 0;
  code[1][2] = parseInt(PAN[index]) * 16 + parseInt(PAN[index + 1]);
  code[1][3] = parseInt(PAN[index + 2]) * 16 + parseInt(PAN[index + 3]);
  code[1][4] = parseInt(PAN[index + 4]) * 16 + parseInt(PAN[index + 5]);
  code[1][5] = parseInt(PAN[index + 6]) * 16 + parseInt(PAN[index + 7]);
  code[1][6] = parseInt(PAN[index + 8]) * 16 + parseInt(PAN[index + 9]);
  code[1][7] = parseInt(PAN[index + 10]) * 16 + parseInt(PAN[index + 11]);

  for (let counter = 0; counter < 8; counter++) {
    code[0][counter] = numToHex(code[0][counter] ^ code[1][counter]);
  }

  return code[0].join("");
}

module.exports = pinBlock;
