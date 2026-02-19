import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusBar = ({ syncStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'synced':
        return 'text-success bg-success/20';
      case 'syncing':
        return 'text-warning bg-warning/20';
      case 'error':
        return 'text-error bg-error/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'synced':
        return 'CheckCircle';
      case 'syncing':
        return 'RefreshCw';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Icon name="Activity" size={18} className="text-primary" />
          <span className="text-xs md:text-sm font-medium text-foreground">System Status</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {Object.entries(syncStatus)?.map(([system, status]) => (
            <div
              key={system}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-background border border-border"
            >
              <Icon
                name={getStatusIcon(status)}
                size={14}
                className={`${getStatusColor(status)} ${
                  status === 'syncing' ? 'animate-spin' : ''
                }`}
              />
              <span className="text-xs text-muted-foreground capitalize">{system}</span>
              <span className={`text-xs font-medium ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last updated:</span>
          <span className="text-xs font-medium text-foreground">
            {new Date()?.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusBar;