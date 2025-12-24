type getFormattedListStringOptions = {
  /**
   * Max number of items to explicitly name
   * @default 1
   */
  maxSpecified: number;
  /**
   * Terminology used for items not explicitely named
   * @default {singular: "item", plural: "items"}
   */
  termString: {
    singular: string;
    plural: string;
  };
  /**
   * Whether to include an Oxford comma for last item of list
   * @default true
   * */
  oxfordComma: boolean;
  /**
   * Conjunction used for last item of list
   * @default "and"
   */
  conjunction: string;
};

const getFormattedListStringOptionsDefaults: getFormattedListStringOptions = {
  maxSpecified: 1,
  termString: { singular: 'item', plural: 'items' },
  oxfordComma: true,
  conjunction: 'and',
};

/**
 * Formats a list of items into a single string separated by commas.
 * Will only explicitly name a maximum number of items (customizable via {@linkcode getFormattedListStringOptions.maxSpecified | options.maxSpecified}).
 * The remaining items will be counted as N and expressed as `N other items`.
 * @param {string | string[]} list - Array of string items to be formatted (required)
 * @param {getFormattedListStringOptionsDefaults} [options] - Object of options (optional). Valid options listed in {@linkcode getFormattedListStringOptions}
 * @returns {string} Formatted string
 *
 * @example <caption>Basic usage</caption>
 * // returns "Apple, Banana, and 1 other fruit"
 * const list = ["Apple", "Banana", "Canteloupe"];
 * const options = {maxSpecified: 2, termString: {singular: "fruit", plural: "fruits"}};
 * getFormattedListString(list, options);
 *
 * @example <caption>Single item and 0 maxSpecified</caption>
 * // returns "1 item"
 * getFormattedListString("Durian", {maxSpecified: 0});
 *
 * @example <caption>Uncapped maxSpecified and alternate conjunction</caption>
 * // returns "Apple, Banana, or Canteloupe"
 * const list = ["Apple", "Banana", "Canteloupe"];
 * getFormattedListString(list, {maxSpecified: -1, conjunction: "or"});
 */
export default function getFormattedListString(
  list: string | string[],
  options?: Partial<getFormattedListStringOptions>,
): string {
  const normalizedList = Array.isArray(list) ? list : [list];
  const defaultedOptions = {
    ...getFormattedListStringOptionsDefaults,
    ...options,
  };

  const outputListItems: string[] = [];

  if (normalizedList.length === 0)
    return `0 ${defaultedOptions.termString.plural}`;

  // Explicitly name items up to `maxSpecified`
  for (
    let i = 0;
    (defaultedOptions.maxSpecified >= 0
      ? i < defaultedOptions.maxSpecified
      : true) && i < normalizedList.length;
    i++
  ) {
    outputListItems.push(normalizedList[i] ?? '');
  }

  // Only include "N other items" if `maxSpecified` is positive
  if (defaultedOptions.maxSpecified >= 0) {
    // Count items not explicitly named, then add count to end of list
    const otherCount = normalizedList.length - defaultedOptions.maxSpecified;
    if (otherCount > 0) {
      outputListItems.push(
        `${otherCount} ${defaultedOptions.maxSpecified !== 0 ? 'other ' : ''}${
          otherCount === 1
            ? defaultedOptions.termString.singular
            : defaultedOptions.termString.plural
        }`,
      );
    }
  }

  // Remove last item in order to conditionally add conjunction and Oxford comma.
  const lastOutputItem: string =
    outputListItems.length > 1 ? (outputListItems.pop() ?? '') : '';

  let output = outputListItems.join(', ');
  output += lastOutputItem
    ? `${outputListItems.length >= 2 && defaultedOptions.oxfordComma ? ',' : ''} ${defaultedOptions.conjunction} ${lastOutputItem}`
    : '';

  return output;
}
