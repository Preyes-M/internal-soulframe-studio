import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { convertTo12Hour } from '../../../utils/timeFormat';
import { bookingsService } from '../../../services/supabaseService';
import { formatDate } from '../../../utils/timeFormat';

const BookingDetailsModal = ({ booking, onClose, onEdit, onDelete }) => {
  if (!booking) return null;
  const [bookingWithCosts, setBookingWithCosts] = useState(null);
  const shootTypeLabels = {
    modeling: 'Modeling',
    podcasting: 'Podcasting',
    maternity: 'Maternity',
    fashion: 'Fashion',
    baby: 'Baby',
    product: 'Product'
  };

  const shootTypeColors = {
    modeling: 'bg-blue-500/20 text-blue-400 border-blue-500',
    podcasting: 'bg-purple-500/20 text-purple-400 border-purple-500',
    maternity: 'bg-pink-500/20 text-pink-400 border-pink-500',
    fashion: 'bg-red-500/20 text-red-400 border-red-500',
    baby: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    product: 'bg-green-500/20 text-green-400 border-green-500'
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500'
  };

  useEffect(() => {
    async function fetchBookingCosts() {
      const costs = await bookingsService?.getCosts(booking?.id);
      if (!costs) {
        console.warn('Error fetching booking costs:', error);
      } else {
        const mappedCosts = (costs || []).map(c => ({
          id: c.id,                  // IMPORTANT for editing/deleting
          label: c.costType,
          cost: c.amount.toString(),
          vendor: c.vendorName || ''
        }));
        const bookingWithCosts = {
          ...booking,
          costBreakdown: mappedCosts
        };
        setBookingWithCosts(prev => ({
          booking: booking,
          costBreakdown: mappedCosts
        }));
        console.log('Fetched booking with costs:', bookingWithCosts);
      } 
    }
    fetchBookingCosts();
  }, [booking?.id]);


  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-lg border border-border shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-200"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {booking?.clientName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${shootTypeColors?.[booking?.shootType]}`}>
                  <Icon name="Camera" size={16} />
                  {shootTypeLabels?.[booking?.shootType]}
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${statusColors?.[booking?.status] || statusColors?.pending}`}>
                  <Icon name="Info" size={16} />
                  {statusLabels?.[booking?.status] || 'Pending'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                <Icon name="Calendar" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Date</div>
                <div className="text-sm font-medium text-foreground">
                  {formatDate(booking?.date)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/20">
                <Icon name="Clock" size={20} color="var(--color-secondary)" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Time</div>
                <div className="text-sm font-medium text-foreground">
                  {convertTo12Hour(booking?.time)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
                <Icon name="Timer" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                <div className="text-sm font-medium text-foreground">
                  {booking?.duration} minutes
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/20">
                <Icon name="Phone" size={20} color="var(--color-success)" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Phone</div>
                <div className="text-sm font-medium text-foreground">
                  {booking?.phone}
                </div>
              </div>
            </div>

            {booking?.price && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20">
                  <Icon name="DollarSign" size={20} color="#10b981" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Price</div>
                  <div className="text-sm font-medium text-foreground">
                    ₹{parseFloat(booking?.price)?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                <Icon name="CreditCard" size={20} color="#3b82f6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Deposit Status</div>
                <div className="text-sm font-medium text-foreground">
                  {booking?.depositPaid || booking?.deposit_paid ? 'Paid' : 'Not Paid'}
                </div>
              </div>
            </div>
          </div>

          {booking?.notes && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="FileText" size={20} className="text-muted-foreground mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-2">Notes</div>
                  <div className="text-sm text-foreground leading-relaxed">
                    {booking?.notes}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="Edit"
              iconPosition="left"
              onClick={() => {
                onEdit(bookingWithCosts || booking);
              }}
            >
              Edit Booking
            </Button>
            <Button
              variant="destructive"
              fullWidth
              iconName="Trash2"
              iconPosition="left"
              onClick={() => {
                onDelete(booking?.id);
                onClose();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;