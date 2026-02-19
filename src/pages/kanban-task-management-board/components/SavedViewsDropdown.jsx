import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedViewsDropdown = ({ currentView, onViewChange, onSaveView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const savedViews = [
    { id: 'all', name: 'All Tasks', icon: 'LayoutGrid' },
    { id: 'my-tasks', name: 'My Tasks', icon: 'User' },
    { id: 'urgent', name: 'Urgent Only', icon: 'AlertCircle' },
    { id: 'this-week', name: 'This Week', icon: 'Calendar' },
    { id: 'editing', name: 'Editing Tasks', icon: 'Film' }
  ];

  const handleSaveView = () => {
    if (newViewName?.trim()) {
      onSaveView(newViewName);
      setNewViewName('');
      setShowSaveDialog(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        iconName="Eye"
        iconPosition="left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {savedViews?.find(v => v?.id === currentView)?.name || 'All Tasks'}
        <Icon name="ChevronDown" size={16} className="ml-2" />
      </Button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-[200]">
            <div className="p-2">
              {savedViews?.map((view) => (
                <button
                  key={view?.id}
                  onClick={() => {
                    onViewChange(view?.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    currentView === view?.id
                      ? 'bg-primary/20 text-primary' :'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={view?.icon} size={16} />
                  <span>{view?.name}</span>
                  {currentView === view?.id && (
                    <Icon name="Check" size={16} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-border p-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors duration-200"
              >
                <Icon name="Plus" size={16} />
                <span>Save Current View</span>
              </button>
            </div>
          </div>
        </>
      )}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Save Current View
            </h3>
            <input
              type="text"
              placeholder="Enter view name"
              value={newViewName}
              onChange={(e) => setNewViewName(e?.target?.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewViewName('');
                }}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleSaveView}>
                Save View
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedViewsDropdown;