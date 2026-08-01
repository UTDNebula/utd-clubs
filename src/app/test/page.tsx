/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */

import { createTheme } from '@mui/material/styles';

export default function test() {
  // const defaultTheme = createTheme({
  //   palette: { mode: 'light' },
  // });
  // console.log(defaultTheme);

  return (
    <div className="flex flex-col gap-4 py-8">
      <h1 className="px-8 py-2 text-2xl">Dynamic</h1>
      <Row header="Primary" noGap>
        <ColorCard className="bg-primary" />
        <ColorCard className="bg-on-primary" />
        <ColorCard className="bg-primary-container" />
        <ColorCard className="bg-on-primary-container" />
      </Row>
      <Row header="Secondary" noGap>
        <ColorCard className="bg-secondary" />
        <ColorCard className="bg-on-secondary" />
        <ColorCard className="bg-secondary-container" />
        <ColorCard className="bg-on-secondary-container" />
      </Row>
      <Row header="Tertiary" noGap>
        <ColorCard className="bg-tertiary" />
        <ColorCard className="bg-on-tertiary" />
        <ColorCard className="bg-tertiary-container" />
        <ColorCard className="bg-on-tertiary-container" />
      </Row>
      <Row header="Error" noGap>
        <ColorCard className="bg-error" />
        <ColorCard className="bg-on-error" />
        <ColorCard className="bg-error-container" />
        <ColorCard className="bg-on-error-container" />
      </Row>
      <Row header="Surface" noGap>
        <ColorCard className="bg-surface" />
        <ColorCard className="bg-on-surface" />
        <ColorCard className="bg-surface-variant" />
        <ColorCard className="bg-on-surface-variant" />
        <ColorCard className="bg-surface-tint" children="DEPRECATED" />
      </Row>
      <Row header="Surface Container" noGap>
        <ColorCard className="bg-surface-container-highest" />
        <ColorCard className="bg-surface-container-high" />
        <ColorCard className="bg-surface-container" />
        <ColorCard className="bg-surface-container-low" />
        <ColorCard className="bg-surface-container-lowest" />
      </Row>
      <Row header="Surface Inverse" noGap>
        <ColorCard className="bg-inverse-surface" />
        <ColorCard className="bg-inverse-on-surface" />
        <ColorCard className="bg-inverse-primary" />
      </Row>
      <Row header="Outline, Scrim, & Shadow" noGap>
        <ColorCard className="bg-outline" />
        <ColorCard className="bg-outline-variant" />
        <ColorCard className="bg-scrim" />
        <ColorCard className="bg-shadow" />
      </Row>
      <Row header="Addon" noGap>
        <ColorCard className="bg-background" children="DEPRECATED" />
        <ColorCard className="bg-on-background" children="DEPRECATED" />
        <ColorCard className="bg-surface-bright" />
        <ColorCard className="bg-surface-dim" />
      </Row>
      <h1 className="px-8 py-2 text-2xl">Fixed</h1>
      <Row header="Primary" noGap>
        <ColorCard className="bg-fixed-primary" />
        <ColorCard className="bg-fixed-on-primary" />
        <ColorCard className="bg-fixed-primary-dim" />
        <ColorCard className="bg-fixed-on-primary-variant" />
      </Row>
      <Row header="Secondary" noGap>
        <ColorCard className="bg-fixed-secondary" />
        <ColorCard className="bg-fixed-on-secondary" />
        <ColorCard className="bg-fixed-secondary-dim" />
        <ColorCard className="bg-fixed-on-secondary-variant" />
      </Row>
      <Row header="Tertiary" noGap>
        <ColorCard className="bg-fixed-tertiary" />
        <ColorCard className="bg-fixed-on-tertiary" />
        <ColorCard className="bg-fixed-tertiary-dim" />
        <ColorCard className="bg-fixed-on-tertiary-variant" />
      </Row>
      <h1 className="px-8 py-2 text-2xl">Ref</h1>
      <Row header="Primary" noGap>
        <ColorCard className="bg-ref-primary100" />
        <ColorCard className="bg-ref-primary99" />
        <ColorCard className="bg-ref-primary98" />
        <ColorCard className="bg-ref-primary95" />
        <ColorCard className="bg-ref-primary90" />
        <ColorCard className="bg-ref-primary80" />
        <ColorCard className="bg-ref-primary70" />
        <ColorCard className="bg-ref-primary60" />
        <ColorCard className="bg-ref-primary50" />
        <ColorCard className="bg-ref-primary40" />
        <ColorCard className="bg-ref-primary30" />
        <ColorCard className="bg-ref-primary20" />
        <ColorCard className="bg-ref-primary10" />
        <ColorCard className="bg-ref-primary0" />
      </Row>
      <Row header="Secondary" noGap>
        <ColorCard className="bg-ref-secondary100" />
        <ColorCard className="bg-ref-secondary99" />
        <ColorCard className="bg-ref-secondary98" />
        <ColorCard className="bg-ref-secondary95" />
        <ColorCard className="bg-ref-secondary90" />
        <ColorCard className="bg-ref-secondary80" />
        <ColorCard className="bg-ref-secondary70" />
        <ColorCard className="bg-ref-secondary60" />
        <ColorCard className="bg-ref-secondary50" />
        <ColorCard className="bg-ref-secondary40" />
        <ColorCard className="bg-ref-secondary30" />
        <ColorCard className="bg-ref-secondary20" />
        <ColorCard className="bg-ref-secondary10" />
        <ColorCard className="bg-ref-secondary0" />
      </Row>
      <Row header="Tertiary" noGap>
        <ColorCard className="bg-ref-tertiary100" />
        <ColorCard className="bg-ref-tertiary99" />
        <ColorCard className="bg-ref-tertiary98" />
        <ColorCard className="bg-ref-tertiary95" />
        <ColorCard className="bg-ref-tertiary90" />
        <ColorCard className="bg-ref-tertiary80" />
        <ColorCard className="bg-ref-tertiary70" />
        <ColorCard className="bg-ref-tertiary60" />
        <ColorCard className="bg-ref-tertiary50" />
        <ColorCard className="bg-ref-tertiary40" />
        <ColorCard className="bg-ref-tertiary30" />
        <ColorCard className="bg-ref-tertiary20" />
        <ColorCard className="bg-ref-tertiary10" />
        <ColorCard className="bg-ref-tertiary0" />
      </Row>
      <Row header="Error" noGap>
        <ColorCard className="bg-ref-error100" />
        <ColorCard className="bg-ref-error99" />
        <ColorCard className="bg-ref-error98" />
        <ColorCard className="bg-ref-error95" />
        <ColorCard className="bg-ref-error90" />
        <ColorCard className="bg-ref-error80" />
        <ColorCard className="bg-ref-error70" />
        <ColorCard className="bg-ref-error60" />
        <ColorCard className="bg-ref-error50" />
        <ColorCard className="bg-ref-error40" />
        <ColorCard className="bg-ref-error30" />
        <ColorCard className="bg-ref-error20" />
        <ColorCard className="bg-ref-error10" />
        <ColorCard className="bg-ref-error0" />
      </Row>
      <Row header="Neutral" noGap>
        <ColorCard className="bg-ref-neutral100" />
        <ColorCard className="bg-ref-neutral99" />
        <ColorCard className="bg-ref-neutral98" />
        <ColorCard className="bg-ref-neutral96" />
        <ColorCard className="bg-ref-neutral95" />
        <ColorCard className="bg-ref-neutral94" />
        <ColorCard className="bg-ref-neutral92" />
        <ColorCard className="bg-ref-neutral90" />
        <ColorCard className="bg-ref-neutral87" />
        <ColorCard className="bg-ref-neutral80" />
        <ColorCard className="bg-ref-neutral70" />
        <ColorCard className="bg-ref-neutral60" />
        <ColorCard className="bg-ref-neutral50" />
        <ColorCard className="bg-ref-neutral40" />
        <ColorCard className="bg-ref-neutral30" />
        <ColorCard className="bg-ref-neutral24" />
        <ColorCard className="bg-ref-neutral22" />
        <ColorCard className="bg-ref-neutral20" />
        <ColorCard className="bg-ref-neutral17" />
        <ColorCard className="bg-ref-neutral12" />
        <ColorCard className="bg-ref-neutral10" />
        <ColorCard className="bg-ref-neutral6" />
        <ColorCard className="bg-ref-neutral4" />
        <ColorCard className="bg-ref-neutral0" />
      </Row>
      <Row header="Neutral Variant" noGap>
        <ColorCard className="bg-ref-neutral-variant100" />
        <ColorCard className="bg-ref-neutral-variant99" />
        <ColorCard className="bg-ref-neutral-variant98" />
        <ColorCard className="bg-ref-neutral-variant95" />
        <ColorCard className="bg-ref-neutral-variant90" />
        <ColorCard className="bg-ref-neutral-variant80" />
        <ColorCard className="bg-ref-neutral-variant70" />
        <ColorCard className="bg-ref-neutral-variant60" />
        <ColorCard className="bg-ref-neutral-variant50" />
        <ColorCard className="bg-ref-neutral-variant40" />
        <ColorCard className="bg-ref-neutral-variant30" />
        <ColorCard className="bg-ref-neutral-variant20" />
        <ColorCard className="bg-ref-neutral-variant10" />
        <ColorCard className="bg-ref-neutral-variant0" />
      </Row>
      <Row header="Static" noGap>
        <ColorCard className="bg-ref-black" />
        <ColorCard className="bg-ref-white" />
      </Row>
      {/* <Row header="Primary" noGap>
        <ColorCard className="bg-md-sys-color-primary" />
        <ColorCard className="bg-md-sys-color-on-primary" />
        <ColorCard className="bg-md-sys-color-primary-container" />
        <ColorCard className="bg-md-sys-color-on-primary-container" />
      </Row>
      <Row header="Secondary" noGap>
        <ColorCard className="bg-md-sys-color-secondary" />
        <ColorCard className="bg-md-sys-color-on-secondary" />
        <ColorCard className="bg-md-sys-color-secondary-container" />
        <ColorCard className="bg-md-sys-color-on-secondary-container" />
      </Row>
      <Row header="Tertiary" noGap>
        <ColorCard className="bg-md-sys-color-tertiary" />
        <ColorCard className="bg-md-sys-color-on-tertiary" />
        <ColorCard className="bg-md-sys-color-tertiary-container" />
        <ColorCard className="bg-md-sys-color-on-tertiary-container" />
      </Row>
      <Row header="Error" noGap>
        <ColorCard className="bg-md-sys-color-error" />
        <ColorCard className="bg-md-sys-color-on-error" />
        <ColorCard className="bg-md-sys-color-error-container" />
        <ColorCard className="bg-md-sys-color-on-error-container" />
      </Row>
      <Row header="Surface" noGap>
        <ColorCard className="bg-md-sys-color-surface" />
        <ColorCard className="bg-md-sys-color-on-surface" />
        <ColorCard className="bg-md-sys-color-surface-variant" />
        <ColorCard className="bg-md-sys-color-on-surface-variant" />
        <ColorCard
          className="bg-md-sys-color-surface-tint"
          children="DEPRECATED"
        />
      </Row>
      <Row header="Surface Container" noGap>
        <ColorCard className="bg-md-sys-color-surface-container-highest" />
        <ColorCard className="bg-md-sys-color-surface-container-high" />
        <ColorCard className="bg-md-sys-color-surface-container" />
        <ColorCard className="bg-md-sys-color-surface-container-low" />
        <ColorCard className="bg-md-sys-color-surface-container-lowest" />
      </Row>
      <Row header="Surface Inverse" noGap>
        <ColorCard className="bg-md-sys-color-inverse-surface" />
        <ColorCard className="bg-md-sys-color-inverse-on-surface" />
        <ColorCard className="bg-md-sys-color-inverse-primary" />
      </Row>
      <Row header="Outline" noGap>
        <ColorCard className="bg-md-sys-color-outline" />
        <ColorCard className="bg-md-sys-color-outline-variant" />
      </Row>
      <Row header="Addon" noGap>
        <ColorCard className="bg-md-sys-color-background" />
        <ColorCard className="bg-md-sys-color-on-background" />
        <ColorCard className="bg-md-sys-color-on-surface-bright" />
        <ColorCard className="bg-md-sys-color-on-surface-dim" />
        <ColorCard className="bg-md-sys-color-scrim" />
        <ColorCard className="bg-md-sys-color-shadow" />
      </Row> */}
    </div>
  );
}

