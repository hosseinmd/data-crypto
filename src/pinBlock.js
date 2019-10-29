const { numToHex, randomHex } = require("./utils");

/**
 * @deprecated please use pinBlockFormat0
 */
function pinBlock(PAN, PIN) {
  return pinBlockFormat0(PAN, PIN);
}

/**
 * ISO 9564-1 Format 0. An `ISO-0` PIN block format is equivalent to the `ANSI X9.8`,` VISA-1`,
 * and `ECI-1` PIN block formats and is similar to a VISA-4 PIN block format.
 * @param {string} PAN 16 digits
 * @param {string} PIN supports a PIN from 4 to 12 digits in length.A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat0(PAN, PIN) {
  const PANLen = PAN.length;
  const PINLen = PIN.length;
  const code = [[0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], []];
  const index = PANLen - 13;
  code[0][0] = PINLen;
  for (let i = 0; i < parseInt(PINLen / 2); i++)
    code[0][i + 1] = parseInt(PIN[2 * i]) * 16 + parseInt(PIN[2 * i + 1]);

  if (PINLen % 2 != 0)
    code[0][parseInt(PINLen / 2) + 1] = parseInt(PIN[PINLen - 1]) * 16 + 15;

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

  return code[0].join("").toUpperCase();
}

/**
 * ISO 9564-1:2003 Format 1. The `ISO-1` PIN block format is equivalent to an `ECI-4` PIN block format and is recommended for usage where no PAN data is available.
 * @param {string} PIN supports a PIN from 4 to 12 digits in length. A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat1(PIN) {
  const PINLen = PIN.length;

  let code = "1" + PINLen.toString(16) + PIN;

  for (let i = code.length; i < 16; i++) {
    code = code.concat(randomHex());
  }

  return code;
}

exports.pinBlock = pinBlock;
exports.pinBlockFormat0 = pinBlockFormat0;
exports.pinBlockFormat1 = pinBlockFormat1;
