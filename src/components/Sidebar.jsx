import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { signOut } = useAuth();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/command-center-dashboard',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Schedule',
      path: '/smart-calendar-scheduler',
      icon: 'Calendar',
    },
    {
      label: 'Tasks',
      path: '/kanban-task-management-board',
      icon: 'CheckSquare',
    },
    {
      label: 'Clients',
      path: '/client-crm-directory',
      icon: 'Users',
    },
    {
      label: 'Analytics',
      path: '/revenue-analytics-dashboard',
      icon: 'TrendingUp',
    },
     {
      label: 'Professionals',
      path: '/professionals',
      icon: 'Users',
    },
    {
      label: 'Inventory',
      path: '/shopping-list-management',
      icon: 'ShoppingCart',
    },
  ];

  const isActive = (path) => location?.pathname === path;

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Edge-swipe to open and swipe-left to close on mobile
  useEffect(() => {
    let startX = null;

    const onDocTouchStart = (e) => {
      if (e.touches?.length === 1 && e.touches[0].clientX < 24) {
        startX = e.touches[0].clientX;
      } else {
        startX = null;
      }
    };

    const onDocTouchMove = (e) => {
      if (startX !== null) {
        const delta = e.touches[0].clientX - startX;
        if (delta > 60) setIsMobileOpen(true);
      }
    };

    const onDocTouchEnd = () => {
      startX = null;
    };

    document.addEventListener('touchstart', onDocTouchStart, { passive: true });
    document.addEventListener('touchmove', onDocTouchMove, { passive: true });
    document.addEventListener('touchend', onDocTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onDocTouchStart);
      document.removeEventListener('touchmove', onDocTouchMove);
      document.removeEventListener('touchend', onDocTouchEnd);
    };
  }, []);

  const sidebarTouchStartRef = useRef(null);

  return (
    <>

      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={handleMobileToggle}
          aria-hidden="true"
        />
      )}
      <aside
        onTouchStart={(e) => {
          if (e.touches?.length === 1) sidebarTouchStartRef.current = e.touches[0].clientX;
        }}
        onTouchMove={(e) => {
          if (sidebarTouchStartRef.current != null) {
            const delta = e.touches[0].clientX - sidebarTouchStartRef.current;
            if (delta < -60) setIsMobileOpen(false);
          }
        }}
        onTouchEnd={() => { sidebarTouchStartRef.current = null; }}
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="sidebar-header relative">
          <div className="sidebar-logo">
            <Icon name="Camera" size={24} color="var(--color-primary)" />
          </div>
          <span className="sidebar-logo-text">SoulFrame Studio</span>

          {/* Close button visible on mobile when menu is open */}
          {isMobileOpen && (
            <button
              className="lg:hidden absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md bg-muted hover:bg-muted-foreground/20 transition-colors duration-200"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="X" size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`sidebar-nav-item ${
                isActive(item?.path) ? 'active' : ''
              }`}
              onClick={handleNavClick}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon name={item?.icon} size={20} />
              <span className="sidebar-nav-item-text">{item?.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto mb-20 px-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <Icon name="LogOut" size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        {!isCollapsed && (
          <button
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted-foreground/20 transition-colors duration-200"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
          >
            <Icon name="ChevronsLeft" size={20} />
          </button>
        )}

        {isCollapsed && (
          <button
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted-foreground/20 transition-colors duration-200"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
          >
            <Icon name="ChevronsRight" size={20} />
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;