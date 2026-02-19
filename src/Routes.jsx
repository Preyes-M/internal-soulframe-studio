import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CommandCenterDashboard from './pages/command-center-dashboard';
import KanbanTaskManagementBoard from './pages/kanban-task-management-board';
import SmartCalendarScheduler from './pages/smart-calendar-scheduler';
import ShoppingListManagement from './pages/shopping-list-management';
import ClientCRMDirectory from './pages/client-crm-directory';
import RevenueAnalyticsDashboard from './pages/revenue-analytics-dashboard';
import Professionals from './pages/professionals';
import ProtectedRoute from "components/ProtectedRoute";
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><CommandCenterDashboard /></ProtectedRoute>} />
        <Route path="/command-center-dashboard" element={<ProtectedRoute><CommandCenterDashboard /></ProtectedRoute>} />
        <Route path="/kanban-task-management-board" element={<ProtectedRoute><KanbanTaskManagementBoard /></ProtectedRoute>} />
        <Route path="/smart-calendar-scheduler" element={<ProtectedRoute><SmartCalendarScheduler /></ProtectedRoute>} />
        <Route path="/shopping-list-management" element={<ProtectedRoute><ShoppingListManagement /></ProtectedRoute>} />
        <Route path="/client-crm-directory" element={<ProtectedRoute><ClientCRMDirectory /></ProtectedRoute>} />
        <Route path="/revenue-analytics-dashboard" element={<ProtectedRoute><RevenueAnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/professionals" element={<ProtectedRoute><Professionals /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
