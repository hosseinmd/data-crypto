var { Des, TripleDes, pinBlockFormat0 } = require("../index");

test("des crypto", () => {
  var pan = "0819841515647280";
  var pin = "1234656";
  var keyhex = "1c1c1c1c1c1c1c1c";

  const pinXorPan = pinBlockFormat0(pan, pin);

  const cipher = Des.encrypt(pinXorPan, keyhex);

  const decrypted = Des.decrypt(cipher, keyhex);
  expect(decrypted).toBe(pinXorPan);
});

test("triple des crypto", () => {
  var pan = "0819841515647280";
  var keyhex = "1c1c1c1c1c1c1c11c143545454543434c11c143545454543434";

  const cipher = TripleDes.encrypt(pan, keyhex);
  
  const decrypted = TripleDes.decrypt(cipher, keyhex);
  expect(decrypted).toBe(pan);
});
