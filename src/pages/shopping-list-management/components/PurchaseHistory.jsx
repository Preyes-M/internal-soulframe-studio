import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatDate } from '../../../utils/timeFormat';

const PurchaseHistory = ({ items }) => {
  const recentPurchases = items?.filter(item => item?.status === 'received')?.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))?.slice(0, 5);

  if (recentPurchases?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
            <Icon name="History" size={20} className="text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Purchase History</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="ShoppingBag" size={48} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No purchases recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
          <Icon name="History" size={20} className="text-primary" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Recent Purchases</h2>
      </div>
      <div className="space-y-3">
        {recentPurchases?.map((item) => (
          <div
            key={item?.id}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-success/20 flex-shrink-0">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">{item?.name}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Package" size={12} />
                  Qty: {item?.quantity}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="IndianRupee" size={12} />
                  ₹{(item?.estimatedPrice * item?.quantity)?.toLocaleString('en-IN')}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  {formatDate(item?.addedDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;