/* eslint-disable no-bitwise */

import { Bytes } from "./types";

/**
 * Convert a byte to a hex string
 *
 * @param {number} byte
 * @returns {string}
 */
function byteToHex(byte: number): string {
  return parseInt(String(byte), 10).toString(16).padStart(2, "0").toUpperCase();
}

/**
 * Convert a hex to a byte
 *
 * @param {string} hex
 * @returns {number}
 */
function hexToByte(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Converts hexadecimal code to binary code
 *
 * @param {string} A String containing single digit hexadecimal numbers e.g. '1d'
 * @returns {string} A string containing binary numbers e.g. '00011101'
 */
function hexToBinary(text: string): string {
  let result = "";

  for (const nibble of text) {
    result = result.concat(parseInt(nibble, 16).toString(2).padStart(4, "0"));
  }

  return result;
}
/**
 * Converts binary code to hexadecimal string
 *
 * @param {string} binaryString A string containing binary numbers e.g. '00011101'
 * @returns {string} A string containing the hexadecimal numbers e.g. '1d'
 */
function binaryToHex(text: string): string {
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

/**
 * XOR two String or buffer
 *
 * @param {string | Buffer} first String or Buffer
 * @param {string | Buffer} second String or Buffer
 * @param {BufferEncoding} encode Defualt is 16 "hex"
 * @returns {Buffer}
 */
function xor(first: any, second: any, encode = "hex"): Buffer {
  const fistByteBuffer = Buffer.isBuffer(first)
    ? first
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      Buffer.from(first, encode);
  const secondByteBuffer = Buffer.isBuffer(second)
    ? second
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      Buffer.from(second, encode);

  const result = Buffer.allocUnsafe(fistByteBuffer.length);
  for (let i = 0; i < fistByteBuffer.length; i++) {
    const firstByte = fistByteBuffer[i];
    const secondByte = secondByteBuffer[i];
    result.fill(firstByte ^ secondByte, i);
  }
  return result;
}

function convertToInt32(bytes: number[] | Uint8Array): number[] {
  const result: number[] = [];
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

function permute(k: string, arr: number[], n: number): string {
  let per = "";
  for (let i = 0; i < n; i++) {
    per += k[arr[i] - 1];
  }
  return per;
}

function xorBinary(a: string, b: string): string {
  let ans = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      ans += "0";
    } else {
      ans += "1";
    }
  }
  return ans;
}

function randomHexNibble(): string {
  return randomIntFromInterval(0, 15).toString(16);
}

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkInts(arrayish: string | any[]): arrayish is number[] {
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

/**
 * @param arg
 * @param copy
 * @returns
 */
function coerceArray(arg: Bytes, copy = false): Uint8Array {
  // ArrayBuffer view
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (arg.buffer && arg.name === "Uint8Array") {
    if (copy) {
      if (arg.slice) {
        arg = arg.slice(0);
      } else {
        arg = Array.prototype.slice.call(arg);
      }
    }

    return arg as Uint8Array;
  }

  // It's an array; check it is a valid representation of a byte
  if (Array.isArray(arg)) {
    if (!checkInts(arg)) {
      throw new Error("Array contains invalid value: " + arg);
    }

    return new Uint8Array(arg);
  }

  // Something else, but behaves like an array (maybe a Buffer? Arguments?)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (Number.isInteger(arg?.length) && checkInts(arg)) {
    return new Uint8Array(arg);
  }

  throw new Error("unsupported array-like object");
}

function createArray(length: number): Uint8Array {
  return new Uint8Array(length);
}

function copyArray(
  sourceArray: Uint8Array | number[],
  targetArray: Uint8Array,
  targetStart?: any,
  sourceStart?: number,
  sourceEnd?: number,
): void {
  if (typeof sourceStart === "number" || typeof sourceEnd === "number") {
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

export {
  xorBinary,
  xor,
  permute,
  binaryToHex,
  hexToBinary,
  hexToByte,
  byteToHex,
  convertToInt32,
  randomHexNibble,
  randomIntFromInterval,
  checkInts,
  coerceArray,
  createArray,
  copyArray,
};
