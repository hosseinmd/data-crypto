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
import { des, pinBlockFormat0, pinBlockFormat1 } from "data-crypto";
//or
const { des, pinBlockFormat0, pinBlockFormat1 } = require("data-crypto");
```

### des crypto

```js
const keyhex = "abd219bc6c15181a";
const text = "plain text";

const cipher = des.encrypt(text, keyhex);

const decrypted = des.decrypt(cipher, keyhex);
```

### pin Block

```js
const pan = "6819841515647280";
const pin = "123464420";
// ISO-0
pinBlockFormat0(pan, pin);

// ISO-1
pinBlockFormat1(pin);

// ISO-2
pinBlockFormat2(pin);
```
