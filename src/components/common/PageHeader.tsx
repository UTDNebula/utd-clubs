'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement, ReactNode, SyntheticEvent, useState } from 'react';
import BackButton from '../BackButton';

export type PageHeaderTab = {
  label: string;
  href: string;
  icon?: ReactElement;
};

export type PageHeaderBackButtonOptions = {
  /**
   * The design used for the back button.
   * - `button` displays an icon button to the left of the title
   * - `link` displays a chevron arrow and text above the title
   */
  type?: 'button' | 'link';
  /**
   * Tooltip title when type is `button`, text when type is `link`.
   */
  title?: string;
  /**
   * Link to navigate to. By default, the back button functions as a browser back button.
   */
  href?: string;
};

export type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  /**
   * Text adjacent to title. Typically used to display a metadata or a numerical statistic
   */
  metaText?: string;
  /**
   * An array of {@linkcode PageHeaderTab} objects, each corresponding to a tab.
   */
  tabs?: PageHeaderTab[];
  /**
   * If present, will enable the back button. To customize the back button,
   * provide an object with {@linkcode PageHeaderBackButtonOptions} options.
   */
  backButton?: boolean | PageHeaderBackButtonOptions;
  /**
   * Determines the placement of the tab bar:
   * - `standard` places the tab bar underneath title text
   * - `compact` places the tab bar to the right of title text
   * @default "standard"
   */
  variant?: 'standard' | 'compact';
  /**
   * The position of tab icons relative to the tab's label.
   * @default "start"
   */
  iconPosition?: TabProps['iconPosition'];
  /**
   * Default 0-indexed index of the {@linkcode PageHeaderProps.tabs | tabs} prop.
   */
  defaultSelectedTab?: number;
  /**
   * By default, the tab changes instantly and doesn't wait for page load. Use this prop to wait for page load.
   * @default false
   */
  disableOptimistic?: boolean;
  /**
   * Menu items to be displayed in a triple dot menu. Array of MUI `<MenuItem />` components.
   */
  moreItems?: ReactNode[];
  children?: ReactNode;
  slotProps?: {
    backButton?: IconButtonProps;
    backLink?: React.ComponentProps<'div'>;
    moreButton?: IconButtonProps;
    moreMenu?: MenuProps;
    tabs?: TabsProps;
  };
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  metaText,
  tabs,
  backButton: backButtonEnabled,
  variant = 'standard',
  iconPosition = 'start',
  defaultSelectedTab,
  disableOptimistic,
  moreItems,
  children,
  slotProps,
  ...props
}: PageHeaderProps) {
  const backButton: PageHeaderBackButtonOptions =
    typeof backButtonEnabled === 'object' ? backButtonEnabled : {};

  const pathname = usePathname();
  const router = useRouter();

  const rawTabIndex = tabs?.findIndex((tab) => tab.href == pathname);
  const tabIndex = rawTabIndex !== -1 ? rawTabIndex : 0;
  const [selectedTabOptimistic, setSelectedTabOptimistic] = useState(
    defaultSelectedTab ?? tabIndex,
  );

  const selectedTab = disableOptimistic ? tabIndex : selectedTabOptimistic;

  const handleChangeTab = (e: SyntheticEvent, newValue: number) => {
    if (!disableOptimistic) {
      setSelectedTabOptimistic(newValue);
    }
  };

  const backLink = (
    <div
      {...slotProps?.backLink}
      className={`flex flex-row items-center ${slotProps?.backLink?.className}`}
    >
      <ChevronLeftIcon className="group-active/back-link:-translate-x-1 transition-transform duration-100" />
      <span>{backButton.title ?? 'Back'}</span>
    </div>
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(menuAnchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const moreButton = moreItems ? (
    <Tooltip title="More">
      <span>
        <IconButton
          id="more-menu-button"
          aria-controls={openMenu ? 'more-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
          onClick={handleOpenMenu}
          {...slotProps?.moreButton}
          className={`text-neutral-600 dark:text-neutral-400 ${slotProps?.moreButton?.className}`}
        >
          <MoreVertIcon />
        </IconButton>
      </span>
    </Tooltip>
  ) : undefined;

  return (
    <div
      className="flex justify-between mt-4 border-b-1 border-[var(--mui-palette-divider)]"
      {...props}
    >
      <div
        className={`grow flex ${variant === 'compact' ? `flex-row items-end gap-8 ${backButtonEnabled && backButton.type !== 'link' ? 'ml-2 mr-4' : 'mx-4'}` : 'flex-col mx-4'}`}
      >
        <div className="group/back-link flex items-center gap-3 min-h-12 py-2">
          {backButtonEnabled && backButton.type !== 'link' && (
            <Tooltip title={backButton.title}>
              <BackButton href={backButton.href} {...slotProps?.backButton} />
            </Tooltip>
          )}
          <div
            className={`flex flex-col items-start ${variant === 'compact' ? 'gap-1' : 'gap-3'}`}
          >
            {backButtonEnabled && backButton.type === 'link' ? (
              <div className="text-neutral-600 dark:text-neutral-400 hover:underline select-none">
                {backButton.href ? (
                  <Link
                    href={backButton.href}
                    className="focus:underline focus:text-royal focus:dark:text-cornflower-300 outline-none"
                  >
                    {backLink}
                  </Link>
                ) : (
                  <span
                    onClick={() => {
                      router.back();
                    }}
                    className="cursor-pointer"
                    aria-label={backButton.title ?? 'go back'}
                  >
                    {backLink}
                  </span>
                )}
              </div>
            ) : undefined}
            <div className="flex flex-col justify-center gap-2 min-h-12">
              <div className="flex items-end gap-3">
                {title && (
                  <h1 className="font-display text-3xl font-semibold">
                    {title}
                  </h1>
                )}
                {metaText && (
                  <span className="text-xl text-neutral-600 dark:text-neutral-400">
                    {metaText}
                  </span>
                )}
              </div>
              {subtitle && (
                <h2 className="text-neutral-600 dark:text-neutral-400">
                  {subtitle}
                </h2>
              )}
            </div>
          </div>
        </div>
        {tabs && tabs.length > 0 && (
          <div className="flex items-center justify-between grow relative">
            <Tabs
              value={selectedTab}
              onChange={handleChangeTab}
              {...slotProps?.tabs}
              className={`[&_.MuiTab-root]:min-h-14 ${slotProps?.tabs?.className}`}
            >
              {tabs?.map((tab) => (
                <Tab
                  key={tab.href}
                  label={tab.label}
                  icon={tab.icon}
                  href={tab.href}
                  iconPosition={iconPosition}
                  LinkComponent={Link}
                  className="normal-case"
                />
              ))}
            </Tabs>
            <div className="sm:hidden">{moreButton}</div>
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center max-sm:hidden">
        {children}
        {moreButton}
      </div>
      <Menu
        id="more-menu"
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        {...slotProps?.moreMenu}
        slotProps={{
          list: {
            'aria-labelledby': 'more-menu-button',
            ...slotProps?.moreMenu?.slotProps?.list,
          },
        }}
      >
        {moreItems}
      </Menu>
    </div>
  );
}
