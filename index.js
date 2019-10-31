const Des = require("./src/des");
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
  pinBlock,
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
};
