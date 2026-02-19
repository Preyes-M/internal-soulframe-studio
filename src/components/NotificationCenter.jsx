import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'shoot',
      title: 'Upcoming Shoot Reminder',
      message: 'Wedding shoot with Priya & Arjun tomorrow at 10:00 AM',
      time: '2 hours ago',
      icon: 'Camera',
      color: 'text-primary',
      link: '/smart-calendar-scheduler',
    },
    {
      id: 2,
      type: 'task',
      title: 'Task Deadline Approaching',
      message: 'Photo editing for Mehta family due in 3 hours',
      time: '4 hours ago',
      icon: 'AlertCircle',
      color: 'text-warning',
      link: '/kanban-task-management-board',
    },
    {
      id: 3,
      type: 'conflict',
      title: 'Schedule Conflict',
      message: 'Double booking detected for January 15th',
      time: '5 hours ago',
      icon: 'AlertTriangle',
      color: 'text-error',
      link: '/smart-calendar-scheduler',
    },
    {
      id: 4,
      type: 'client',
      title: 'New Client Inquiry',
      message: 'Sharma family interested in portfolio shoot',
      time: '1 day ago',
      icon: 'Users',
      color: 'text-success',
      link: '/client-crm-directory',
    },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.length;

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

  const handleNotificationClick = (notification) => {
    console.log('Navigate to:', notification?.link);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors duration-200"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-error rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="notification-panel">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            {notifications?.length > 0 && (
              <button
                className="text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            )}
          </div>

          {notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Icon name="Bell" size={48} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <div>
              {notifications?.map((notification) => (
                <div
                  key={notification?.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`flex-shrink-0 ${notification?.color}`}>
                    <Icon name={notification?.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {notification?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification?.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification?.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;