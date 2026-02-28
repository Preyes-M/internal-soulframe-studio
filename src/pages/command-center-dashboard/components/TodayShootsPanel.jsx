import React from 'react';
import Icon from '../../../components/AppIcon';
import { shootTypeColors } from '../../../utils/Constants';

const TodayShootsPanel = ({ shoots, onExpand }) => {

  const getTimeStatus = (time) => {
    const now = new Date();
    const shootTime = new Date(`2026-01-12 ${time}`);
    const diffMinutes = (shootTime - now) / (1000 * 60);

    if (diffMinutes < 0) return { status: 'completed', label: 'Completed', color: 'text-green-400' };
    if (diffMinutes < 30) return { status: 'urgent', label: 'Starting Soon', color: 'text-red-400' };
    if (diffMinutes < 120) return { status: 'upcoming', label: 'Upcoming', color: 'text-yellow-400' };
    return { status: 'scheduled', label: 'Scheduled', color: 'text-blue-400' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20">
            <Icon name="Camera" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">Today's Shoots</h2>
            <p className="text-xs md:text-sm text-muted-foreground">{shoots?.length} scheduled</p>
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
      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4">
        {shoots?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <Icon name="Calendar" size={40} className="text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No shoots scheduled today</p>
          </div>
        ) : (
          shoots?.map((shoot) => {
            const timeStatus = getTimeStatus(shoot?.time);
            return (
              <div
                key={shoot?.id}
                className="bg-background border border-border rounded-lg p-3 md:p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2 md:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium text-foreground truncate">
                      {shoot?.clientName}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      {shoot?.time} • {shoot?.duration}
                    </p>
                  </div>
                  <span
                    className={`px-2 md:px-3 py-1 text-xs font-medium rounded-full border ${
                      shootTypeColors?.[shoot?.type]
                    }`}
                  >
                    {shoot?.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-xs md:text-sm text-muted-foreground">{shoot?.location}</span>
                  </div>
                  <span className={`text-xs font-medium ${timeStatus?.color}`}>
                    {timeStatus?.label}
                  </span>
                </div>
                {shoot?.notes && (
                  <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground line-clamp-2">{shoot?.notes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayShootsPanel;