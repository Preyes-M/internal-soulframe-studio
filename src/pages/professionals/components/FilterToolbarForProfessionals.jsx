import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFilterChange }) => {
  const [professionalCategory, setProfessionalCategory] = useState('all');

  const professionalCategoryOptions = [
    { value: 'video', label: 'Videographer' },
    { value: 'photo', label: 'Photographer' },
    { value: 'costumes', label: 'Costumes' },
    { value: 'make-up-artist', label: 'Make up artist' },
    { value: 'models', label: 'Models' },
    { value: 'equipments', label: 'Equipments' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'studios', label: 'Studios' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleApplyFilters = () => {
    onFilterChange({
      professionalCategory
    });
  };

  const handleResetFilters = () => {
    setProfessionalCategory('all');
    onFilterChange({
      professionalCategory: 'all',
    
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
        <div className="flex-1 w-full lg:w-auto">
          <Select
            label="Professional Category"
            options={professionalCategoryOptions}
            value={professionalCategory}
            onChange={setProfessionalCategory}
          />
        </div>

        {/* <div className="flex-1 w-full lg:w-auto">
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
        </div> */}

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

      {/* <div className="flex flex-wrap items-center gap-2 mt-4">
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
      </div> */}
    </div>
  );
};

export default FilterToolbar;