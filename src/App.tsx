import { CatalogPage } from './catalog/CatalogPage';
import { DevPanel } from './dev/DevPanel';
import { DevSettingsProvider } from './dev/dev-settings';
import { Header } from './layout/Header';
import { CartProvider } from './shared/cart';
import { SearchProvider } from './shared/search';

export function App() {
  return (
    <DevSettingsProvider>
      <CartProvider>
        <SearchProvider>
          <Header />
          <main className="page">
            <CatalogPage />
          </main>
          <DevPanel />
        </SearchProvider>
      </CartProvider>
    </DevSettingsProvider>
  );
}
