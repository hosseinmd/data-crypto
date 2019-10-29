function hex2bin(s) {
  // hexadecimal to binary conversion
  s = s.toUpperCase();
  let mp = {};
  mp["0"] = "0000";
  mp["1"] = "0001";
  mp["2"] = "0010";
  mp["3"] = "0011";
  mp["4"] = "0100";
  mp["5"] = "0101";
  mp["6"] = "0110";
  mp["7"] = "0111";
  mp["8"] = "1000";
  mp["9"] = "1001";
  mp["A"] = "1010";
  mp["B"] = "1011";
  mp["C"] = "1100";
  mp["D"] = "1101";
  mp["E"] = "1110";
  mp["F"] = "1111";
  let bin = "";
  for (let i = 0; i < s.length; i++) {
    bin += mp[s[i]];
  }
  return bin;
}
function bin2hex(s) {
  // binary to hexadecimal conversion
  const mp = {};
  mp["0000"] = "0";
  mp["0001"] = "1";
  mp["0010"] = "2";
  mp["0011"] = "3";
  mp["0100"] = "4";
  mp["0101"] = "5";
  mp["0110"] = "6";
  mp["0111"] = "7";
  mp["1000"] = "8";
  mp["1001"] = "9";
  mp["1010"] = "A";
  mp["1011"] = "B";
  mp["1100"] = "C";
  mp["1101"] = "D";
  mp["1110"] = "E";
  mp["1111"] = "F";
  let hex = "";
  for (let i = 0; i < s.length; i += 4) {
    let ch = "";
    ch += s[i];
    ch += s[i + 1];
    ch += s[i + 2];
    ch += s[i + 3];
    hex += mp[ch];
  }
  return hex;
}

function permute(k, arr, n) {
  let per = "";
  for (let i = 0; i < n; i++) {
    per += k[arr[i] - 1];
  }
  return per;
}

function xor_(a, b) {
  let ans = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] == b[i]) {
      ans += "0";
    } else {
      ans += "1";
    }
  }
  return ans;
}
var numToHex = function(num) {
  var hex = Number(num).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

function randomHexNibble() {
  return randomIntFromInterval(0, 15).toString(16);
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  numToHex,
  xor_,
  permute,
  bin2hex,
  hex2bin,
  randomHexNibble,
  randomIntFromInterval,
};
