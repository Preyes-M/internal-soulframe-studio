import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import BookingForm from './components/BookingForm';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import BookingDetailsModal from './components/BookingDetailsModal';
import ShootTypeLegend from './components/ShootTypeLegend';
import UpcomingBookings from './components/UpcomingBookings';
import { bookingsService } from '../../services/supabaseService';

const SmartCalendarScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsService?.getAll();
      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBooking = async (formData) => {
    try {
      let costRows = [];
      if (formData.costBreakdown?.length > 0) {
        costRows = formData.costBreakdown.map(c => ({
          cost_type: c.label,
          amount: c.cost,
          vendor_name: c.vendor
        }));
      }
      if (editingBooking) {
        console.log('Updating booking with data:', formData, 'and costs:', costRows);
        const updated = await bookingsService?.update(editingBooking?.id, formData, costRows);
        if (updated) {
          setBookings(bookings?.map(b => b?.id === updated?.id ? updated : b));
          setEditingBooking(null);
        }
      } else {
        const newBooking = await bookingsService?.create(formData, costRows);
        if (newBooking) {
          setBookings([...bookings, newBooking]);
        }
      }
    } catch (err) {
      console.error('Failed to save booking:', err);
      setError('Failed to save booking');
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate?.setMonth(currentDate?.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate?.setDate(currentDate?.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate?.setDate(currentDate?.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleEditBooking = (booking) => {
    console.log('Editing booking:', booking);
    setEditingBooking(booking);
    setSelectedBooking(null);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const success = await bookingsService?.delete(bookingId);
      if (success) {
        setBookings(bookings?.filter(b => b?.id !== bookingId));
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {error && (
          <div className="max-w-[1920px] mx-auto mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="max-w-[1920px] mx-auto">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={handleViewChange}
            onNavigate={handleNavigate}
            onToday={handleToday}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              <BookingForm
                onAddBooking={handleAddBooking}
                editingBooking={editingBooking}
                onCancelEdit={() => setEditingBooking(null)}
              />
              <ShootTypeLegend bookings={bookings} />
              <UpcomingBookings
                bookings={bookings}
                onBookingClick={handleBookingClick}
              />
            </div>

            <div className="lg:col-span-9">
              <CalendarGrid
                view={view}
                currentDate={currentDate}
                bookings={bookings}
                onBookingClick={handleBookingClick}
              />
            </div>
          </div>
        </div>

        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={handleCloseModal}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        )}
      </div>
    </Layout>
  );
};

export default SmartCalendarScheduler;