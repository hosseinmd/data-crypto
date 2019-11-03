/**
 * Converts hexadecimal code to binary code
 * @param {string} A string containing single digit hexadecimal numbers  e.g. '1d'
 * @return {string} A string containing binary numbers e.g. '00011101'
 */
function hexToBinary(text) {
  let result = "";

  for (let nibble of text) {
    result = result.concat(
      parseInt(nibble, 16)
        .toString(2)
        .padStart(4, "0"),
    );
  }

  return result;
}
/**
 * Converts binary code to hexadecimal string
 * @param {string} binaryString A string containing binary numbers e.g. '00011101'
 * @return {string} A string containing the hexadecimal numbers e.g. '1d'
 */
function binaryToHex(text) {
  let result = "";
  for (let i = 0; i < text.length; i += 4) {
    // Grab a chunk of 4 bits
    const bytes = text.substr(i, 4);

    // Convert to decimal then hexadecimal
    const decimal = parseInt(bytes, 2);
    const hex = decimal.toString(16);

    // Uppercase all the letters and append to output
    result = result.concat(hex.toUpperCase());
  }

  return result;
}

const convertUtf8 = {
  toBytes(text) {
    const result = [],
      i = 0;
    text = encodeURI(text);
    while (i < text.length) {
      const c = text.charCodeAt(i++);

      // if it is a % sign, encode the following 2 bytes as a hex value
      if (c === 37) {
        result.push(parseInt(text.substr(i, 2), 16));
        i += 2;

        // otherwise, just the actual byte
      } else {
        result.push(c);
      }
    }

    return coerceArray(result);
  },

  fromBytes(bytes) {
    const result = [],
      i = 0;

    while (i < bytes.length) {
      const c = bytes[i];

      if (c < 128) {
        result.push(String.fromCharCode(c));
        i++;
      } else if (c > 191 && c < 224) {
        result.push(
          String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)),
        );
        i += 2;
      } else {
        result.push(
          String.fromCharCode(
            ((c & 0x0f) << 12) |
              ((bytes[i + 1] & 0x3f) << 6) |
              (bytes[i + 2] & 0x3f),
          ),
        );
        i += 3;
      }
    }

    return result.join("");
  },
};

function hexToBytes(text) {
  const result = [];
  for (let i = 0; i < text.length; i += 2) {
    result.push(parseInt(text.substr(i, 2), 16));
  }

  return result;
}
// http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html

function bytesToHex(bytes) {
  const result = [];
  for (let i = 0; i < bytes.length; i++) {
    // Convert to decimal then hexadecimal
    const decimal = parseInt(bytes[i], 2);
    const hex = decimal.toString(16);

    // Uppercase all the letters and append to output
    result = result.concat();

    result.push(hex.toUpperCase());
  }
  return result.join("");
}

function convertToInt32(bytes) {
  const result = [];
  for (let i = 0; i < bytes.length; i += 4) {
    result.push(
      (bytes[i] << 24) |
        (bytes[i + 1] << 16) |
        (bytes[i + 2] << 8) |
        bytes[i + 3],
    );
  }
  return result;
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

/**
 * Convert number to hexadecimal
 * @param {number} num Decimal
 * @returns {string} Hexadecimal
 */
function numToHex(num) {
  return Number(num)
    .toString(16)
    .padStart(2, "0");
}

function randomHexNibble() {
  return randomIntFromInterval(0, 15).toString(16);
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkInts(arrayish) {
  if (!Number.isInteger(arrayish.length)) {
    return false;
  }

  for (let i = 0; i < arrayish.length; i++) {
    if (
      !Number.isInteger(arrayish[i]) ||
      arrayish[i] < 0 ||
      arrayish[i] > 255
    ) {
      return false;
    }
  }

  return true;
}

function coerceArray(arg, copy) {
  // ArrayBuffer view
  if (arg.buffer && arg.name === "Uint8Array") {
    if (copy) {
      if (arg.slice) {
        arg = arg.slice();
      } else {
        arg = Array.prototype.slice.call(arg);
      }
    }

    return arg;
  }

  // It's an array; check it is a valid representation of a byte
  if (Array.isArray(arg)) {
    if (!checkInts(arg)) {
      throw new Error("Array contains invalid value: " + arg);
    }

    return new Uint8Array(arg);
  }

  // Something else, but behaves like an array (maybe a Buffer? Arguments?)
  if (Number.isInteger(arg.length) && checkInts(arg)) {
    return new Uint8Array(arg);
  }

  throw new Error("unsupported array-like object");
}

function createArray(length) {
  return new Uint8Array(length);
}

function copyArray(
  sourceArray,
  targetArray,
  targetStart,
  sourceStart,
  sourceEnd,
) {
  if (sourceStart != null || sourceEnd != null) {
    if (sourceArray.slice) {
      sourceArray = sourceArray.slice(sourceStart, sourceEnd);
    } else {
      sourceArray = Array.prototype.slice.call(
        sourceArray,
        sourceStart,
        sourceEnd,
      );
    }
  }
  targetArray.set(sourceArray, targetStart);
}

module.exports = {
  numToHex,
  xor_,
  permute,
  binaryToHex,
  hexToBinary,
  convertUtf8,
  hexToBytes,
  bytesToHex,
  convertToInt32,
  randomHexNibble,
  randomIntFromInterval,
  checkInts,
  coerceArray,
  createArray,
  copyArray,
};
