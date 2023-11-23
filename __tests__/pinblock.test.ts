import {
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
} from "../src";

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

test("Format0 is spec compliant", () => {
  /*
  ISO 9564-1 Format 0
     Values sourced from:
     https://eftlab.com/knowledge-base/complete-list-of-pin-blocks
   */
  const pan = "43219876543210987";
  const pin = "1234";

  expect(pinBlockFormat0(pan, pin)).toEqual("0412AC89ABCDEF67");
})
