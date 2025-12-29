import GavelIcon from '@mui/icons-material/Gavel';
import HandymanIcon from '@mui/icons-material/Handyman';
import PersonIcon from '@mui/icons-material/Person';
import { SvgIconOwnProps } from '@mui/material';
import Chip, { ChipProps } from '@mui/material/Chip';
import { cloneElement, isValidElement, ReactElement } from 'react';
import { clubRoleEnum } from '@src/server/db/schema/users';

export type MemberTypes = (typeof clubRoleEnum.enumValues)[number];

export type ChipStyles = Record<
  MemberTypes,
  {
    label: string;
    colorClass: string | undefined;
    icon: ReactElement;
  }
>;

export const chipStyles: ChipStyles = {
  Member: {
    label: 'Member',
    colorClass: undefined,
    icon: <PersonIcon fontSize="small" />,
  },
  Officer: {
    label: 'Collaborator',
    colorClass: 'bg-royal/30',
    icon: <HandymanIcon fontSize="small" />,
  },
  President: {
    label: 'Admin',
    colorClass: 'bg-rose-200',
    icon: <GavelIcon fontSize="small" />,
  },
};

type MemberRoleChipPropsBase = {
  memberType: MemberTypes;
};

type MemberRoleChipProps = MemberRoleChipPropsBase &
  Omit<ChipProps, keyof MemberRoleChipPropsBase>;

export default function MemberRoleChip({
  memberType,
  className,
  ...props
}: MemberRoleChipProps) {
  if (!memberType) return;

  const icon = chipStyles[memberType].icon;

  return (
    <Chip
      icon={
        <div className="ml-2 flex justify-center items-center text-gray-600 h-4 *:w-4 *:h-4">
          {isValidElement<SvgIconOwnProps>(icon)
            ? cloneElement(icon, { fontSize: 'small' })
            : icon}
        </div>
      }
      label={chipStyles[memberType].label}
      className={`${chipStyles[memberType].colorClass} ${className}`}
      {...props}
    />
  );
}
