type searchParamValue = string | string[] | undefined;

/**
 * Defers to default value if input is not a valid number
 */
export const preprocessParamNum = (input: searchParamValue) => {
  const num = Number(input);
  return isNaN(num) ? undefined : num;
};

/**
 * Defers to default value (by returning undefined) if input is not provided.
 * Only returns false if input is explicitly "false". Therefore,this  will
 * return true if input is an empty string (i.e. not including a value for
 * the search param)
 */
export const preprocessParamBoolean = (input: searchParamValue) => {
  return input === undefined ? undefined : !(input === 'false');
};

/**
 * @param input Either a string of items delimited with commas, or an array of
 *              strings delimited with commas
 * @returns An array of all the items
 */
export const preprocessParamArray = (input: searchParamValue) => {
  if (typeof input === 'string') {
    return input.split(',');
  } else {
    return input?.flatMap((ele) => ele.split(','));
  }
};
