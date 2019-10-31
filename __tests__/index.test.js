var { Des, pinBlockFormat0 } = require("../index");

test("pinblock crypto", () => {
  var pan = "0819841515647280";
  var pin = "1234656";
  var keyhex = "1c1c1c1c1c1c1c1c";

  const pinXorPan = pinBlockFormat0(pan, pin);

  const cipher = Des.encrypt(pinXorPan, keyhex);
  
  const decrypted = Des.decrypt(cipher, keyhex);
  expect(decrypted).toBe(pinXorPan);
});
