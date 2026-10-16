// Calendar color coding is driven by shoot status + payment, not shoot type.
// Keys are ordered by lifecycle: pending -> confirmed -> completed (unpaid) -> completed (paid).
export const BOOKING_STATUSES = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Awaiting confirmation',
    icon: 'Clock',
    dot: 'bg-amber-500',
    classes: 'bg-amber-500/20 border-amber-500 text-amber-400'
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    description: 'Shoot is locked in',
    icon: 'CalendarCheck',
    dot: 'bg-blue-500',
    classes: 'bg-blue-500/20 border-blue-500 text-blue-400'
  },
  {
    key: 'completed_unpaid',
    label: 'Completed · Payment Pending',
    description: 'Shot done, collect payment',
    icon: 'AlertCircle',
    dot: 'bg-rose-500',
    classes: 'bg-rose-500/20 border-rose-500 text-rose-400'
  },
  {
    key: 'completed_paid',
    label: 'Completed · Paid',
    description: 'Shot done, payment received',
    icon: 'CheckCircle2',
    dot: 'bg-emerald-500',
    classes: 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Shoot called off',
    icon: 'XCircle',
    dot: 'bg-slate-500',
    classes: 'bg-slate-500/20 border-slate-500 text-slate-400 line-through'
  }
];

const STATUS_BY_KEY = Object.fromEntries(BOOKING_STATUSES.map((s) => [s.key, s]));

export const isBookingPaid = (booking) =>
  Boolean(booking?.paymentStatus ?? booking?.paymentDone ?? booking?.payment_status);

export const getBookingStatusKey = (booking) => {
  const status = booking?.status || 'pending';
  if (status === 'completed') {
    return isBookingPaid(booking) ? 'completed_paid' : 'completed_unpaid';
  }
  return STATUS_BY_KEY[status] ? status : 'pending';
};

export const getBookingStatus = (booking) => STATUS_BY_KEY[getBookingStatusKey(booking)];
