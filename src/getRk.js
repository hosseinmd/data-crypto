const { permute, hex2bin } = require("./utils");

function shift_left(k, shifts) {
  let s = "";
  for (let i = 0; i < shifts; i++) {
    for (let j = 1; j < 28; j++) {
      s += k[j];
    }
    s += k[0];
    k = s;
    s = "";
  }
  return k;
}

module.exports = function getRk(keyHex) {
  const _KEY_PERMUTE = [
    57,
    49,
    41,
    33,
    25,
    17,
    9,
    1,
    58,
    50,
    42,
    34,
    26,
    18,
    10,
    2,
    59,
    51,
    43,
    35,
    27,
    19,
    11,
    3,
    60,
    52,
    44,
    36,
    63,
    55,
    47,
    39,
    31,
    23,
    15,
    7,
    62,
    54,
    46,
    38,
    30,
    22,
    14,
    6,
    61,
    53,
    45,
    37,
    29,
    21,
    13,
    5,
    28,
    20,
    12,
    4,
  ];
  const _KEY_COMP = [
    14,
    17,
    11,
    24,
    1,
    5,
    3,
    28,
    15,
    6,
    21,
    10,
    23,
    19,
    12,
    4,
    26,
    8,
    16,
    7,
    27,
    20,
    13,
    2,
    41,
    52,
    31,
    37,
    47,
    55,
    30,
    40,
    51,
    45,
    33,
    48,
    44,
    49,
    39,
    56,
    34,
    53,
    46,
    42,
    50,
    36,
    29,
    32,
  ];
  const _SHIFT_TABLE = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  key = hex2bin(keyHex);

  //Parity bit drop table

  //getting 56 bit key from 64 bit using the parity bits
  key = permute(key, _KEY_PERMUTE, 56); // key without parity

  //Number of bit shifts

  //Key- Compression Table

  //Splitting
  let left = key.substr(0, 28);
  let right = key.substr(28, 28);

  let rkb = []; //rkb for RoundKeys in binary
  for (let i = 0; i < 16; i++) {
    //Shifting
    left = shift_left(left, _SHIFT_TABLE[i]);
    right = shift_left(right, _SHIFT_TABLE[i]);

    //Combining
    let combine = left + right;

    //Key Compression
    let RoundKey = permute(combine, _KEY_COMP, 48);

    rkb.push(RoundKey);
  }
  return rkb;
};
