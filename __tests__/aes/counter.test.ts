import { Aes } from "../../src";

function bufferEquals(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function makeTest(options: any) {
  return function () {
    const result = Buffer.from(options.incrementResult, "hex");

    if ("nullish" in options) {
      const counter = new Aes.Counter(options.nullish);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to initialize with a nullish thing",
      ).toBe(true);
    }

    if ("number" in options) {
      let counter = new Aes.Counter(options.number);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to initialize with a number",
      ).toBe(true);

      counter.setValue(options.number);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to reset to a number",
      ).toBe(true);

      counter = new Aes.Counter();
      counter.setValue(options.number);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to reset to a number",
      ).toBe(true);
    }

    if (options.bytes) {
      const bytes = Buffer.from(options.bytes, "hex");

      let counter = new Aes.Counter(bytes);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to initialize with bytes",
      ).toBe(true);

      counter.setBytes(bytes);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to reset with bytes",
      ).toBe(true);

      counter = new Aes.Counter();
      counter.setBytes(bytes);
      counter.increment();
      expect(
        bufferEquals(counter._counter, result),
        // "counter failed to reset with bytes",
      ).toBe(true);
    }
  };
}

test(
  "test-counter-nullish-null",
  makeTest({
    nullish: null,
    incrementResult: "00000000000000000000000000000002",
  }),
);
test(
  "test-counter-nullish-undefined",
  makeTest({
    nullish: undefined,
    incrementResult: "00000000000000000000000000000002",
  }),
);
test(
  "test-counter-number-0",
  makeTest({ number: 0, incrementResult: "00000000000000000000000000000001" }),
);
test(
  "test-counter-number-1",
  makeTest({ number: 1, incrementResult: "00000000000000000000000000000002" }),
);
test(
  "test-counter-number-254",
  makeTest({
    number: 254,
    incrementResult: "000000000000000000000000000000ff",
  }),
);
test(
  "test-counter-number-255",
  makeTest({
    number: 255,
    incrementResult: "00000000000000000000000000000100",
  }),
);
test(
  "test-counter-number-256",
  makeTest({
    number: 256,
    incrementResult: "00000000000000000000000000000101",
  }),
);
test(
  "test-counter-number-large",
  makeTest({
    number: 1099511627774,
    incrementResult: "0000000000000000000000ffffffffff",
  }),
);
test(
  "test-counter-number-max",
  makeTest({
    number: 9007199254740991,
    incrementResult: "00000000000000000020000000000000",
  }),
);
test(
  "test-counter-bytes-0000",
  makeTest({
    bytes: "00000000000000000000000000000000",
    incrementResult: "00000000000000000000000000000001",
  }),
);
test(
  "test-counter-bytes-00ff",
  makeTest({
    bytes: "000000000000000000000000000000ff",
    incrementResult: "00000000000000000000000000000100",
  }),
);
test(
  "test-counter-bytes-ffff",
  makeTest({
    bytes: "ffffffffffffffffffffffffffffffff",
    incrementResult: "00000000000000000000000000000000",
  }),
);
test(
  "test-counter-bytes-dead",
  makeTest({
    bytes: "deadbeefdeadbeefdeadbeefdeadbeef",
    incrementResult: "deadbeefdeadbeefdeadbeefdeadbef0",
  }),
);
