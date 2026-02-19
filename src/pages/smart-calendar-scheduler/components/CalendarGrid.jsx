import React from 'react';
import Icon from '../../../components/AppIcon';
import { convertTo12Hour } from '../../../utils/timeFormat';

const CalendarGrid = ({ view, currentDate, bookings, onBookingClick }) => {
  const shootTypeColors = {
    modeling: 'bg-blue-500/20 border-blue-500 text-blue-400',
    podcasting: 'bg-purple-500/20 border-purple-500 text-purple-400',
    maternity: 'bg-pink-500/20 border-pink-500 text-pink-400',
    fashion: 'bg-red-500/20 border-red-500 text-red-400',
    baby: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    product: 'bg-green-500/20 border-green-500 text-green-400'
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days?.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek?.setDate(date?.getDate() - date?.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      days?.push(day);
    }
    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    return bookings?.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate?.toDateString() === date?.toDateString();
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays?.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-xs md:text-sm font-semibold text-muted-foreground bg-muted"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days?.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            return (
              <div
                key={index}
                className={`min-h-[80px] md:min-h-[120px] border-r border-b border-border p-2 ${
                  !day ? 'bg-muted/30' : 'bg-card hover:bg-muted/50'
                } transition-colors duration-200`}
              >
                {day && (
                  <>
                    <div
                      className={`text-xs md:text-sm font-medium mb-2 ${
                        isToday(day)
                          ? 'flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {day?.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings?.slice(0, 3)?.map((booking) => (
                        <div
                          key={booking?.id}
                          className={`text-xs px-2 py-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${
                            shootTypeColors?.[booking?.shootType]
                          }`}
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className="font-medium truncate">{booking?.clientName}</div>
                          <div className="text-[10px] opacity-80">{convertTo12Hour(booking?.time)}</div>
                        </div>
                      ))}
                      {dayBookings?.length > 3 && (
                        <div className="text-xs text-muted-foreground px-2">
                          +{dayBookings?.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
          <div className="px-2 py-3 text-xs md:text-sm font-semibold text-muted-foreground bg-muted border-r border-border">
            Time
          </div>
          {days?.map((day) => (
            <div
              key={day?.toISOString()}
              className="px-2 py-3 text-center border-r border-border bg-muted"
            >
              <div className="text-xs text-muted-foreground">
                {day?.toLocaleDateString('en-IN', { weekday: 'short' })}
              </div>
              <div
                className={`text-sm md:text-base font-semibold mt-1 ${
                  isToday(day) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {day?.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          {timeSlots?.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border">
              <div className="px-2 py-4 text-xs text-muted-foreground border-r border-border bg-muted/30">
                {convertTo12Hour(`${hour?.toString()?.padStart(2, '0')}:00`)}
              </div>
              {days?.map((day) => {
                const dayBookings = getBookingsForDate(day)?.filter(booking => {
                  const bookingHour = parseInt(booking?.time?.split(':')?.[0]);
                  return bookingHour === hour;
                });
                return (
                  <div
                    key={`${day?.toISOString()}-${hour}`}
                    className="px-2 py-4 border-r border-border hover:bg-muted/50 transition-colors duration-200 min-h-[60px]"
                  >
                    {dayBookings?.map((booking) => (
                      <div
                        key={booking?.id}
                        className={`text-xs px-2 py-1 rounded border cursor-pointer hover:opacity-80 transition-opacity mb-1 ${
                          shootTypeColors?.[booking?.shootType]
                        }`}
                        onClick={() => onBookingClick(booking)}
                      >
                        <div className="font-medium truncate">{booking?.clientName}</div>
                        <div className="text-[10px] opacity-80">{booking?.duration} min</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);
    const dayBookings = getBookingsForDate(currentDate);

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">
                {currentDate?.toLocaleDateString('en-IN', { weekday: 'long' })}
              </div>
              <div className="text-lg md:text-xl font-semibold text-foreground mt-1">
                {currentDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {dayBookings?.length} booking{dayBookings?.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          {timeSlots?.map((hour) => {
            const hourBookings = dayBookings?.filter(booking => {
              const bookingHour = parseInt(booking?.time?.split(':')?.[0]);
              return bookingHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-border hover:bg-muted/50 transition-colors duration-200">
                <div className="w-20 md:w-24 flex-shrink-0 px-3 py-4 text-xs md:text-sm text-muted-foreground border-r border-border bg-muted/30">
                  {hour?.toString()?.padStart(2, '0')}:00
                </div>
                <div className="flex-1 px-4 py-4 min-h-[80px]">
                  {hourBookings?.map((booking) => (
                    <div
                      key={booking?.id}
                      className={`px-4 py-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity mb-2 ${
                        shootTypeColors?.[booking?.shootType]
                      }`}
                      onClick={() => onBookingClick(booking)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-sm md:text-base mb-1">
                            {booking?.clientName}
                          </div>
                          <div className="text-xs opacity-80 mb-2">
                            {convertTo12Hour(booking?.time)} • {booking?.duration} minutes
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Icon name="Phone" size={12} />
                            <span>{booking?.phone}</span>
                          </div>
                          {booking?.notes && (
                            <div className="mt-2 text-xs opacity-80">
                              {booking?.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Edit" size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarGrid;