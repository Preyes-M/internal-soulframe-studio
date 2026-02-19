import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onClearSelection, onBulkAction }) => {
  const statusOptions = [
    { value: 'To Do', label: 'Move to To Do' },
    { value: 'In Progress', label: 'Move to In Progress' },
    { value: 'Waiting', label: 'Move to Waiting' },
    { value: 'Done', label: 'Move to Done' }
  ];

  const assigneeOptions = [
    { value: 'Rajesh Kumar', label: 'Assign to Rajesh Kumar' },
    { value: 'Priya Sharma', label: 'Assign to Priya Sharma' },
    { value: 'Amit Patel', label: 'Assign to Amit Patel' },
    { value: 'Neha Singh', label: 'Assign to Neha Singh' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'Set High Priority' },
    { value: 'medium', label: 'Set Medium Priority' },
    { value: 'low', label: 'Set Low Priority' }
  ];

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
          <span className="text-sm font-semibold">{selectedCount}</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Select
          placeholder="Change status"
          options={statusOptions}
          value=""
          onChange={(value) => onBulkAction('status', value)}
          className="w-48"
        />

        <Select
          placeholder="Reassign"
          options={assigneeOptions}
          value=""
          onChange={(value) => onBulkAction('assignee', value)}
          className="w-48"
        />

        <Select
          placeholder="Set priority"
          options={priorityOptions}
          value=""
          onChange={(value) => onBulkAction('priority', value)}
          className="w-48"
        />
      </div>

      <div className="h-6 w-px bg-border" />

      <Button
        variant="ghost"
        size="sm"
        iconName="X"
        iconSize={16}
        onClick={onClearSelection}
      >
        Clear
      </Button>
    </div>
  );
};

export default BulkActionsBar;