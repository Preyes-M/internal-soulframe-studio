import React from 'react';
import Icon from '../../../components/AppIcon';
import { BOOKING_STATUSES, getBookingStatusKey } from '../bookingStatus';

// Matches the range CalendarGrid renders for each view
const isInView = (date, currentDate, view) => {
  if (view === 'day') return date.toDateString() === currentDate.toDateString();
  if (view === 'week') {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
    return date >= start && date < end;
  }
  return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth();
};

const StatusLegend = ({ bookings, currentDate, view }) => {
  const visibleBookings = (bookings || []).filter((booking) => {
    const [y, m, d] = (booking?.date || '').slice(0, 10).split('-').map(Number);
    return y && isInView(new Date(y, m - 1, d), currentDate, view);
  });

  const counts = visibleBookings.reduce((acc, booking) => {
    const key = getBookingStatusKey(booking);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Cancelled is only shown when there's something to show, to keep focus on the active workflow
  const statuses = BOOKING_STATUSES.filter((s) => s.key !== 'cancelled' || counts[s.key]);

  return (
    <div className="bg-card rounded-lg border border-border px-4 py-3 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Shoot Status · This {view === 'day' ? 'Day' : view === 'week' ? 'Week' : 'Month'}
      </span>
      {statuses.map((status) => (
        <div key={status.key} className="flex items-center gap-2" title={status.description}>
          <span className={`w-3 h-3 rounded-full ${status.dot}`} />
          <Icon name={status.icon} size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{status.label}</span>
          <span className="text-xs font-semibold text-muted-foreground">{counts[status.key] || 0}</span>
        </div>
      ))}
    </div>
  );
};

export default StatusLegend;
