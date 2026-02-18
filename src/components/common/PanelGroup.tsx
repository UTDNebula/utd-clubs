'use client';

import {
  ComponentProps,
  createContext,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PanelProps } from './Panel';

export type PanelItem = {
  props: PanelProps & { id: string };
  ref?: RefObject<HTMLDivElement>;
};

interface PanelGroupProviderContext {
  panels: PanelItem[];
  registerPanel: (panel: PanelItem) => void;
  unregisterPanel: (id: string) => void;
}

const PanelGroupContextDefault: PanelGroupProviderContext = {
  panels: [],
  registerPanel: () => {},
  unregisterPanel: () => {},
};

export const PanelGroupContext = createContext<PanelGroupProviderContext>(
  PanelGroupContextDefault,
);

export const usePanelGroup = () => useContext(PanelGroupContext);

type PanelGroupProps = ComponentProps<'div'>;

export const PanelGroup = (props: PanelGroupProps) => {
  const [panelsState, setPanelsState] = useState<PanelItem[]>([
    // { props: { id: 'test', heading: 'test' } },
  ]);

  const registerPanel: PanelGroupProviderContext['registerPanel'] = (
    panel: PanelItem,
  ) => {
    // Only allow panels that have an `id` prop provided
    if (panel.props.id) {
      console.log('set');
      setPanelsState((prev) => {
        const value = [...prev, panel];
        console.log('value', value);
        return [...prev, panel];
      });
    }
    console.log('panelsState', panelsState);
  };

  const unregisterPanel: PanelGroupProviderContext['unregisterPanel'] = (
    id: string,
  ) => {
    console.log(`unregister ${id}`);
    setPanelsState((prev) => prev.filter((ele) => ele.props.id !== id));
  };

  console.log('group render panels', panelsState);

  useEffect(() => {
    const handleScroll = () => {
      console.log('group scroll panels', panelsState);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <PanelGroupContext.Provider
      value={{
        panels: panelsState,
        registerPanel,
        unregisterPanel,
      }}
      key="panel-group"
    >
      <div {...props} />
    </PanelGroupContext.Provider>
  );
};

export default PanelGroup;
