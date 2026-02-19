import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { lookupService } from '../../../services/supabaseService';
import { Constants } from '../../../types/supabase';
import { humanize } from '../../../utils/text';

  const QuickAddTaskModal = ({ isOpen, onClose, onAddTask, task, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    status: '',
    assignee: '',
    dueDate: '',
    description: ''
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [assigneesLoading, setAssigneesLoading] = useState(false);

  const isEditing = !!task?.id;

  const categoryOptions = [
    { value: 'Marketing/Content', label: 'Marketing/Content' },
    { value: 'Purchasing', label: 'Purchasing' },
    { value: 'Editing', label: 'Editing' },
    { value: 'Meetings', label: 'Meetings' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const [assigneeOptions, setAssigneeOptions] = useState([
    { value: 'Rishabh Daga', label: 'Rishabh Daga' }]);
    

  const fetchAssignees = async () => {
    setAssigneesLoading(true);
    try {
      const data = await lookupService.getAssignees();
      const unique = [];
      const seen = new Set();
      (data || []).forEach(a => {
        if (a?.name && !seen.has(a.name)) {
          seen.add(a.name);
          unique.push({ value: a.id, label: a.name, avatar: a.avatar, avatarAlt: a.avatarAlt });
        }
      });

      if (unique.length > 0) setAssigneeOptions(unique);
    } catch (err) {
      console.error('Error fetching assignees:', err);
    } finally {
      setAssigneesLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssignees();

      // fetch task status enums
      const fetchStatuses = async () => {
        setStatusLoading(true);
        try {
          const statusData = await lookupService.getEnumValues('task_status');
          const opts = (statusData || []).map((v) => ({ value: v, label: humanize(v) }));
          if (opts?.length) {
            setStatusOptions(opts);
            if (!formData?.status) setFormData((f) => ({ ...f, status: opts[0].value }));
          } else {
            const fallback = (Constants?.public?.Enums?.task_status || []).map((v) => ({ value: v, label: humanize(v) }));
            setStatusOptions(fallback);
            if (!formData?.status && fallback?.length) setFormData((f) => ({ ...f, status: fallback[0].value }));
          }
        } catch (err) {
          console.error('Failed to fetch task status enums:', err);
          const fallback = (Constants?.public?.Enums?.task_status || []).map((v) => ({ value: v, label: humanize(v) }));
          setStatusOptions(fallback);
          if (!formData?.status && fallback?.length) setFormData((f) => ({ ...f, status: fallback[0].value }));
        } finally {
          setStatusLoading(false);
        }
      };

      fetchStatuses();
    }

    // pre-fill when editing
    if (isOpen && task) {
      setFormData({
        title: task?.title || '',
        category: task?.category || '',
        priority: task?.priority || 'medium',
        status: task?.status || '',
        assignee: task?.assignees && task?.assignees[0] ? (task?.assignees[0]?.assigneeId || task?.assignees[0]?.id || '') : '',
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : '',
        description: task?.description || ''
      });
    }

    if (!isOpen) {
      // clear form when modal closed
      setFormData({ title: '', category: '', priority: 'medium', status: '', assignee: '', dueDate: '', description: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (formData?.title && formData?.category && formData?.assignee && formData?.dueDate) {
      const payload = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        dueDate: formData.dueDate,
        assignees: [ { assigneeId: formData.assignee } ]
      };

      if (isEditing) {
        try {
          await onUpdate?.(task?.id, payload);
        } catch (err) {
          console.error('Failed to update task from modal:', err);
        }
      } else {
        onAddTask(payload);
      }

      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        description: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Plus" size={20} />
            Quick Add Task
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Task Title"
            type="text"
            placeholder="Enter task title"
            required
            value={formData?.title}
            onChange={(e) => setFormData({ ...formData, title: e?.target?.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              placeholder="Select category"
              required
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
            />

            <Select
              label="Priority"
              required
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
            />

            <Select
              label="Status"
              required
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              loading={statusLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Assignee"
              placeholder="Select assignee"
              required
              options={assigneeOptions}
              value={formData?.assignee}
              onChange={(value) => setFormData({ ...formData, assignee: value })}
              loading={assigneesLoading}
            />

            <Input
              label="Due Date"
              type="date"
              required
              value={formData?.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e?.target?.value })}
            />
          </div>

          <Input
            label="Description"
            type="text"
            placeholder="Add task description (optional)"
            value={formData?.description}
            onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="default" type="submit" iconName="Plus" iconPosition="left">
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddTaskModal;