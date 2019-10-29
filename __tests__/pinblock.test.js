const {
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
} = require("../index");

const pan = "4321987654321098";
const pin = "1234";
test("pinblock", () => {
  const pinblock0 = pinBlockFormat0(pan, pin);
  console.log("pinBlockFormat0", pinblock0);

  const pinXorPan = pinBlockFormat1(pin);
  console.log("pinBlockFormat1", pin, ":", pinXorPan);

  expect("241234FFFFFFFFFF").toBe(pinBlockFormat2(pin));

  const pinblock3 = pinBlockFormat3(pan, pin);
  console.log("pinBlockFormat3", pinblock3);
});
