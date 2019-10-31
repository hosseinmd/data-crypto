[![NPM](https://nodei.co/npm/data-crypto.png)](https://nodei.co/npm/data-crypto/)

[![install size](https://packagephobia.now.sh/badge?p=data-crypto)](https://packagephobia.now.sh/result?p=data-crypto) [![dependencies](https://david-dm.org/hosseinmd/data-crypto.svg)](https://david-dm.org/hosseinmd/data-crypto.svg)

# data-crypto

encryption algorithms

## install

```npm
npm i data-crypto --save
or
yarn add data-crypto
```

## use

### import

```javascript
import { Des, pinBlockFormat0, pinBlockFormat1 } from "data-crypto";
//or
const { Des, pinBlockFormat0, pinBlockFormat1 } = require("data-crypto");
```

### DES crypto

```js
const keyhex = "abd219bc6c15181a";
const text = "plain text";

const cipher = Des.encrypt(text, keyhex);

const decrypted = Des.decrypt(cipher, keyhex);
```

### pin Block

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
