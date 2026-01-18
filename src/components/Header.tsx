import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { LogOut, User, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session_start');
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <img src="/logo-full.png" alt="Nixacom AutoApply" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Navigation - Professional & Clean */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/50">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/')
              ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100/50'
              }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/admin"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/admin')
              ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100/50'
              }`}
          >
            {t('nav.dashboard')}
          </Link>
          <a
            href="#"
            className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100/50 transition-all duration-200"
          >
            Aide
          </a>
        </nav>

        {/* Right Section: Language & User */}
        <div className="flex items-center gap-4">
          <LanguageToggle />

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm ring-2 ring-white shadow-sm hover:ring-primary/20 transition-all cursor-pointer">
                  AD
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Dashboard Admin</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
