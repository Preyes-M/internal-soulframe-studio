import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabase';
import TodayShootsPanel from './components/TodayShootsPanel';
import UrgentTasksPanel from './components/UrgentTasksPanel';
import RevenuePanel from './components/RevenuePanel';
import QuickActionsPanel from './components/QuickActionsPanel';
import SystemStatusBar from './components/SystemStatusBar';
import { bookingsService, tasksService, getUserId } from '../../services/supabaseService';

const CommandCenterDashboard = () => {
  const [todayShoots, setTodayShoots] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);

  const [revenueData, setRevenueData] = useState({
    monthlyRevenue: 0,
    monthlyTarget: 400000,
    shootsCompleted: 0,
    shootsThisWeek: 0,
    upcomingShootsCount: 0,
    potentialRevenue: 0,
    revenueByType: [],
  });

  const [syncStatus, setSyncStatus] = useState({
    calendar: 'synced',
    crm: 'synced',
    inventory: 'synced',
    tasks: 'synced',
  });

  const [expandedPanel, setExpandedPanel] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      fetchTodayShoots();
      fetchUrgentTasks();
      fetchRevenueData();

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const fetchTodayShoots = async () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const todayBookings = await bookingsService?.getDayBookings(dateString);
    if (todayBookings) {
      const mappedTodayShoots = todayBookings.map(booking => ({
        id: booking?.id,
        clientName: booking?.client_name || booking?.clientName,
        type: booking?.shoot_type || booking?.shootType,
        time: booking?.time,
        duration: `${booking?.duration || 0} minutes`,
        location: booking?.location || 'Studio',
        notes: booking?.notes || '',
      }));
      setTodayShoots(mappedTodayShoots);
    }
  };

  const fetchUrgentTasks = async () => {
    const tasks = await tasksService?.getUrgentTasks();
    if (tasks) {
      const mappedTasks = tasks.map(task => ({
        id: task?.id,
        title: task?.title,
        category: task?.category,
        priority: task?.priority,
        deadline: task?.dueDate,
      }));
      setUrgentTasks(mappedTasks);
    }
  };

  const fetchRevenueData = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase.rpc('get_revenue_dashboard', {
      p_user_id: userId
    });
        console.log(data, error);

    if (error) {
      console.error('Error fetching revenue data:', error);
      return;
    }

    setRevenueData({
      monthlyRevenue: data?.[0]?.monthly_revenue || 0,
      monthlyTarget: 400000,
      shootsCompleted: data?.[0]?.shoots_completed || 0,
      shootsThisWeek: data?.[0]?.shoots_this_week || 0,
      upcomingShootsCount: data?.[0]?.upcoming_shoots_count || 0,
      potentialRevenue: data?.[0]?.potential_revenue || 0,
      revenueByType: data?.[0]?.revenue_by_type || [],
    });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key >= '1' && e?.key <= '4') {
        const panels = ['shoots', 'tasks', 'revenue'];
        setExpandedPanel(panels?.[parseInt(e?.key) - 1]);
      }
      if (e?.key === 'Escape') {
        setExpandedPanel(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    console.log(`Task ${taskId} updated to ${newStatus}`);
    setUrgentTasks((prev) => prev?.filter((task) => task?.id !== taskId));
  };

  const handlePanelExpand = (panel) => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  return (
    <>
      <Helmet>
        <title>Command Center Dashboard - StudioFlow Bangalore</title>
        <meta
          name="description"
          content="Real-time operational hub for studio management with today's shoots, urgent tasks, revenue tracking, and quick actions"
        />
      </Helmet>
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Command Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {new Date()?.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <SystemStatusBar syncStatus={syncStatus} />

            <div className="bg-card border border-border rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">1-4</kbd>
                  Expand panels
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
                  Close
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd>
                  Search
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className={expandedPanel === 'shoots' ? 'lg:col-span-2' : ''}>
              <TodayShootsPanel
                shoots={todayShoots}
                onExpand={() => handlePanelExpand('shoots')}
              />
            </div>

            <div className={expandedPanel === 'revenue' ? 'lg:col-span-2' : ''}>
              <RevenuePanel
                revenueData={revenueData}
                onExpand={() => handlePanelExpand('revenue')}
              />
            </div>

            <div className={expandedPanel === 'tasks' ? 'lg:col-span-2' : ''}>
              <UrgentTasksPanel
                tasks={urgentTasks}
                onStatusUpdate={handleTaskStatusUpdate}
                onExpand={() => handlePanelExpand('tasks')}
              />
            </div>



            {/* <div className={expandedPanel === 'actions' ? 'lg:col-span-2' : ''}>
              <QuickActionsPanel onExpand={() => handlePanelExpand('actions')} />
            </div> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CommandCenterDashboard;