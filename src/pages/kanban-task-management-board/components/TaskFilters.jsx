import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskFilters = ({ activeFilters, onFilterChange, onClearFilters }) => {
  const categories = ['Marketing/Content', 'Purchasing', 'Editing', 'Meetings'];
  const priorities = ['high', 'medium', 'low'];
  const assignees = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh'];

  const categoryColors = {
    'Marketing/Content': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Purchasing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Editing': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Meetings': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const toggleFilter = (type, value) => {
    const currentFilters = activeFilters?.[type] || [];
    const newFilters = currentFilters?.includes(value)
      ? currentFilters?.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange({ ...activeFilters, [type]: newFilters });
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(arr => arr?.length > 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={16} />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={14}
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <button
                key={category}
                onClick={() => toggleFilter('categories', category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  activeFilters?.categories?.includes(category)
                    ? categoryColors?.[category]
                    : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorities?.map((priority) => (
              <button
                key={priority}
                onClick={() => toggleFilter('priorities', priority)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all duration-200 ${
                  activeFilters?.priorities?.includes(priority)
                    ? priorityColors?.[priority]
                    : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Assignees
          </label>
          <div className="flex flex-wrap gap-2">
            {assignees?.map((assignee) => (
              <button
                key={assignee}
                onClick={() => toggleFilter('assignees', assignee)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  activeFilters?.assignees?.includes(assignee)
                    ? 'bg-primary/20 text-primary border-primary/30' :'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {assignee}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;