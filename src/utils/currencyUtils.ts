
export const formatCurrency = (value?: number | null) =>
  `₹${(value ?? 0).toLocaleString('en-IN')}`;

export const formatPercentage = (value?: number | null) =>
  value === null ? '0%' : `${value > 0 ? '+' : ''}${value}%`;

export const getChangeType = (value?: number | null) => {
  if (!value) return 'neutral';
  if (value > 0) return 'positive';
  return 'negative';
};