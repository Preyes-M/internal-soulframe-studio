import React from 'react';
import Icon from '../../../components/AppIcon';

const UrgentTasksPanel = ({ tasks, onStatusUpdate, onExpand }) => {
  const priorityColors = {
    high: 'text-red-400 bg-red-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    low: 'text-blue-400 bg-blue-500/20',
  };

  const categoryIcons = {
    'Marketing/Content': 'Megaphone',
    Purchasing: 'ShoppingBag',
    Editing: 'Film',
    Meetings: 'Users',
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = (deadlineDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) return { label: 'Overdue', color: 'text-red-400' };
    if (diffHours < 3) return { label: `${Math.floor(diffHours)}h left`, color: 'text-red-400' };
    if (diffHours < 24) return { label: `${Math.floor(diffHours)}h left`, color: 'text-yellow-400' };
    return { label: 'On track', color: 'text-green-400' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/20">
            <Icon name="AlertCircle" size={20} className="text-warning" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">Urgent Tasks</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Top 3 priorities</p>
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
        {tasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <Icon name="CheckCircle" size={40} className="text-green-400 mb-3" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          tasks?.map((task, index) => {
            const deadlineStatus = getDeadlineStatus(task?.deadline);
            return (
              <div
                key={task?.id}
                className="bg-background border border-border rounded-lg p-3 md:p-4 hover:border-warning/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-warning/20 text-warning font-semibold text-xs md:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                        {task?.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          priorityColors?.[task?.priority]
                        } flex-shrink-0`}
                      >
                        {task?.priority?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="flex items-center gap-1">
                        <Icon
                          name={categoryIcons?.[task?.category]}
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="text-xs text-muted-foreground">{task?.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className={`text-xs font-medium ${deadlineStatus?.color}`}>
                          {deadlineStatus?.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStatusUpdate(task?.id, 'in-progress')}
                        className="flex-1 px-3 py-1.5 md:py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded text-xs md:text-sm font-medium transition-colors duration-200"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => onStatusUpdate(task?.id, 'done')}
                        className="flex-1 px-3 py-1.5 md:py-2 bg-success/10 hover:bg-success/20 text-success rounded text-xs md:text-sm font-medium transition-colors duration-200"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UrgentTasksPanel;