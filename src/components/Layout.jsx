import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UserProfileDropdown from './UserProfileDropdown';
import NotificationCenter from './NotificationCenter';
import QuickAddFAB from './QuickAddFAB';
import SearchCommandPalette from './SearchCommandPalette';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event?.metaKey || event?.ctrlKey) && event?.key === 'k') {
        event?.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div
        className={`main-content ${
          isSidebarCollapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        <header className="sticky top-0 z-[100] flex items-center justify-between h-20 px-6 bg-card border-b border-border">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted/50 rounded-lg transition-colors duration-200"
              onClick={() => setIsSearchOpen(true)}
            >
              <span>Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-background rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <UserProfileDropdown />
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>

      <QuickAddFAB />

      <SearchCommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Layout;