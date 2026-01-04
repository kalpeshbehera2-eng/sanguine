import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  FileText, 
  Newspaper, 
  User, 
  Menu, 
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileSection from './components/profile/ProfileSection';

const NAV_ITEMS = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Health Guide', icon: FileText, page: 'Articles' },
  { name: 'News & Maps', icon: Newspaper, page: 'NewsAndMaps' },
];

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wind className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  BREATHE SMARTER
                </h1>
                <p className="text-xs text-white/40 -mt-0.5">Air Quality Monitor</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                      isActive 
                        ? 'text-white' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-teal-500/20 rounded-xl border border-teal-500/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile & Mobile Menu */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Avatar className="w-8 h-8">
                  {currentUser?.avatar && <AvatarImage src={currentUser.avatar} />}
                  <AvatarFallback className="bg-teal-500/20 text-teal-400 text-sm">
                    {(currentUser?.full_name || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white/70 text-sm hidden sm:block">
                  {currentUser?.full_name || 'Profile'}
                </span>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
            >
              <nav className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentPageName === item.page;
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.page)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-teal-500/20 text-white border border-teal-500/30' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Profile Sidebar */}
      <ProfileSection
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={handleUserUpdate}
      />

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl">
                <Wind className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="text-white font-semibold">BREATHE SMARTER</span>
                <p className="text-white/30 text-xs">Making air quality accessible to everyone</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <span>© 2024 Breathe Smarter</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
