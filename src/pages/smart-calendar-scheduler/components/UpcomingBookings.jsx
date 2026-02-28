import React from 'react';
import Icon from '../../../components/AppIcon';
import { convertTo12Hour } from '../../../utils/timeFormat';
import { shootTypeColors } from '../../../utils/Constants';

const UpcomingBookings = ({ bookings, onBookingClick }) => {

  const shootTypeLabels = {
    modeling: 'Modeling',
    podcasting: 'Podcasting',
    maternity: 'Maternity',
    fashion: 'Fashion',
    baby: 'Baby',
    product: 'Product'
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings?.filter(booking => {
        const bookingDate = new Date(`${booking.date}T${booking.time}`);
        return bookingDate >= now;
      })?.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      })?.slice(0, 5);
  };

  const formatDateTime = (date, time) => {
    const bookingDate = new Date(`${date}T${time}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);

    let dateLabel = bookingDate?.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });

    if (bookingDate?.toDateString() === today?.toDateString()) {
      dateLabel = 'Today';
    } else if (bookingDate?.toDateString() === tomorrow?.toDateString()) {
      dateLabel = 'Tomorrow';
    }

    return { dateLabel, time: convertTo12Hour(time) };
  };

  const upcomingBookings = getUpcomingBookings();

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/20">
          <Icon name="CalendarClock" size={20} color="var(--color-secondary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Upcoming Shoots</h3>
      </div>
      {upcomingBookings?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No upcoming bookings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingBookings?.map((booking) => {
            const { dateLabel, time } = formatDateTime(booking?.date, booking?.time);
            return (
              <div
                key={booking?.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                onClick={() => onBookingClick(booking)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground mb-1">
                      {booking?.clientName}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${shootTypeColors?.[booking?.shootType]}`}>
                      {shootTypeLabels?.[booking?.shootType]}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    <span>{dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Timer" size={12} />
                    <span>{booking?.duration}m</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;