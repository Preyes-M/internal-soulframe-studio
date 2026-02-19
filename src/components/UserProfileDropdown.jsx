import React, { useState, useRef, useEffect } from 'react';
import { userService } from '../services/userService';
import { supabase } from '../lib/supabase';
import Icon from './AppIcon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
const handleSignOut = async () => {
    try {
      await signOut();
      await supabase.auth.signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
useEffect(() => {
  let mounted = true;

  const load = async () => {
    const [name, admin] = await Promise.all([
      userService.getName(),
      userService.isAdmin()
    ]);

    if (!mounted) return;

    setUserName(name);
    setUserRole(admin ? 'Admin' : 'Regular User');
  };

  load();


  return () => {
    mounted = false;
  };
}, []);

  const menuItems = [
    { label: 'Help & Support', icon: 'HelpCircle', action: () => alert('Call support at +91 9789216466') },
    { label: 'Sign Out', icon: 'LogOut', action: handleSignOut },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold">
          {userName?.charAt(0)}
        </div> */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{userName}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>
        <Icon
          name="ChevronDown"
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="user-profile-dropdown">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-sm font-medium text-foreground">{userName}</div>
            <div className="text-xs text-muted-foreground mt-1">{userRole}</div>
          </div>
          {menuItems?.map((item, index) => (
            <button
              key={index}
              className="user-profile-dropdown-item w-full"
              onClick={() => handleMenuClick(item?.action)}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;