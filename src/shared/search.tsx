import { createContext, useContext, useState, type ReactNode } from 'react';

const SearchContext = createContext<{ query: string; setQuery: (q: string) => void } | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const value = useContext(SearchContext);
  if (!value) throw new Error('useSearch must be used inside <SearchProvider>');
  return value;
}
