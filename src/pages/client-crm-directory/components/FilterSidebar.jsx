import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { clientsService } from '../../../services/supabaseService';
import { humanize } from '../../../utils/text';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [shootTypeOptions, setShootTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { statuses, shootTypes } = await clientsService.getFilterValues();
        if (!mounted) return;
        if (statuses?.length) setStatusOptions(statuses.map((s) => ({ value: s, label: humanize(s) })));
        else setStatusOptions([]);

        if (shootTypes?.length) setShootTypeOptions(shootTypes.map((s) => ({ value: s, label: humanize(s) })));
        else setShootTypeOptions([]);
      } catch (err) {
        console.error('Failed to load filter values:', err);
        setStatusOptions([]);
        setShootTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);
  const dateRangeOptions = [
    'Last 7 days',
    'Last 30 days',
    'Last 3 months',
    'Last 6 months',
    'This year',
  ];

  const savedPresets = [
    { name: 'Active Clients', icon: 'Users' },
    { name: 'Pending Delivery', icon: 'Clock' },
    { name: 'High Value', icon: 'TrendingUp' },
    { name: 'Recent Leads', icon: 'UserPlus' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-card border-r border-border p-4 lg:p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-foreground">
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
          iconSize={16}
        >
          Clear
        </Button>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Tag" size={16} />
            Status
          </h4>
          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              statusOptions?.map((opt) => (
                <label
                  key={opt?.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={filters?.status?.includes(opt?.value)}
                    onChange={(e) => {
                      const newStatus = e?.target?.checked
                        ? [...filters?.status, opt?.value]
                        : filters?.status?.filter((s) => s !== opt?.value);
                      onFilterChange({ ...filters, status: newStatus });
                    }}
                    className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-foreground">{opt?.label}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Camera" size={16} />
            Shoot Type
          </h4>
          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              shootTypeOptions?.map((opt) => (
                <label
                  key={opt?.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={filters?.shootType?.includes(opt?.value)}
                    onChange={(e) => {
                      const newTypes = e?.target?.checked
                        ? [...filters?.shootType, opt?.value]
                        : filters?.shootType?.filter((t) => t !== opt?.value);
                      onFilterChange({ ...filters, shootType: newTypes });
                    }}
                    className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-foreground">{opt?.label}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Calendar" size={16} />
            Date Range
          </h4>
          <div className="space-y-2">
            {dateRangeOptions?.map((range) => (
              <label
                key={range}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="dateRange"
                  checked={filters?.dateRange === range}
                  onChange={() =>
                    onFilterChange({ ...filters, dateRange: range })
                  }
                  className="w-4 h-4 border-border bg-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-foreground">{range}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Bookmark" size={16} />
            Saved Presets
          </h4>
          <div className="space-y-2">
            {savedPresets?.map((preset) => (
              <button
                key={preset?.name}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name={preset?.icon} size={16} />
                <span>{preset?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;