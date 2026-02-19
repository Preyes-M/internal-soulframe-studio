import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks, onDrop, onDragStart, onDragEnd, wipLimit, onTaskClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnColors = {
    'To Do': 'text-slate-400',
    'In Progress': 'text-blue-400',
    'Waiting': 'text-yellow-400',
    'Done': 'text-green-400'
  };

  const columnIcons = {
    'To Do': 'Circle',
    'In Progress': 'CircleDashed',
    'Waiting': 'Clock',
    'Done': 'CheckCircle2'
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    onDrop(e, column?.id);
  };

  const isOverLimit = wipLimit && tasks?.length > wipLimit;

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name={columnIcons?.[column?.name]} size={18} className={columnColors?.[column?.name]} />
          <h3 className="text-sm font-semibold text-foreground">{column?.name}</h3>
          <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium ${
            isOverLimit ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'
          }`}>
            {tasks?.length}
          </span>
        </div>
        {wipLimit && (
          <span className="text-xs text-muted-foreground">
            Limit: {wipLimit}
          </span>
        )}
      </div>
      <div
        className={`flex-1 p-3 overflow-y-auto transition-colors duration-200 ${
          isDragOver ? 'bg-primary/10' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="Inbox" size={32} className="text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks?.map((task) => (
            <TaskCard
              key={task?.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
      {isOverLimit && (
        <div className="px-4 py-2 bg-error/10 border-t border-error/30">
          <p className="text-xs text-error flex items-center gap-1">
            <Icon name="AlertTriangle" size={12} />
            WIP limit exceeded
          </p>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;