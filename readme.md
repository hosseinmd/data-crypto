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

```javascript
import { des,pinBlock } from "data-crypto";
//or
const { des, pinBlock } = require("data-crypto");

const keyhex = "abd219bc6c15181a";
const text= "plain text"

const cipher = des.encrypt(text, keyhex);

const decrypted = des.decrypt(cipher, keyhex);

const pan = "6819841515647280";
const pin = "123464420";
const pinXorPan = pinBlock(pan, pin);
```

