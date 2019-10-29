var { des, pinBlockFormat0 } = require("../index");

test("pinblock crypto", () => {
  var pan = "0819841515647280";
  var pin = "1234656";
  var keyhex = "1c1c1c1c1c1c1c1c";

  const pinXorPan = pinBlockFormat0(pan, pin);

  const cipher = des.encrypt(pinXorPan, keyhex);
  
  const decrypted = des.decrypt(cipher, keyhex);
  expect(decrypted).toBe(pinXorPan);
});
