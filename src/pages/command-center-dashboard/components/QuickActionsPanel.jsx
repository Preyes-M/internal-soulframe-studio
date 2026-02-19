import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActionsPanel = ({ onExpand }) => {
  const [activeTab, setActiveTab] = useState('booking');
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    phone: '',
    shootType: '',
    date: '',
    time: '',
    duration: '',
    notes: '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: '',
    priority: '',
    deadline: '',
    assignee: '',
  });

  const shootTypeOptions = [
    { value: 'Modeling', label: 'Modeling' },
    { value: 'Podcasting', label: 'Podcasting' },
    { value: 'Maternity', label: 'Maternity' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Baby', label: 'Baby' },
    { value: 'Product', label: 'Product' },
  ];

  const durationOptions = [
    { value: '1h', label: '1 hour' },
    { value: '2h', label: '2 hours' },
    { value: '3h', label: '3 hours' },
    { value: '4h', label: '4 hours' },
    { value: 'full-day', label: 'Full Day' },
  ];

  const categoryOptions = [
    { value: 'Marketing/Content', label: 'Marketing/Content' },
    { value: 'Purchasing', label: 'Purchasing' },
    { value: 'Editing', label: 'Editing' },
    { value: 'Meetings', label: 'Meetings' },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const handleBookingSubmit = (e) => {
    e?.preventDefault();
    console.log('Emergency booking created:', bookingForm);
    setBookingForm({
      clientName: '',
      phone: '',
      shootType: '',
      date: '',
      time: '',
      duration: '',
      notes: '',
    });
  };

  const handleTaskSubmit = (e) => {
    e?.preventDefault();
    console.log('Quick task created:', taskForm);
    setTaskForm({
      title: '',
      category: '',
      priority: '',
      deadline: '',
      assignee: '',
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/20">
            <Icon name="Zap" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Fast entry forms</p>
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
      <div className="flex gap-2 mb-4 md:mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('booking')}
          className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'booking' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Calendar" size={16} className="inline mr-2" />
          Booking
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'task' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="CheckSquare" size={16} className="inline mr-2" />
          Task
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'booking' ? (
          <form onSubmit={handleBookingSubmit} className="space-y-3 md:space-y-4">
            <Input
              label="Client Name"
              type="text"
              placeholder="Enter client name"
              value={bookingForm?.clientName}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, clientName: e?.target?.value })
              }
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={bookingForm?.phone}
              onChange={(e) => setBookingForm({ ...bookingForm, phone: e?.target?.value })}
              required
            />

            <Select
              label="Shoot Type"
              placeholder="Select shoot type"
              options={shootTypeOptions}
              value={bookingForm?.shootType}
              onChange={(value) => setBookingForm({ ...bookingForm, shootType: value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Input
                label="Date"
                type="date"
                value={bookingForm?.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e?.target?.value })}
                required
              />

              <Input
                label="Time"
                type="time"
                value={bookingForm?.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e?.target?.value })}
                required
              />
            </div>

            <Select
              label="Duration"
              placeholder="Select duration"
              options={durationOptions}
              value={bookingForm?.duration}
              onChange={(value) => setBookingForm({ ...bookingForm, duration: value })}
              required
            />

            <Input
              label="Notes"
              type="text"
              placeholder="Additional notes (optional)"
              value={bookingForm?.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e?.target?.value })}
            />

            <Button type="submit" variant="default" fullWidth iconName="Plus" iconPosition="left">
              Create Emergency Booking
            </Button>
          </form>
        ) : (
          <form onSubmit={handleTaskSubmit} className="space-y-3 md:space-y-4">
            <Input
              label="Task Title"
              type="text"
              placeholder="Enter task title"
              value={taskForm?.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e?.target?.value })}
              required
            />

            <Select
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={taskForm?.category}
              onChange={(value) => setTaskForm({ ...taskForm, category: value })}
              required
            />

            <Select
              label="Priority"
              placeholder="Select priority"
              options={priorityOptions}
              value={taskForm?.priority}
              onChange={(value) => setTaskForm({ ...taskForm, priority: value })}
              required
            />

            <Input
              label="Deadline"
              type="datetime-local"
              value={taskForm?.deadline}
              onChange={(e) => setTaskForm({ ...taskForm, deadline: e?.target?.value })}
              required
            />

            <Input
              label="Assignee"
              type="text"
              placeholder="Assign to team member"
              value={taskForm?.assignee}
              onChange={(e) => setTaskForm({ ...taskForm, assignee: e?.target?.value })}
            />

            <Button type="submit" variant="default" fullWidth iconName="Plus" iconPosition="left">
              Create Quick Task
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuickActionsPanel;