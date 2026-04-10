import React, { useState, useEffect } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CodeApp from '../components/microapps/CodeApp'; 
import EmailApp from '../components/microapps/EmailApp'; 
import ImageApp from '../components/microapps/ImageApp'; 
import PricingModal from '../components/dashboard/PricingModal'; 
import { useAuth } from '../context/AuthContext'; 

export default function Dashboard() {
  const { user } = useAuth(); 
  const [activeApp, setActiveApp] = useState('code');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    // If the user object exists and their credits drop to 0, pop the modal!
    if (user && user.credits <= 0) {
      setShowPricingModal(true);
    }
  }, [user?.credits]);

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'code':
        return <CodeApp currentTask={currentTask} setShowPricingModal={setShowPricingModal} />; 
      case 'email':
        return <EmailApp currentTask={currentTask} setShowPricingModal={setShowPricingModal} />; 
      case 'image':
        return <ImageApp currentTask={currentTask} setShowPricingModal={setShowPricingModal} />; 
      default:
        return <CodeApp currentTask={currentTask} setShowPricingModal={setShowPricingModal} />;
    }
  };

  return (
    // CHANGED: bg-white to bg-slate-950, added text-slate-50 and selection color
    <div className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-indigo-500/30">
      
      {/* Optional: Subtle background glow for the workspace */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <DashboardSidebar 
        activeApp={activeApp} 
        setActiveApp={setActiveApp} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        setCurrentTask={setCurrentTask} 
      />
      
      <main className={`pt-20 h-screen flex flex-col transition-all duration-300 ease-in-out relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {renderActiveApp()}
      </main>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </div>
  );
}