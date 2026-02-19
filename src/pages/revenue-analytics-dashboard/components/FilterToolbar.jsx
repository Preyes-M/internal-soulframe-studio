import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [shootTypes, setShootTypes] = useState([]);
  const [clientSegment, setClientSegment] = useState('all');

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const shootTypeOptions = [
    { value: 'modeling', label: 'Modeling' },
    { value: 'podcasting', label: 'Podcasting' },
    { value: 'maternity', label: 'Maternity' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'baby', label: 'Baby' },
    { value: 'product', label: 'Product' }
  ];

  const clientSegmentOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'new', label: 'New Clients' },
    { value: 'returning', label: 'Returning Clients' },
    { value: 'vip', label: 'VIP Clients' }
  ];

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      shootTypes,
      clientSegment
    });
  };

  const handleResetFilters = () => {
    setDateRange('thisMonth');
    setShootTypes([]);
    setClientSegment('all');
    onFilterChange({
      dateRange: 'thisMonth',
      shootTypes: [],
      clientSegment: 'all'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
        <div className="flex-1 w-full lg:w-auto">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <div className="flex-1 w-full lg:w-auto">
          <Select
            label="Shoot Types"
            options={shootTypeOptions}
            value={shootTypes}
            onChange={setShootTypes}
            multiple
            searchable
            placeholder="Select shoot types"
          />
        </div>

        <div className="flex-1 w-full lg:w-auto">
          <Select
            label="Client Segment"
            options={clientSegmentOptions}
            value={clientSegment}
            onChange={setClientSegment}
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            variant="default"
            iconName="Filter"
            iconPosition="left"
            onClick={handleApplyFilters}
            fullWidth
            className="lg:w-auto"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            iconName="RotateCcw"
            onClick={handleResetFilters}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Quick Filters:</span>
        <button className="px-3 py-1 text-xs font-medium text-foreground bg-muted hover:bg-muted-foreground/20 rounded transition-colors">
          Last 7 Days
        </button>
        <button className="px-3 py-1 text-xs font-medium text-foreground bg-muted hover:bg-muted-foreground/20 rounded transition-colors">
          Last 30 Days
        </button>
        <button className="px-3 py-1 text-xs font-medium text-foreground bg-muted hover:bg-muted-foreground/20 rounded transition-colors">
          High Value Clients
        </button>
        <button className="px-3 py-1 text-xs font-medium text-foreground bg-muted hover:bg-muted-foreground/20 rounded transition-colors">
          Wedding Season
        </button>
      </div>
    </div>
  );
};

export default FilterToolbar;