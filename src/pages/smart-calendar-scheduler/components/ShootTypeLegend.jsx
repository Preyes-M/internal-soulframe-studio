import React from 'react';
import Icon from '../../../components/AppIcon';

const ShootTypeLegend = ({ bookings }) => {
  const shootTypes = [
    { value: 'modeling', label: 'Modeling', color: 'bg-blue-500', icon: 'User' },
    { value: 'podcasting', label: 'Podcasting', color: 'bg-purple-500', icon: 'Mic' },
    { value: 'maternity', label: 'Maternity', color: 'bg-pink-500', icon: 'Heart' },
    { value: 'fashion', label: 'Fashion', color: 'bg-red-500', icon: 'Sparkles' },
    { value: 'baby', label: 'Baby', color: 'bg-yellow-500', icon: 'Baby' },
    { value: 'product', label: 'Product', color: 'bg-green-500', icon: 'Package' }
  ];

  const getCountByType = (type) => {
    return bookings?.filter(booking => booking?.shootType === type)?.length;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
          <Icon name="Palette" size={20} color="var(--color-accent)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Shoot Types</h3>
      </div>
      <div className="space-y-3">
        {shootTypes?.map((type) => {
          const count = getCountByType(type?.value);
          return (
            <div
              key={type?.value}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${type?.color}`} />
                <div className="flex items-center gap-2">
                  <Icon name={type?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{type?.label}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Bookings</span>
          <span className="text-lg font-bold text-primary">{bookings?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ShootTypeLegend;