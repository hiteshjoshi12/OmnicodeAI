// src/Pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import AdminSidebar from '../components/Admin/AdminSidebar';
import AnalyticsTab from '../components/Admin/AnalyticsTab';
import UsersTab from '../components/Admin/UsersTab';
import SettingsTab from '../components/Admin/SettingsTab';
import CMSTab from '../components/Admin/CMSTab';
import ReportsTab from '../components/Admin/ReportsTab'; // <-- Import the new tab
import BroadcastTab from '../components/Admin/BroadcastTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Dynamic Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-[950] text-slate-900 tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {activeTab === 'analytics' && 'Real-time system usage and credit consumption metrics.'}
              {activeTab === 'users' && 'Manage accounts, verify payments, and allocate credits.'}
              {activeTab === 'CMS' && 'Manage AI system prompts and content.'}
              {activeTab === 'settings' && 'Configure global system variables and integrations.'}
              {activeTab === 'reports' && 'Generate and download user-wise financial and usage reports.'} {/* <-- Add description */}
              {activeTab === 'broadcast' && 'Send mass email announcements to your entire user base.'}
            </p>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'CMS' && <CMSTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'reports' && <ReportsTab />} {/* <-- Render the component */}
          {activeTab === 'broadcast' && <BroadcastTab />}
        </AnimatePresence>
        
      </div>
    </div>
  );
}