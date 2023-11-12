/**
 * Simple helper to throw an error if a value is undefined.
 */
export function requireValue<T>(value: T | undefined, errMsg: string): T {
  if (value === undefined) {
    throw new Error(errMsg);
  }
  return value;
}
