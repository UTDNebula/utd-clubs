type getFormattedListStringOptions = {
  maxSpecified: number;
  termString: {
    singular: string;
    plural: string;
  };
  oxfordComma: boolean;
};

const getFormattedListStringOptionsDefaults: getFormattedListStringOptions = {
  maxSpecified: 1,
  termString: { singular: 'item', plural: 'items' },
  oxfordComma: true,
};

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

  for (
    let i = 0;
    (defaultedOptions.maxSpecified >= 0
      ? i < defaultedOptions.maxSpecified
      : true) && i < normalizedList.length;
    i++
  ) {
    outputListItems.push(normalizedList[i] ?? '');
  }

  if (defaultedOptions.maxSpecified >= 0) {
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

  const lastOutputItem: string =
    outputListItems.length > 1 ? (outputListItems.pop() ?? '') : '';

  let output = outputListItems.join(', ');
  output += lastOutputItem
    ? `${outputListItems.length >= 2 && defaultedOptions.oxfordComma ? ',' : ''} and ${lastOutputItem}`
    : '';

  return output;
}
