/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format (h:MM AM/PM)
 */
export const convertTo12Hour = (time24) => {
  if (!time24) return '';

  const [hours, minutes] = time24?.split(':');
  const hour = parseInt(hours, 10);
  const minute = minutes || '00';

  if (hour === 0) {
    return `12:${minute} AM`;
  } else if (hour < 12) {
    return `${hour}:${minute} AM`;
  } else if (hour === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hour - 12}:${minute} PM`;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date?.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
