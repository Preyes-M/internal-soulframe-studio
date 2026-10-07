import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({ currentDate, view, onViewChange, onNavigate, onToday }) => {
  const formatDate = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentDate?.toLocaleDateString('en-IN', options);
  };
  const viewOptions = [
    { value: 'month', label: 'Month', icon: 'Calendar' },
    { value: 'week', label: 'Week', icon: 'CalendarDays' },
    { value: 'day', label: 'Day', icon: 'CalendarClock' }
  ];

  const getPeriodLabel = () => {
    if (view === 'day') {
      return currentDate?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (view === 'week') {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const startLabel = start.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        ...(start.getFullYear() !== end.getFullYear() && { year: 'numeric' })
      });
      const endLabel = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${startLabel} – ${endLabel}`;
    }
    return currentDate?.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            {getPeriodLabel()}
          </h1>
          <div className="text-xs text-muted-foreground mt-1">Today: {formatDate(new Date())}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          iconName="CalendarCheck"
          iconPosition="left"
        >
          Today
        </Button>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('prev')}
            iconName="ChevronLeft"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('next')}
            iconName="ChevronRight"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {viewOptions?.map((option) => (
            <button
              key={option?.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onViewChange(option?.value)}
            >
              <Icon name={option?.icon} size={16} />
              <span className="hidden sm:inline">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;