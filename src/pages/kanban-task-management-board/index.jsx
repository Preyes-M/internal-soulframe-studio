import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../../components/Layout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KanbanColumn from './components/KanbanColumn';
import TaskFilters from './components/TaskFilters';
import QuickAddTaskModal from './components/QuickAddTaskModal';
import BulkActionsBar from './components/BulkActionsBar';
import SavedViewsDropdown from './components/SavedViewsDropdown';
import { tasksService } from '../../services/supabaseService';

const KanbanTaskManagementBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns] = useState([
    { id: 'todo', name: 'To Do', wipLimit: 5 },
    { id: 'in_progress', name: 'In Progress', wipLimit: 3 },
    { id: 'waiting', name: 'Waiting', wipLimit: null },
    { id: 'done', name: 'Done', wipLimit: null }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priorities: [],
    assignees: []
  });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentView, setCurrentView] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService?.getAll();
      setTasks(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (e, newStatus) => {
    e?.preventDefault();
    try {
      if (draggedTask && draggedTask?.status !== newStatus) {
        const updated = await tasksService?.update(draggedTask?.id, { status: newStatus });
        if (updated) {
          setTasks(tasks?.map(t => t?.id === updated?.id ? updated : t));
        }
        // setTasks(tasks?.map((task) =>
        // task?.id === draggedTask?.id ?
        // { ...task, status: newStatus } :
        // task
        // ));
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await tasksService?.create(taskData);
      if (newTask) {
        setTasks([...tasks, newTask]);
        setIsQuickAddOpen(false);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updated = await tasksService?.update(taskId, updates);
      if (updated) {
        setTasks(tasks?.map(t => t?.id === updated?.id ? updated : t));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const success = await tasksService?.delete(taskId);
      if (success) {
        setTasks(tasks?.filter(t => t?.id !== taskId));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const handleBulkAction = (actionType, value) => {
    if (selectedTasks?.length === 0) return;

    setTasks(tasks?.map((task) => {
      if (selectedTasks?.includes(task?.id)) {
        if (actionType === 'status') {
          return { ...task, status: value };
        } else if (actionType === 'assignee') {
          return {
            ...task,
            assignees: [
              {
                name: value,
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                avatarAlt: `Professional headshot of ${value}`
              }]

          };
        } else if (actionType === 'priority') {
          return { ...task, priority: value };
        }
      }
      return task;
    }));

    setSelectedTasks([]);
  };

  const getFilteredTasks = () => {
    return tasks?.filter((task) => {
      const matchesSearch = task?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        task?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());

      const matchesCategory = activeFilters?.categories?.length === 0 ||
        activeFilters?.categories?.includes(task?.category);

      const matchesPriority = activeFilters?.priorities?.length === 0 ||
        activeFilters?.priorities?.includes(task?.priority);

      const matchesAssignee = activeFilters?.assignees?.length === 0 ||
        task?.assignees?.some((a) => activeFilters?.assignees?.includes(a?.name));

      return matchesSearch && matchesCategory && matchesPriority && matchesAssignee;
    });
  };

  const filteredTasks = getFilteredTasks();

  const getTaskStats = () => {
    return {
      total: filteredTasks?.length,
      todo: filteredTasks?.filter((t) => t?.status === 'todo')?.length,
      inProgress: filteredTasks?.filter((t) => t?.status === 'in_progress')?.length,
      waiting: filteredTasks?.filter((t) => t?.status === 'waiting')?.length,
      done: filteredTasks?.filter((t) => t?.status === 'done')?.length,
      overdue: filteredTasks?.filter((t) => t?.dueDate && new Date(t.dueDate) < new Date() && t?.status !== 'done')?.length
    };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Task Board - Soul Frame Studio Bangalore</title>
        <meta name="description" content="Visual task management board for studio workflow coordination with drag-and-drop functionality" />
      </Helmet>
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                  Task Board
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Manage studio workflow with visual task tracking
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SavedViewsDropdown
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  onSaveView={(name) => console.log('Save view:', name)} />

                <Button
                  variant="outline"
                  iconName="Filter"
                  iconPosition="left"
                  onClick={() => setShowFilters(!showFilters)}>

                  Filters
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => { setEditingTask(null); setIsQuickAddOpen(true); }}>

                  Add Task
                  <kbd className="hidden lg:inline-flex ml-2 px-2 py-1 text-xs font-mono bg-primary-foreground/20 rounded">
                    N
                  </kbd>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Total Tasks</span>
                  <Icon name="LayoutGrid" size={16} className="text-primary" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">{stats?.total}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">To Do</span>
                  <Icon name="Circle" size={16} className="text-slate-400" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">{stats?.todo}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">In Progress</span>
                  <Icon name="CircleDashed" size={16} className="text-blue-400" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">{stats?.inProgress}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Waiting</span>
                  <Icon name="Clock" size={16} className="text-yellow-400" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">{stats?.waiting}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Done</span>
                  <Icon name="CheckCircle2" size={16} className="text-green-400" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground">{stats?.done}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Overdue</span>
                  <Icon name="AlertCircle" size={16} className="text-error" />
                </div>
                <p className="text-xl md:text-2xl font-semibold text-error">{stats?.overdue}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

              </div>
            </div>

            {showFilters &&
              <TaskFilters
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                onClearFilters={() => setActiveFilters({ categories: [], priorities: [], assignees: [] })} />

            }
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-400px)] min-h-[600px]">
            {columns?.map((column) =>
              <KanbanColumn
                key={column?.id}
                column={column}
                tasks={filteredTasks?.filter((task) => task?.status === column?.id)}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                wipLimit={column?.wipLimit}
                onTaskClick={(task) => { setEditingTask(task); setIsQuickAddOpen(true); }} />

            )}
          </div>

          <QuickAddTaskModal
            isOpen={isQuickAddOpen}
            task={editingTask}
            onClose={() => { setIsQuickAddOpen(false); setEditingTask(null); }}
            onAddTask={handleAddTask}
            onUpdate={async (taskId, updates) => {
              await handleUpdateTask(taskId, updates);
              setIsQuickAddOpen(false);
              setEditingTask(null);
            }} />


          <BulkActionsBar
            selectedCount={selectedTasks?.length}
            onClearSelection={() => setSelectedTasks([])}
            onBulkAction={handleBulkAction} />

        </div>
      </Layout>
    </>);

};

export default KanbanTaskManagementBoard;