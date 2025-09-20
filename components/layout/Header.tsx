import React from 'react';
import { Menu } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { AnimatedLogoutButton } from '../ui/AnimatedLogoutButton';
import toast from 'react-hot-toast';

interface HeaderProps {
    toggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
    const { user, t, lang, logout } = useAppContext();

    const handleSignOut = () => {
        logout();
        toast.success('تم تسجيل الخروج بنجاح.');
    };

    if (!user) return null;

    return (
        <>
            {/* Desktop Header */}
            <header 
                className="hidden lg:flex bg-white/70 dark:bg-slate-700/70 backdrop-blur-lg px-4 py-3 items-center justify-between border-b border-slate-200 dark:border-slate-600 sticky top-0 z-20 gap-4"
                dir="ltr"
            >
                {/* Left Side: User Info & Toggles */}
                <div className="flex items-center gap-3 flex-shrink-0">
                     <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                        <LanguageToggle />
                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-600"></div>
                        <ThemeToggle />
                    </div>
                     <div className="h-8 w-px bg-slate-200 dark:bg-slate-500"></div>
                     <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.position}</p>
                    </div>
                     <AnimatedLogoutButton
                        onClick={handleSignOut}
                        text={t('logout')}
                    />
                </div>

                {/* Right Side: Breadcrumbs (Flexible) */}
                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                   <Breadcrumbs />
                </div>
            </header>

            {/* Mobile Header (Rebuilt with Flexbox) */}
            <header 
                className="lg:hidden sticky top-0 z-20 p-2 h-[70px] bg-white/70 dark:bg-slate-700/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-600"
                dir="ltr"
            >
                <div className="flex items-center justify-between w-full h-full">
                    {/* Left Side: Developer Logo */}
                    <div>
                        <img 
                            src="https://www2.0zz0.com/2025/09/11/09/271562700.gif" 
                            alt="Developer Logo"
                            className="h-12 w-12"
                        />
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full shadow-lg">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {/* Right Side: Hamburger Menu */}
                    <div>
                         <button
                            onClick={toggleMobileMenu}
                            className="p-3 rounded-full text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/70 backdrop-blur-lg shadow-md"
                            aria-label="Toggle Menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};