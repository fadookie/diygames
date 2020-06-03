 export function assertNever(x: never): asserts x is never {
  throw new Error("Unexpected object: " + x);
}