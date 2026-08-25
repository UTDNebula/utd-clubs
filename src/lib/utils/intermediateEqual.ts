/**
 * Compares two items and returns whether their actual values are equivalent.
 * Has better support than the equality operator.
 * - Supports: primitives, null, non-object types, Dates, arrays, nested arrays
 * - Does NOT support: objects, nested objects, functions
 */
export default function intermediateEqual<T>(val1: T, val2: T): boolean {
  if (val1 === val2) return true;

  // Null or non-object types
  if (
    val1 === null ||
    typeof val1 !== 'object' ||
    val2 === null ||
    typeof val2 !== 'object'
  ) {
    return false;
  }

  // Dates
  if (val1 instanceof Date && val2 instanceof Date) {
    return val1.getTime() === val2.getTime();
  }

  // Arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    for (let i = 0; i < val1.length; i++) {
      if (!intermediateEqual(val1, val2)) return false;
    }
    return true;
  }

  return false;
}
