import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TaskCard = ({ task, onDragStart, onDragEnd, onClick }) => {
  const categoryColors = {
    'Marketing/Content': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Purchasing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Editing': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Meetings': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const priorityConfig = {
    high: { color: 'text-red-500', icon: 'AlertCircle', bg: 'bg-red-500/10' },
    medium: { color: 'text-yellow-500', icon: 'AlertTriangle', bg: 'bg-yellow-500/10' },
    low: { color: 'text-gray-500', icon: 'Minus', bg: 'bg-gray-500/10' }
  };

  const priority = priorityConfig?.[task?.priority];
  const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && task?.status !== 'done';
  const primaryAssigneeName = task?.assignees && task?.assignees[0]?.name ? task.assignees[0].name.split(' ')[0] : '';

  return (
    <div
      draggable
      onClick={() => onClick?.(task)}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className="bg-card border border-border rounded-lg p-4 mb-3 cursor-move hover:border-primary/50 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground flex-1 pr-2 line-clamp-2">
          {task?.title}
        </h4>
        <div className={`flex items-center justify-center w-6 h-6 rounded ${priority?.bg}`}>
          <Icon name={priority?.icon} size={14} className={priority?.color} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${categoryColors?.[task?.category]}`}>
          {task?.category}
        </span>
        {task?.linkedToCalendar && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
            <Icon name="Calendar" size={12} />
            Linked
          </span>
        )}
      </div>
      {task?.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task?.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2">
          {task?.assignees?.map((assignee, index) => (
            <div
              key={index}
              className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-background"
              style={{ marginLeft: index > 0 ? '-8px' : '0' }}
            >
              <Image
                src={assignee?.avatar}
                alt={assignee?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-end pr-2">
          {primaryAssigneeName && (
            <span className="text-sm font-medium text-foreground mr-2">{primaryAssigneeName}</span>
          )}
        </div>

        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-error' : 'text-muted-foreground'}`}>
          <Icon name={isOverdue ? 'AlertCircle' : 'Clock'} size={12} />
          <span>{task?.dueDate ? new Date(task.dueDate)?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</span>
        </div>
      </div>
      {task?.subtasks && task?.subtasks?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Subtasks</span>
            <span className="text-foreground font-medium">
              {task?.subtasks?.filter(st => st?.completed)?.length}/{task?.subtasks?.length}
            </span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${(task?.subtasks?.filter(st => st?.completed)?.length / task?.subtasks?.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;