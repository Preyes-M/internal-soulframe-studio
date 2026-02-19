import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkStatusChange, onBulkDelete, onClearSelection }) => {
  const statusOptions = [
    { value: 'needed', label: 'Mark as Needed' },
    { value: 'ordered', label: 'Mark as Ordered' },
    { value: 'received', label: 'Mark as Received' },
    { value: 'cancelled', label: 'Mark as Cancelled' }
  ];

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex flex-col sm:flex-row items-center gap-3 min-w-[320px] sm:min-w-[480px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {selectedCount}
        </div>
        <span className="text-sm font-medium text-foreground">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Select
          options={statusOptions}
          value=""
          onChange={(value) => onBulkStatusChange(value)}
          placeholder="Change status"
          className="w-40"
        />

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          iconName="Trash2"
          iconPosition="left"
        >
          Delete
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          iconName="X"
        />
      </div>
    </div>
  );
};

export default BulkActionsBar;