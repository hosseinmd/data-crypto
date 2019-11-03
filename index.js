const Des = require("./src/des");
const TripleDes = require("./src/tripleDes");
const Aes = require("./src/aes");
const {
  pinBlock,
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
} = require("./src/pinBlock");

module.exports = {
  /** @deprecated use Des  */
  des: Des,
  Des,
  Aes,
  TripleDes,
  pinBlock,
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
};
