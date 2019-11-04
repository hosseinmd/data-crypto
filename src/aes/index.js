"use strict";
const {
  coerceArray,
  createArray,
  copyArray,
  convertToInt32,
} = require("../utils");
const {
  numberOfRounds,
  rcon,
  S,
  Si,
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  U1,
  U2,
  U3,
  U4,
} = require("./consts");

/**
 * @typedef {Buffer | Array | Uint8Array} Bytes
 */

class AES {
  constructor(key) {
    if (!(this instanceof AES)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.key = coerceArray(key, true);
    this._prepare();
  }
  _prepare() {
    const rounds = numberOfRounds[this.key.length];
    if (rounds == null) {
      throw new Error("invalid key size (must be 16, 24 or 32 bytes)");
    }
    // encryption round keys
    this._Ke = [];
    // decryption round keys
    this._Kd = [];
    for (let i = 0; i <= rounds; i++) {
      this._Ke.push([0, 0, 0, 0]);
      this._Kd.push([0, 0, 0, 0]);
    }
    const roundKeyCount = (rounds + 1) * 4;
    const KC = this.key.length / 4;
    // convert the key into ints
    const tk = convertToInt32(this.key);
    // copy values into round key arrays
    let index;
    for (let i = 0; i < KC; i++) {
      index = i >> 2;
      this._Ke[index][i % 4] = tk[i];
      this._Kd[rounds - index][i % 4] = tk[i];
    }
    // key expansion (fips-197 section 5.2)
    let rconpointer = 0;
    let t = KC,
      tt;
    while (t < roundKeyCount) {
      tt = tk[KC - 1];
      tk[0] ^=
        (S[(tt >> 16) & 0xff] << 24) ^
        (S[(tt >> 8) & 0xff] << 16) ^
        (S[tt & 0xff] << 8) ^
        S[(tt >> 24) & 0xff] ^
        (rcon[rconpointer] << 24);
      rconpointer += 1;
      // key expansion (for non-256 bit)
      if (KC != 8) {
        for (let i = 1; i < KC; i++) {
          tk[i] ^= tk[i - 1];
        }
        // key expansion for 256-bit keys is "slightly different" (fips-197)
      } else {
        for (let i = 1; i < KC / 2; i++) {
          tk[i] ^= tk[i - 1];
        }
        tt = tk[KC / 2 - 1];
        tk[KC / 2] ^=
          S[tt & 0xff] ^
          (S[(tt >> 8) & 0xff] << 8) ^
          (S[(tt >> 16) & 0xff] << 16) ^
          (S[(tt >> 24) & 0xff] << 24);
        for (let i = KC / 2 + 1; i < KC; i++) {
          tk[i] ^= tk[i - 1];
        }
      }
      // copy values into round key arrays
      let i = 0,
        r,
        c;
      while (i < KC && t < roundKeyCount) {
        r = t >> 2;
        c = t % 4;
        this._Ke[r][c] = tk[i];
        this._Kd[rounds - r][c] = tk[i++];
        t++;
      }
    }
    // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
    for (let r = 1; r < rounds; r++) {
      for (let c = 0; c < 4; c++) {
        tt = this._Kd[r][c];
        this._Kd[r][c] =
          U1[(tt >> 24) & 0xff] ^
          U2[(tt >> 16) & 0xff] ^
          U3[(tt >> 8) & 0xff] ^
          U4[tt & 0xff];
      }
    }
  }
  encrypt(plaintext) {
    if (plaintext.length != 16) {
      throw new Error("invalid plaintext size (must be 16 bytes)");
    }
    const rounds = this._Ke.length - 1;
    const a = [0, 0, 0, 0];
    // convert plaintext to (ints ^ key)
    let t = convertToInt32(plaintext);
    for (let i = 0; i < 4; i++) {
      t[i] ^= this._Ke[0][i];
    }
    // apply round transforms
    for (let r = 1; r < rounds; r++) {
      for (let i = 0; i < 4; i++) {
        a[i] =
          T1[(t[i] >> 24) & 0xff] ^
          T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
          T3[(t[(i + 2) % 4] >> 8) & 0xff] ^
          T4[t[(i + 3) % 4] & 0xff] ^
          this._Ke[r][i];
      }
      t = a.slice();
    }
    // the last round is special
    const result = createArray(16);
    let tt;
    for (let i = 0; i < 4; i++) {
      tt = this._Ke[rounds][i];
      result[4 * i] = (S[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
      result[4 * i + 1] =
        (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
      result[4 * i + 2] = (S[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
      result[4 * i + 3] = (S[t[(i + 3) % 4] & 0xff] ^ tt) & 0xff;
    }
    return result;
  }
  decrypt(ciphertext) {
    if (ciphertext.length != 16) {
      throw new Error("invalid ciphertext size (must be 16 bytes)");
    }
    const rounds = this._Kd.length - 1;
    const a = [0, 0, 0, 0];
    // convert plaintext to (ints ^ key)
    let t = convertToInt32(ciphertext);
    for (let i = 0; i < 4; i++) {
      t[i] ^= this._Kd[0][i];
    }
    // apply round transforms
    for (let r = 1; r < rounds; r++) {
      for (let i = 0; i < 4; i++) {
        a[i] =
          T5[(t[i] >> 24) & 0xff] ^
          T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
          T7[(t[(i + 2) % 4] >> 8) & 0xff] ^
          T8[t[(i + 1) % 4] & 0xff] ^
          this._Kd[r][i];
      }
      t = a.slice();
    }
    // the last round is special
    const result = createArray(16);
    let tt;
    for (let i = 0; i < 4; i++) {
      tt = this._Kd[rounds][i];
      result[4 * i] = (Si[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
      result[4 * i + 1] =
        (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
      result[4 * i + 2] = (Si[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
      result[4 * i + 3] = (Si[t[(i + 1) % 4] & 0xff] ^ tt) & 0xff;
    }
    return result;
  }
}
/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
class ModeOfOperationECB {
  constructor(key) {
    if (!(this instanceof ModeOfOperationECB)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.description = "Electronic Code Block";
    this.name = "ecb";
    this._aes = new AES(key);
  }
  encrypt(plaintext) {
    plaintext = coerceArray(plaintext);
    if (plaintext.length % 16 !== 0) {
      throw new Error("invalid plaintext size (must be multiple of 16 bytes)");
    }
    const ciphertext = createArray(plaintext.length);
    let block = createArray(16);
    for (let i = 0; i < plaintext.length; i += 16) {
      copyArray(plaintext, block, 0, i, i + 16);
      block = this._aes.encrypt(block);
      copyArray(block, ciphertext, i);
    }
    return ciphertext;
  }
  decrypt(ciphertext) {
    ciphertext = coerceArray(ciphertext);
    if (ciphertext.length % 16 !== 0) {
      throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");
    }
    const plaintext = createArray(ciphertext.length);
    let block = createArray(16);
    for (let i = 0; i < ciphertext.length; i += 16) {
      copyArray(ciphertext, block, 0, i, i + 16);
      block = this._aes.decrypt(block);
      copyArray(block, plaintext, i);
    }
    return plaintext;
  }
}
/**
 *  Mode Of Operation - Cipher Block Chaining (CBC)
 */
class ModeOfOperationCBC {
  constructor(key, iv) {
    if (!(this instanceof ModeOfOperationCBC)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.description = "Cipher Block Chaining";
    this.name = "cbc";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error("invalid initialation vector size (must be 16 bytes)");
    }
    this._lastCipherblock = coerceArray(iv, true);
    this._aes = new AES(key);
  }
  encrypt(plaintext) {
    plaintext = coerceArray(plaintext);
    if (plaintext.length % 16 !== 0) {
      throw new Error("invalid plaintext size (must be multiple of 16 bytes)");
    }
    const ciphertext = createArray(plaintext.length);
    const block = createArray(16);
    for (var i = 0; i < plaintext.length; i += 16) {
      copyArray(plaintext, block, 0, i, i + 16);
      for (var j = 0; j < 16; j++) {
        block[j] ^= this._lastCipherblock[j];
      }
      this._lastCipherblock = this._aes.encrypt(block);
      copyArray(this._lastCipherblock, ciphertext, i);
    }
    return ciphertext;
  }
  decrypt(ciphertext) {
    ciphertext = coerceArray(ciphertext);
    if (ciphertext.length % 16 !== 0) {
      throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");
    }
    const plaintext = createArray(ciphertext.length);
    let block = createArray(16);
    for (let i = 0; i < ciphertext.length; i += 16) {
      copyArray(ciphertext, block, 0, i, i + 16);
      block = this._aes.decrypt(block);
      for (let j = 0; j < 16; j++) {
        plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
      }
      copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
    }
    return plaintext;
  }
}
/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
class ModeOfOperationCFB {
  constructor(key, iv, segmentSize) {
    if (!(this instanceof ModeOfOperationCFB)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.description = "Cipher Feedback";
    this.name = "cfb";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error("invalid initialation vector size (must be 16 size)");
    }
    if (!segmentSize) {
      segmentSize = 1;
    }
    this.segmentSize = segmentSize;
    this._shiftRegister = coerceArray(iv, true);
    this._aes = new AES(key);
  }
  encrypt(plaintext) {
    if (plaintext.length % this.segmentSize != 0) {
      throw new Error("invalid plaintext size (must be segmentSize bytes)");
    }
    const encrypted = coerceArray(plaintext, true);
    let xorSegment;
    for (let i = 0; i < encrypted.length; i += this.segmentSize) {
      xorSegment = this._aes.encrypt(this._shiftRegister);
      for (let j = 0; j < this.segmentSize; j++) {
        encrypted[i + j] ^= xorSegment[j];
      }
      // Shift the register
      copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
      copyArray(
        encrypted,
        this._shiftRegister,
        16 - this.segmentSize,
        i,
        i + this.segmentSize,
      );
    }
    return encrypted;
  }
  decrypt(ciphertext) {
    if (ciphertext.length % this.segmentSize != 0) {
      throw new Error("invalid ciphertext size (must be segmentSize bytes)");
    }
    const plaintext = coerceArray(ciphertext, true);
    let xorSegment;
    for (var i = 0; i < plaintext.length; i += this.segmentSize) {
      xorSegment = this._aes.encrypt(this._shiftRegister);
      for (var j = 0; j < this.segmentSize; j++) {
        plaintext[i + j] ^= xorSegment[j];
      }
      // Shift the register
      copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
      copyArray(
        ciphertext,
        this._shiftRegister,
        16 - this.segmentSize,
        i,
        i + this.segmentSize,
      );
    }
    return plaintext;
  }
}

/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
class ModeOfOperationOFB {
  constructor(key, iv) {
    if (!(this instanceof ModeOfOperationOFB)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.description = "Output Feedback";
    this.name = "ofb";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error("invalid initialation vector size (must be 16 bytes)");
    }
    this._lastPrecipher = coerceArray(iv, true);
    this._lastPrecipherIndex = 16;
    this._aes = new AES(key);
  }
  encrypt(plaintext) {
    const encrypted = coerceArray(plaintext, true);
    for (let i = 0; i < encrypted.length; i++) {
      if (this._lastPrecipherIndex === 16) {
        this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
        this._lastPrecipherIndex = 0;
      }
      encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
    }
    return encrypted;
  }
  // Decryption is symetric
  decrypt(plaintext) {
    return this.encrypt(plaintext);
  }
}

/**
 *  Counter object for CTR common mode of operation
 */
class Counter {
  constructor(initialValue) {
    if (!(this instanceof Counter)) {
      throw Error("Counter must be instanitated with `new`");
    }
    // We allow 0, but anything false-ish uses the default 1
    if (initialValue !== 0 && !initialValue) {
      initialValue = 1;
    }
    if (typeof initialValue === "number") {
      this._counter = createArray(16);
      this.setValue(initialValue);
    } else {
      this.setBytes(initialValue);
    }
  }
  setValue(value) {
    if (typeof value !== "number" || parseInt(value) != value) {
      throw new Error("invalid counter value (must be an integer)");
    }
    // We cannot safely handle numbers beyond the safe range for integers
    if (value > Number.MAX_SAFE_INTEGER) {
      throw new Error("integer value out of safe range");
    }
    for (let index = 15; index >= 0; --index) {
      this._counter[index] = value % 256;
      value = parseInt(value / 256);
    }
  }
  setBytes(bytes) {
    bytes = coerceArray(bytes, true);
    if (bytes.length != 16) {
      throw new Error("invalid counter bytes size (must be 16 bytes)");
    }
    this._counter = bytes;
  }
  increment() {
    for (let i = 15; i >= 0; i--) {
      if (this._counter[i] === 255) {
        this._counter[i] = 0;
      } else {
        this._counter[i]++;
        break;
      }
    }
  }
}

/**
 *  Mode Of Operation - Counter (CTR)
 */
class ModeOfOperationCTR {
  /**
   *
   * @param {Bytes} key
   * @param {Counterƒ} [counter]
   */
  constructor(key, counter) {
    if (!(this instanceof ModeOfOperationCTR)) {
      throw Error("AES must be instanitated with `new`");
    }
    this.description = "Counter";
    this.name = "ctr";
    if (!(counter instanceof Counter)) {
      counter = new Counter(counter);
    }
    this._counter = counter;
    this._remainingCounter = null;
    this._remainingCounterIndex = 16;
    this._aes = new AES(key);
  }
  /**
   * @param {Bytes} plaintext
   * @returns {Uint8Array}
   */
  encrypt(plaintext) {
    const encrypted = coerceArray(plaintext, true);
    for (let i = 0; i < encrypted.length; i++) {
      if (this._remainingCounterIndex === 16) {
        this._remainingCounter = this._aes.encrypt(this._counter._counter);
        this._remainingCounterIndex = 0;
        this._counter.increment();
      }
      encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
    }
    return encrypted;
  }
  /**
   * @param {Bytes} plaintext
   * @returns {Uint8Array}
   */
  decrypt(plaintext) {
    return this.encrypt(plaintext);
  }
}

///////////////////////
// Padding

// See:https://tools.ietf.org/html/rfc2315
function pkcs7pad(data) {
  data = coerceArray(data, true);
  const padder = 16 - (data.length % 16);
  const result = createArray(data.length + padder);
  copyArray(data, result);
  for (var i = data.length; i < result.length; i++) {
    result[i] = padder;
  }
  return result;
}

function pkcs7strip(data) {
  data = coerceArray(data, true);
  if (data.length < 16) {
    throw new Error("PKCS#7 invalid length");
  }

  const padder = data[data.length - 1];
  if (padder > 16) {
    throw new Error("PKCS#7 padding byte out of range");
  }

  const length = data.length - padder;
  for (var i = 0; i < padder; i++) {
    if (data[length + i] !== padder) {
      throw new Error("PKCS#7 invalid padding byte");
    }
  }

  const result = createArray(length);
  copyArray(data, result, 0, 0, length);
  return result;
}

///////////////////////
// Exporting

// The block cipher
const Aes = {
  AES: AES,
  Counter: Counter,

  ModeOfOperation: {
    ecb: ModeOfOperationECB,
    cbc: ModeOfOperationCBC,
    cfb: ModeOfOperationCFB,
    ofb: ModeOfOperationOFB,
    ctr: ModeOfOperationCTR,
  },

  padding: {
    pkcs7: {
      pad: pkcs7pad,
      strip: pkcs7strip,
    },
  },

  _arrayTest: {
    coerceArray: coerceArray,
    createArray: createArray,
    copyArray: copyArray,
  },
};

module.exports = Aes;

// global.Buffer = global.Buffer || require('buffer').Buffer
