import React, { useState } from 'react';
import { UrbanDataProvider } from './context/UrbanDataContext';
import { AppShell, type ActiveTab } from './components/AppShell';
import { FoundationPage } from './pages/FoundationPage';
import { FlowPrototypeStudio } from './components/FlowPrototypeStudio';
import { AIDetectionsView } from './components/AIDetectionsView';
import { FleetTracker } from './components/FleetTracker';
import { IncidentBoard } from './components/IncidentBoard';
import { RoadIntelligenceView } from './components/RoadIntelligenceView';
import { TrafficAnalyticsView } from './components/TrafficAnalyticsView';
import { HeatmapView } from './components/HeatmapView';
import { RouteIntelligenceView } from './components/RouteIntelligenceView';
import { InfrastructureView } from './components/InfrastructureView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ReportsView } from './components/ReportsView';
import { AlertsView } from './components/AlertsView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <FoundationPage onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)} />;
      case 'prototype':
        return <FlowPrototypeStudio />;
      case 'detections':
        return <AIDetectionsView />;
      case 'fleet':
        return <FleetTracker />;
      case 'incidents':
        return <IncidentBoard />;
      case 'roads':
        return <RoadIntelligenceView />;
      case 'traffic':
        return <TrafficAnalyticsView />;
      case 'heatmap':
        return <HeatmapView />;
      case 'routes':
        return <RouteIntelligenceView />;
      case 'infrastructure':
        return <InfrastructureView />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'reports':
        return <ReportsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <FoundationPage onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)} />;
    }
  };

  return (
    <UrbanDataProvider>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </AppShell>
    </UrbanDataProvider>
  );
}
