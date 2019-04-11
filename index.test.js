console.log("begin");
var { des, pinBlock } = require("./index");

var pan = "0819841515647280";
var pin = "123464420";
var keyhex = "1c1c1c1c1c1c1c1c";
const pinXorPan = pinBlock(pan, pin);
console.log("pinBlock", pinXorPan);
const cipher = des.encrypt(pinXorPan, keyhex);
console.log("encrypt", cipher);
console.log("decrypt", des.decrypt(cipher, keyhex));

console.log("end");
