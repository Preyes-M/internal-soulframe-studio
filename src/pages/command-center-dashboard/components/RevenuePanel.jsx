import React from 'react';
import Icon from '../../../components/AppIcon';
import {  formatCurrency } from '../../../utils/currencyUtils';


const RevenuePanel = ({ revenueData, onExpand }) => {

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 70) return 'bg-primary';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const monthlyProgress = calculateProgress(
    revenueData?.monthlyRevenue,
    revenueData?.monthlyTarget
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/20">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">Revenue Tracker</h2>
            <p className="text-xs md:text-sm text-muted-foreground">{new Date()?.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <button
          onClick={onExpand}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-200"
          aria-label="Expand panel"
        >
          <Icon name="Maximize2" size={18} />
        </button>
      </div>
      <div className="flex-1 space-y-4 md:space-y-6">
        <div className="bg-background border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-xs md:text-sm text-muted-foreground">Monthly Target</span>
            <span className="text-xs md:text-sm font-medium text-foreground">
              {Math.round(monthlyProgress)}%
            </span>
          </div>
          <div className="w-full h-2 md:h-3 bg-muted rounded-full overflow-hidden mb-3 md:mb-4">
            <div
              className={`h-full ${getProgressColor(monthlyProgress)} transition-all duration-500`}
              style={{ width: `${monthlyProgress}%` }}
            />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {formatCurrency(revenueData?.monthlyRevenue)}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                of {formatCurrency(revenueData?.monthlyTarget)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-muted-foreground">Remaining</p>
              <p className="text-sm md:text-base font-semibold text-warning">
                {formatCurrency(revenueData?.monthlyTarget - revenueData?.monthlyRevenue)}
              </p>
            </div>
          </div>
        </div>

        {revenueData?.potentialRevenue > 0 && (
          <div className="bg-background border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-xs md:text-sm text-muted-foreground">Potential Revenue</span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
              {formatCurrency(revenueData?.potentialRevenue)}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              From {revenueData?.upcomingShootsCount} upcoming bookings
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-background border border-border rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-xs md:text-sm text-muted-foreground">Shoots Completed</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {revenueData?.shootsCompleted}
            </p>
            <p className="text-xs text-success mt-1">+{revenueData?.shootsThisWeek} this week</p>
          </div>

          <div className="bg-background border border-border rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-xs md:text-sm text-muted-foreground">Upcoming Shoots</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {revenueData?.upcomingShootsCount}
            </p>
            <p className="text-xs text-primary mt-1">Next 7 days</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-3 md:p-4">
          <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3">
            Revenue by Shoot Type
          </h3>
          {revenueData?.revenueByType?.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {revenueData?.revenueByType?.map((type) => (
                <div key={type?.shoot_type}>
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="text-xs md:text-sm text-muted-foreground">{type?.shoot_type}</span>
                    <span className="text-xs md:text-sm font-medium text-foreground">
                      {formatCurrency(type?.revenue)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${(type?.revenue / revenueData?.monthlyRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No revenue data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenuePanel;