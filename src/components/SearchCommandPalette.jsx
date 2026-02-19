import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

const SearchCommandPalette = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const allResults = [
    {
      category: 'Clients',
      items: [
        { id: 1, title: 'Priya & Arjun Wedding', type: 'Client', icon: 'Users', link: '/client-crm-directory' },
        { id: 2, title: 'Mehta Family Portfolio', type: 'Client', icon: 'Users', link: '/client-crm-directory' },
        { id: 3, title: 'Sharma Corporate Shoot', type: 'Client', icon: 'Users', link: '/client-crm-directory' },
      ],
    },
    {
      category: 'Tasks',
      items: [
        { id: 4, title: 'Edit wedding photos', type: 'Task', icon: 'CheckSquare', link: '/kanban-task-management-board' },
        { id: 5, title: 'Prepare portfolio album', type: 'Task', icon: 'CheckSquare', link: '/kanban-task-management-board' },
        { id: 6, title: 'Client follow-up calls', type: 'Task', icon: 'CheckSquare', link: '/kanban-task-management-board' },
      ],
    },
    {
      category: 'Bookings',
      items: [
        { id: 7, title: 'Wedding Shoot - Jan 15', type: 'Booking', icon: 'Calendar', link: '/smart-calendar-scheduler' },
        { id: 8, title: 'Portrait Session - Jan 18', type: 'Booking', icon: 'Calendar', link: '/smart-calendar-scheduler' },
        { id: 9, title: 'Corporate Event - Jan 20', type: 'Booking', icon: 'Calendar', link: '/smart-calendar-scheduler' },
      ],
    },
    {
      category: 'Inventory',
      items: [
        { id: 10, title: 'Camera Lens 50mm', type: 'Equipment', icon: 'ShoppingCart', link: '/shopping-list-management' },
        { id: 11, title: 'Studio Lighting Kit', type: 'Equipment', icon: 'ShoppingCart', link: '/shopping-list-management' },
        { id: 12, title: 'Backdrop Stands', type: 'Equipment', icon: 'ShoppingCart', link: '/shopping-list-management' },
      ],
    },
  ];

  const filteredResults = searchQuery
    ? allResults?.map((category) => ({
          ...category,
          items: category?.items?.filter((item) =>
            item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          ),
        }))?.filter((category) => category?.items?.length > 0)
    : allResults;

  const flatResults = filteredResults?.flatMap((category) => category?.items);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event?.key === 'Escape') {
        onClose();
      } else if (event?.key === 'ArrowDown') {
        event?.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResults?.length - 1 ? prev + 1 : prev
        );
      } else if (event?.key === 'ArrowUp') {
        event?.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event?.key === 'Enter' && flatResults?.[selectedIndex]) {
        event?.preventDefault();
        handleResultClick(flatResults?.[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatResults, onClose]);

  const handleResultClick = (result) => {
    console.log('Navigate to:', result?.link);
    onClose();
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const handleOverlayClick = (event) => {
    if (event?.target === event?.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-palette-overlay" onClick={handleOverlayClick}>
      <div className="search-palette">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Icon name="Search" size={20} className="text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            className="search-palette-input"
            placeholder="Search clients, tasks, bookings, inventory..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e?.target?.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground bg-muted rounded">
            ESC
          </kbd>
        </div>

        <div className="search-palette-results">
          {flatResults?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Icon name="Search" size={48} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No results found' : 'Start typing to search...'}
              </p>
            </div>
          ) : (
            filteredResults?.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category?.category}
                </div>
                {category?.items?.map((item, itemIndex) => {
                  const globalIndex = flatResults?.findIndex((r) => r?.id === item?.id);
                  return (
                    <div
                      key={item?.id}
                      className={`search-palette-result-item ${
                        globalIndex === selectedIndex ? 'selected' : ''
                      }`}
                      onClick={() => handleResultClick(item)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                        <Icon name={item?.icon} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {item?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{item?.type}</p>
                      </div>
                      <Icon
                        name="CornerDownLeft"
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-muted rounded">↑</kbd>
              <kbd className="px-2 py-1 bg-muted rounded">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-muted rounded">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchCommandPalette;