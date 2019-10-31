const Des = require("./src/des");
const TripleDes = require("./src/tripleDes");
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
  TripleDes,
  pinBlock,
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
};
