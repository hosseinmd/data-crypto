var { pinBlockFormat1,pinBlockFormat2 } = require("../index");

var pin = "1234";
test("pinblock", () => {
  const pinXorPan = pinBlockFormat1(pin);
  console.log("pinBlockFormat1", pin, ":", pinXorPan);

  expect("241234FFFFFFFFFF").toBe(pinBlockFormat2(pin));
});
