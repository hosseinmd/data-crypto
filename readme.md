[![NPM](https://nodei.co/npm/data-crypto.png)](https://nodei.co/npm/data-crypto/)

[![install size](https://packagephobia.now.sh/badge?p=data-crypto)](https://packagephobia.now.sh/result?p=data-crypto) [![dependencies](https://david-dm.org/hosseinmd/data-crypto.svg)](https://david-dm.org/hosseinmd/data-crypto.svg)

# data-crypto

Standard Encryption Algorithms made by Pure Javascript without any dependencies
Compatible with all environments (react-native, reactjs, nodejs, angular, ... )

## TOC

- [install](#install)
- [import](#import)
- [DES](#DES)
- [Triple DES](#TripleDES)
- [Pin Block](#PinBlock)
- [AES](#AES)

## install

```npm
npm i data-crypto --save
or
yarn add data-crypto
```

## import

```javascript
import { Des, Aes, TripleDes, pinBlock, pinBlockFormat0 } from "data-crypto";
//or
const {
  Des,
  Aes,
  TripleDes,
  pinBlock,
  pinBlockFormat0,
} = require("data-crypto");
```

## DES

The Data Encryption Standard (DES) is a symmetric-key algorithm for the encryption data. Key length is 8 bytes (56 bits).
Mode is ECB

```js
const keyhex = "abd219bc6c15181a";
const text = "plain text";

const cipher = Des.encrypt(text, keyhex);

const decrypted = Des.decrypt(cipher, keyhex);
```

## TripleDES

The Data Encryption Standard’s(DES) is no longer considered adequate in the face of modern cryptanalytic techniques and supercomputing power. However, an adapted version of DES, Triple DES (3DES), produces a more secure encryption.

```js
const keyhex = "abd21abd219bc6c15181a9bc6cabd219bc6c15181a15181a";
const text = "plain text";

const cipher = TripleDes.encrypt(text, keyhex);

const decrypted = TripleDes.decrypt(cipher, keyhex);
```

## PinBlock

ISO 9564-1 Format 0. An `ISO-0` PIN block format is equivalent to the `ANSI X9.8`,`VISA-1`,
and `ECI-1` PIN block formats and is similar to a VISA-4 PIN block format.

```js
const pan = "6819841515647280";
const pin = "123464420";

pinBlockFormat0(pan, pin);
```

ISO 9564-1:2003 Format 1. The `ISO-1` PIN block format is equivalent to an `ECI-4` PIN block format and is recommended for usage where no PAN data is available.

```js
pinBlockFormat1(pin);
```

ISO 9564-3: 2003 Format 2. `ISO-2` is for local use with off-line systems only.

```js
pinBlockFormat2(pin);
```

ISO 9564-1: 2002 Format 3. . `ISO-3`

```js
pinBlockFormat3(pan, pin);
```

## AES

The Advanced Encryption Standard (AES), also known by its original name Rijndael, is a specification for the encryption of electronic data established by the U.S. National Institute of Standards and Technology (NIST) in 2001. AES is a subset of the Rijndael block cipher

Data-crypto Supports all key sizes (128-bit, 192-bit and 256-bit) and all common modes of operation (CBC, CFB, CTR, ECB and OFB)

- [UTF8](#UTF8)
- [Keys](#Keys)
- [CTR](#CTR)
- [CBC](#CBC)
- [CFB](#CFB)
- [OFB](#OFB)
- [ECB](#ECB)
- [Block Cipher](#BlockCipher)

### UTF8

Conver string to Array Buffer

```javascript
const plaintext = "a plain text for show you what is Utf8";
const textBuffer = Buffer.from(plaintext, "ascii");

textBuffer.toString("ascii") == plaintext;
```

**Bytes and Hex strings**

Binary data, such as encrypted bytes, can safely be stored and printed as hexidecimal strings.

```javascript
const hexString = "DEADBEEFDEADBEEFDEADBEEFDEADBEEF";
const textBuffer = Buffer.from(hexString, "hex");

textBuffer.toString("hex") == hexString;
```

### Keys

All keys must be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long.

The library work with `Array`, `Uint8Array` and `Buffer` objects as well as any _array-like_ object (i.e. must have a `length` property, and have a valid byte value for each entry).

```javascript
// 128-bit, 192-bit and 256-bit keys
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var key_192 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
var key_256 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// or, you may use Uint8Array:
var key_128_array = new Uint8Array(key_128);
var key_192_array = new Uint8Array(key_192);
var key_256_array = new Uint8Array(key_256);

// or, you may use Buffer in node.js:
var key_128_buffer = Buffer.from(key_128);
var key_192_buffer = Buffer.from(key_192);
var key_256_buffer = Buffer.from(key_256);
```

#### What is a Key

This seems to be a point of confusion for many people new to using encryption. You can think of the key as the _"password"_. However, these algorithms require the _"password"_ to be a specific length.

With AES, there are three possible key lengths, 128-bit (16 bytes), 192-bit (24 bytes) or 256-bit (32 bytes). When you create an AES object, the key size is automatically detected, so it is important to pass in a key of the correct length.

Often, you wish to provide a password of arbitrary length, for example, something easy to remember or write down. In these cases, you must come up with a way to transform the password into a key of a specific length. A **Password-Based Key Derivation Function** (PBKDF) is an algorithm designed for this exact purpose.

Here is an example, using the popular (possibly obsolete?) pbkdf2:

```javascript
var pbkdf2 = require("pbkdf2");

var key_128 = pbkdf2.pbkdf2Sync("password", "salt", 1, 128 / 8, "sha512");
var key_192 = pbkdf2.pbkdf2Sync("password", "salt", 1, 192 / 8, "sha512");
var key_256 = pbkdf2.pbkdf2Sync("password", "salt", 1, 256 / 8, "sha512");
```

Another possibility, is to use a hashing function, such as SHA256 to hash the password, but this method is vulnerable to [Rainbow Attacks](http://en.wikipedia.org/wiki/Rainbow_table), unless you use a [salt](<http://en.wikipedia.org/wiki/Salt_(cryptography)>).

### Common Modes of Operation

The modes of operation of block ciphers are configuration methods that allow those ciphers to work with large data streams, without the risk of compromising the provided security.

### CTR

CTR - Counter (recommended)

```javascript
// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";
var textBytes = Buffer.from(text, "ascii");
// The counter is optional, and if omitted will begin at 1
var aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = Buffer.from(decryptedBytes);

decryptedText.toString("ascii") == text;
// return  "Text may be any length you wish, no padding is required."

// "Text may be any length you wish, no padding is required."
```

### CBC

CBC - Cipher-Block Chaining (recommended)

```javascript
// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes (text must be a multiple of 16 bytes)
var text = "TextMustBe16Byte";
var textBytes = Buffer.from(text, "ascii");

var aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
var encryptedBytes = aesCbc.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "104fb073f9a131f2cab49184bb864ca2"

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBe16Byte"
```

### CFB

CFB - Cipher Feedback

```javascript
// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes (must be a multiple of the segment size you choose below)
var text = "TextMustBeAMultipleOfSegmentSize";
var textBytes = Buffer.from(text, "ascii");

// The segment size is optional, and defaults to 1
var segmentSize = 8;
var aesCfb = new Aes.ModeOfOperation.cfb(key, iv, segmentSize);
var encryptedBytes = aesCfb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "55e3af2638c560b4fdb9d26a630733ea60197ec23deb85b1f60f71f10409ce27"

// The cipher feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
aesCfb = new Aes.ModeOfOperation.cfb(key, iv, 8);
var decryptedBytes = aesCfb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBeAMultipleOfSegmentSize"
```

### OFB

OFB - Output Feedback

```javascript
// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";
var textBytes = Buffer.from(text, "ascii");

var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
var encryptedBytes = aesOfb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "55e3af2655dd72b9f32456042f39bae9accff6259159e608be55a1aa313c598d
//  b4b18406d89c83841c9d1af13b56de8eda8fcfe9ec8e75e8"

// The output feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
var decryptedBytes = aesOfb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "Text may be any length you wish, no padding is required."
```

### ECB

ECB - Electronic Codebook (NOT recommended)

This mode is **not** recommended. Since, for a given key, the same plaintext block in produces the same ciphertext block out, this mode of operation can leak data, such as patterns. For more details and examples, see the Wikipedia article, [Electronic Codebook](http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_Codebook_.28ECB.29).

```javascript
// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Convert text to bytes
var text = "TextMustBe16Byte";
var textBytes = Buffer.from(text, "ascii");

var aesEcb = new Aes.ModeOfOperation.ecb(key);
var encryptedBytes = aesEcb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
var encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "a7d93b35368519fac347498dec18b458"

// Since electronic codebook does not store state, we can
// reuse the same instance.
//var aesEcb = new aesjs.ModeOfOperation.ecb(key);
var decryptedBytes = aesEcb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBe16Byte"
```

### BlockCipher

Block Cipher
You should usually use one of the above common modes of operation. Using the block cipher algorithm directly is also possible using **ECB** as that mode of operation is merely a thin wrapper.

But this might be useful to experiment with custom modes of operation or play with block cipher algorithms.

```javascript
// the AES block cipher algorithm works on 16 byte bloca ks, no more, no less
var text = "ABlockIs16Bytes!";
var textAsBytes = Buffer.from(text, "ascii");
console.log(textAsBytes.toString("hex"));
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

// create an instance of the block cipher algorithm
var key = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
var aes = new Aes.AES(key);

// encrypt...
var encryptedBytes = aes.encrypt(textAsBytes);
console.log(encryptedBytes);
// [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109]

// To print or store the binary data, you may convert it to hex
var encryptedHex = Buffer.from(encryptedBytes);
console.log(encryptedHex.toString("hex"));
// "880fc7ae7685e9b18f2f2ad360376b6d"

// decrypt...
var decryptedBytes = aes.decrypt(encryptedHex);
console.log(decryptedBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

// decode the bytes back into our original text
var decryptedText = Buffer.from(decryptedBytes);
console.log(decryptedText.toString("ascii"));
// "ABlockIs16Bytes!"
```