function Surface({
  className,
  children,
  disableHoverPropagation,
  classCount = 1,
}: {
  className?: string;
  children?: React.ReactNode;
  disableHoverPropagation?: boolean;
  classCount?: number;
}) {
  const label = className?.split(' ').slice(0, classCount);
  const invisibleLabel = true;

  return (
    <div className="flex h-fit w-fit min-w-32 flex-col bg-neutral-500/10">
      <div
        className={`relative ${disableHoverPropagation ? className?.replace('hover:', '[&:not(:has(*:hover))]:hover:') : className}`}
      >
        <div
          className={`absolute inset-0 -z-10 bg-[repeating-linear-gradient(45deg,_gray_0,_gray_2px,_transparent_0,_transparent_12px)]`}
        />
        <div className="pointer-events-none z-10 m-2 flex flex-col gap-2">
          {label && label?.length > 0 && (
            <div className="flex flex-col">
              {label.map((classStr, index) => (
                <span
                  key={index}
                  className={`text-xs wrap-anywhere text-neutral-700/20 dark:text-neutral-300/20 ${invisibleLabel ? 'invisible' : ''}`}
                >
                  {classStr}
                </span>
              ))}
            </div>
          )}
          {children && <span className="pointer-events-auto">{children}</span>}
        </div>
      </div>
    </div>
  );
}

function ColorCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-32 flex-col bg-neutral-500/10">
      <div className="relative aspect-square">
        <div
          className={`absolute inset-0 bg-[repeating-linear-gradient(45deg,_gray_0,_gray_2px,_transparent_0,_transparent_12px)]`}
        />
        <div className={`absolute inset-0 ${className}`} />
      </div>
      <div className="my-2 flex flex-col text-center text-xs wrap-anywhere">
        <span className="text-neutral-500">
          {className?.split(' ')[0]?.replace('bg-', '')}
        </span>
        <span className="text-neutral-500/50">{children}</span>
      </div>
    </div>
  );
}

function SurfaceRecursion({
  children,
  label,
}: {
  children?: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit bg-neutral-500/10 bg-[repeating-linear-gradient(45deg,_gray_0,_gray_2px,_transparent_0,_transparent_12px)] **:aspect-square **:w-fit **:p-8">
        {children}
      </div>
      {label && <h3 className="text-center text-neutral-500">{label}</h3>}
    </div>
  );
}

function Row({
  children,
  header,
  noGap,
  className,
}: {
  children?: React.ReactNode;
  header?: string;
  noGap?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 px-8 py-2 ${className}`}>
      {header && <h2>{header}</h2>}
      <div
        className={`flex flex-row flex-wrap ${noGap ? '' : 'gap-4'} items-start`}
      >
        {children}
      </div>
    </div>
  );
}
