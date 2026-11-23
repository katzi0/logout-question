import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CatalogOptions } from '../catalog/catalog-api';

/** Interviewer tools state. Not part of the exercise. */
interface DevSettingsValue {
  options: CatalogOptions;
  set: <K extends keyof CatalogOptions>(key: K, value: CatalogOptions[K]) => void;
}

const DevSettingsContext = createContext<DevSettingsValue | null>(null);

export function DevSettingsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<CatalogOptions>({
    includeNewType: false,
    includeUnknownType: false,
    manyProducts: false,
  });
  const set: DevSettingsValue['set'] = (key, value) => setOptions((o) => ({ ...o, [key]: value }));
  return <DevSettingsContext.Provider value={{ options, set }}>{children}</DevSettingsContext.Provider>;
}

export function useDevSettings() {
  const value = useContext(DevSettingsContext);
  if (!value) throw new Error('useDevSettings must be used inside <DevSettingsProvider>');
  return value;
}
