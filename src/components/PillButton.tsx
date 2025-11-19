import Link from 'next/link';
import type { IconType } from 'src/icons/Icons';

const defaultColors = {
  bg: 'bg-blue-primary',
  hover: 'hover:bg-blue-700',
  text: 'text-white',
};

// // Annoyingly, I couldn't get PillButtonColor to work so that it'd make the
// // `color` property in `PillButtonProps` to be a union of the keys in `colors`
// // instead of `string | undefined`... ugh TypeScript is a fake language
//
// type PillButtonColor = {
//   bg: string;
//   hover: string;
//   text: string;
// };
// const colors: Record<string, PillButtonColor> = {

const colors = {
  default: defaultColors,
  blue: defaultColors,
  red: {
    bg: 'bg-persimmon-500',
    hover: 'hover:bg-red-700',
    text: 'text-white',
  },
  orange: {
    bg: 'bg-events',
    hover: 'hover:bg-orange-700',
    text: 'text-white',
  },
  green: {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    text: 'text-white',
  },
};

type colorsKeys = keyof typeof colors;

type PillButtonPropsBase = {
  children?: string;
  IconComponent?: IconType;
  color?: colorsKeys;
  size?: 'default' | 'large';
};

interface PillButtonPropsAsButton extends PillButtonPropsBase {
  onClick?: React.MouseEventHandler;
  href?: never;
  disabled?: boolean;
}

interface PillButtonPropsAsLink extends PillButtonPropsBase {
  onClick?: never;
  href?: string;
  disabled?: never;
}

type PillButtonProps = PillButtonPropsAsButton | PillButtonPropsAsLink;

/**
 * **Component for a default pill button. Children will be displayed as the button's text.**
 * - If provided with `onClick`, will return a button.
 * - If provided with `href`, will return a link.
 *
 * @param {React.MouseEventHandler} onClick - Event handler that is run when button is clicked
 * @param {IconType} IconComponent - An icon component from Icons.tsx
 * @param {colorsKeys} color - A valid item from the list of pre-defined colors for the pill button
 * @param {PillButtonProps["size"]} size - "default" | "large"
 *
 * @example <caption>Example of button text</caption>
 * <PillButton>Text</PillButton>
 *
 * @example <caption>Example of an icon-only button</caption>
 * <PillButton IconComponent={PlusIcon}></PillButton>
 *
 * @example <caption>Example of a link button</caption>
 * <PillButton href="https://example.com">Link</PillButton>
 */
const PillButton = ({
  children,
  onClick,
  href,
  IconComponent,
  color,
  size,
  disabled,
}: PillButtonProps) => {
  const childrenClasses = ` 
        rounded-full cursor-pointer transition-colors text-s font-bold 
        ${colors[color ?? 'default']?.bg ?? 'bg-blue-primary'}
        ${colors[color ?? 'default']?.hover ?? 'hover:bg-blue-700'}
        ${colors[color ?? 'default']?.text ?? 'text-white'}
        disabled:bg-slate-700 disabled:text-white disabled:cursor-not-allowed
        min-w-max`;

  const contents = (
    <div
      className={`flex flex-row items-center justify-center ${
        size == 'large'
          ? 'h-12.5 min-w-12.5 px-3.75 py-2.5'
          : 'h-10.5 min-w-10.5 px-2.75 py-1.5'
      }`}
    >
      {children ? <span className="px-2 leading-8">{children}</span> : ''}
      {IconComponent ? (
        <div className="flex h-5 w-5 items-center justify-center">
          {IconComponent && <IconComponent fill={'white'} size={16} />}
        </div>
      ) : (
        ''
      )}
    </div>
  );

  return href ? (
    <Link className={childrenClasses} href={href}>
      {contents}
    </Link>
  ) : (
    <button className={childrenClasses} onClick={onClick} disabled={disabled}>
      {contents}
    </button>
  );
};

export default PillButton;
