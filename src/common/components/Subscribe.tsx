/**
 * @file Subscribe components that allow its children to react to changes in
 * stores from various state management libraries
 */

'use client';

import { Store, useSelector } from '@tanstack/react-store';
import { ReactNode, useMemo } from 'react';
import { createStore, StoreApi, UseBoundStore, useStore } from 'zustand';

function getSelectorFn<TState, TSelected>(
  selector?: (state: TState) => TSelected,
): (state: TState) => TSelected {
  return selector ?? ((state: TState) => state as unknown as TSelected);
}

interface BaseSubscribeProps<TStore, TState, TSelected> {
  store?: TStore;
  selector?: (state: TState) => TSelected;
  children: (state: TSelected) => ReactNode;
}

//
// Tanstack Store (used by Tanstack Form)
//

const emptyTanstackStore = new Store<Record<string, unknown>>({});

type TanstackSelectionSource<T> = {
  get: () => T;
  subscribe: (listener: (value: T) => void) => {
    unsubscribe: () => void;
  };
};

export type TanstackSubscribeProps<
  TState = unknown,
  TSelected = TState,
> = BaseSubscribeProps<TanstackSelectionSource<TState>, TState, TSelected>;

/**
 * Allows you to listen and react to changes in a Tanstack Store/Form store.
 * Useful for executing side effects or rendering specific components in response to state updates.
 *
 * @example
 * <TanstackSubscribe
 *   store={form.store}
 *   selector={(state) => state.isDirty}
 * >
 *   {(isDirty) => (
 *     <span>{isDirty ? "Dirty!" : "Clean!"}</span>
 *   )}
 * </TanstackSubscribe>
 */
export function TanstackSubscribe<TState = unknown, TSelected = TState>({
  store,
  selector,
  children,
}: TanstackSubscribeProps<TState, TSelected>) {
  const resolvedStore = (store ??
    emptyTanstackStore) as TanstackSelectionSource<TState>;
  const stableSelector = useMemo(
    () => (store ? getSelectorFn(selector) : undefined),
    [selector, store],
  );
  const slice = useSelector(resolvedStore, stableSelector);

  if (!store) return <>{children({} as TSelected)}</>;
  return <>{children(slice)}</>;
}

//
// Zustand
//

const emptyZustandStore = createStore<Record<string, unknown>>(() => ({}));

export type ZustandSubscribeProps<
  TState = unknown,
  TSelected = TState,
> = BaseSubscribeProps<UseBoundStore<StoreApi<TState>>, TState, TSelected>;

/**
 * Allows you to listen and react to changes in a Zustand store.
 * Useful for executing side effects or rendering specific components in response to state updates.
 */
export function ZustandSubscribe<TState = unknown, TSelected = TState>({
  store,
  selector,
  children,
}: ZustandSubscribeProps<TState, TSelected>) {
  const resolvedStore = (store ?? emptyZustandStore) as StoreApi<TState>;
  const stableSelector = useMemo(() => getSelectorFn(selector), [selector]);
  const slice = useStore(resolvedStore, stableSelector);

  if (!store) return <>{children({} as TSelected)}</>;
  return <>{children(slice)}</>;
}
