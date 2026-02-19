import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

const QuickAddFAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fabRef = useRef(null);

  const quickAddOptions = [
    {
      label: 'New Booking',
      icon: 'Calendar',
      action: () => console.log('Add booking'),
      color: 'bg-primary',
    },
    {
      label: 'New Task',
      icon: 'CheckSquare',
      action: () => console.log('Add task'),
      color: 'bg-secondary',
    },
    {
      label: 'New Client',
      icon: 'UserPlus',
      action: () => console.log('Add client'),
      color: 'bg-success',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef?.current && !fabRef?.current?.contains(event?.target)) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (action) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="quick-add-fab" ref={fabRef}>
      {isExpanded && (
        <div className="quick-add-fab-menu">
          {quickAddOptions?.map((option, index) => (
            <button
              key={index}
              className="quick-add-fab-menu-item"
              onClick={() => handleOptionClick(option?.action)}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${option?.color} text-white`}
              >
                <Icon name={option?.icon} size={20} />
              </div>
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        className="quick-add-fab-button"
        onClick={handleToggle}
        aria-label="Quick add"
        aria-expanded={isExpanded}
      >
        <Icon
          name={isExpanded ? 'X' : 'Plus'}
          size={24}
          className={`transition-transform duration-250 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default QuickAddFAB;