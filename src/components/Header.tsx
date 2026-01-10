import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import nixacomLogo from '@/assets/nixacom-logo.png';

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={nixacomLogo} alt="Nixacom" className="h-10 w-auto" />
          <span className="text-lg font-semibold text-foreground">AutoApply</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.dashboard')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
