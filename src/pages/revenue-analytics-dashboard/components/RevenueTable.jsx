import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/timeFormat';

const RevenueTable = ({ transactions }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc' 
        ? a?.amount - b?.amount
        : b?.amount - a?.amount;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions?.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getShootTypeColor = (type) => {
    const colors = {
      'Modeling': 'bg-primary/10 text-primary',
      'Podcasting': 'bg-secondary/10 text-secondary',
      'Maternity': 'bg-pink-500/10 text-pink-500',
      'Fashion': 'bg-error/10 text-error',
      'Baby': 'bg-success/10 text-success',
      'Product': 'bg-warning/10 text-warning'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <Button variant="outline" iconName="Download" iconPosition="left" size="sm">
            Export Report
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <button 
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <Icon 
                    name={sortConfig?.key === 'date' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Client
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Shoot Type
              </th>
              <th className="px-4 md:px-6 py-3 text-right">
                <button 
                  className="flex items-center gap-2 ml-auto text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  <Icon 
                    name={sortConfig?.key === 'amount' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-right">
                <button 
                  className="flex items-center gap-2 ml-auto text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleSort('netRevenue')}
                >
                  Net Revenue
                  <Icon 
                    name={sortConfig?.key === 'netRevenue' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                Profit Margin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-sm text-foreground whitespace-nowrap">
                  {formatDate(transaction?.date)}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-foreground">
                  {transaction?.bookingName}
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getShootTypeColor(transaction?.shootType)}`}>
                    {transaction?.shootType}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm font-semibold text-foreground text-right whitespace-nowrap">
                  ₹{transaction?.amount?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm font-semibold text-foreground text-right whitespace-nowrap">
                  ₹{transaction?.netRevenue?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-foreground text-right">
                  <span className={transaction?.profitMargin >= 30 ? 'text-success' : transaction?.profitMargin >= 20 ? 'text-warning' : 'text-error'}>
                    {transaction?.profitMargin}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 md:p-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions?.length)} of {sortedTransactions?.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)]?.map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  currentPage === index + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevenueTable;