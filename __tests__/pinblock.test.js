var { pinBlockFormat1 } = require("../index");

var pin = "1234";
test("pinblock", () => {
  const pinXorPan = pinBlockFormat1(pin);
  console.log("pinBlockFormat1", pin, ":", pinXorPan);
});
