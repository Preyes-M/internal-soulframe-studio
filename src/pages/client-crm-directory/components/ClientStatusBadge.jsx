import React from 'react';

const ClientStatusBadge = ({ status }) => {
  const statusConfig = {
    Lead: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
    },
    Booked: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    'Shoot Done': {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
    },
    Editing: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
    },
    Delivered: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
    },
  };

  const config = statusConfig?.[status] || statusConfig?.Lead;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${config?.bg} ${config?.text} ${config?.border}`}
    >
      {status}
    </span>
  );
};

export default ClientStatusBadge;