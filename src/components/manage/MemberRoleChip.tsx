import GavelIcon from '@mui/icons-material/Gavel';
import GroupIcon from '@mui/icons-material/Group';
import HandymanIcon from '@mui/icons-material/Handyman';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
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
  Follower: {
    label: 'Follower',
    colorClass: undefined,
    icon: <PersonIcon fontSize="small" />,
  },
  Member: {
    label: 'Member',
    colorClass: 'bg-emerald-200 dark:bg-emerald-600/30',
    icon: <GroupIcon fontSize="small" />,
  },
  Requested: {
    label: 'Requested',
    colorClass: 'bg-amber-200 dark:bg-amber-600/30',
    icon: <HourglassEmptyIcon fontSize="small" />,
  },
  Officer: {
    label: 'Collaborator',
    colorClass: 'bg-royal/30 dark:bg-cornflower-300/30',
    icon: <HandymanIcon fontSize="small" />,
  },
  President: {
    label: 'Admin',
    colorClass: 'bg-rose-200 dark:bg-rose-600/40',
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
        <div className="ml-2 flex justify-center items-center text-slate-600 dark:text-slate-300 h-4 *:w-4 *:h-4">
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
