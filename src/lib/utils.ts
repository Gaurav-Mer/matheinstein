/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Generic function to normalize an array by any key
/**
 * Normalizes an array of objects into a key-value object.
 *
 * @template T - The type of the objects in the array.
 * @template K - The type of the key, which must be a property of T.
 * @param {T[]} array - The array to normalize.
 * @param {K} key - The key to use for normalization.
 * @returns {Record<string, T>} The normalized object.
 */
export function normalizeArray<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T> {
  // Ensure the key's value is a string or number.
  type KeyType = T[K] extends string | number ? T[K] : never;

  // Reduce the array to an object.
  return array.reduce((acc, item) => {
    const keyValue = item[key] as KeyType;
    if (typeof keyValue === "string" || typeof keyValue === "number") {
      acc[String(keyValue)] = item;
    }
    return acc;
  }, {} as Record<string, T>);
}