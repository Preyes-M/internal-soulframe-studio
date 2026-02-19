import React from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onClearSelection, onBulkAction }) => {
  const bulkActionOptions = [
    { value: 'status', label: 'Change Status' },
    { value: 'export', label: 'Export Selected' },
    { value: 'email', label: 'Send Email Campaign' },
    { value: 'delete', label: 'Delete Selected' },
  ];

  const handleActionChange = (value) => {
    if (value) {
      onBulkAction(value);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 bg-card border border-border rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
        <span className="text-sm font-medium text-foreground">
          {selectedCount} client{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="w-px h-6 bg-border" />

      <Select
        options={bulkActionOptions}
        value=""
        onChange={handleActionChange}
        placeholder="Bulk Actions"
        className="w-48"
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        iconName="X"
        iconSize={16}
      >
        Clear
      </Button>
    </div>
  );
};

export default BulkActionsBar;