import { ColorString } from '../types';

/**
 * Adds opacity to a CSS color string
 * @param color CSS color string
 * @param opacity Opacity from 0 to 1
 * @returns Formatted CSS color string
 */
export const rgba = (color: ColorString, opacity: number): ColorString =>
  `rgb(from ${color} r g b / ${opacity})`;

/**
 * Takes a string or string union and removes all numerical digits
 */
export type RemoveDigits<S extends string> =
  S extends `${infer Head}${infer Tail}`
    ? Head extends '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
      ? RemoveDigits<Tail>
      : `${Head}${RemoveDigits<Tail>}`
    : S;
