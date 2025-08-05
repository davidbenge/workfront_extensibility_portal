import React from 'react';
import CampaignTimelineWidget from '../widgets/CampaignTimelineWidget';
import PendingApprovalsWidget from '../widgets/PendingApprovalsWidget';
import LiveCampaignsWidget from '../widgets/LiveCampaignsWidget';
import MediaInsightsWidget from '../widgets/MediaInsightsWidget';
import TopAssetsWidget from '../widgets/TopAssetsWidget';
import AIPoweredActionsWidget from '../widgets/AIPoweredActionsWidget';

const MyWorkView = () => {
    return (
        <div className="app">
          {/* Header */}
          <header className="header">
            <div className="header-content">
              <div className="header-left">
                <h1 className="header-title">Adobe Workfront</h1>
                <nav className="header-nav">
                  <a href="#" className="nav-link">Projects</a>
                  <a href="#" className="nav-link">Tasks</a>
                  <a href="#" className="nav-link">Reports</a>
                  <a href="#" className="nav-link">Analytics</a>
                </nav>
              </div>
              
              <div className="header-right">
                <div className="header-search">
                  <input 
                    type="text" 
                    placeholder="Search projects, tasks..." 
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <button className="btn btn-ghost" aria-label="Notifications">
                  🔔
                </button>
                <button className="btn btn-ghost" aria-label="Settings">
                  ⚙️
                </button>
                <div className="user-profile">
                  <div className="user-avatar">JD</div>
                </div>
              </div>
            </div>
          </header>
    
          {/* Main Content */}
          <main className="main-content">
            <div className="content-wrapper">
              {/* Top Section - Campaign Timeline & Pending Approvals */}
              <div className="top-section">
                <div className="campaign-timeline-section">
                  <CampaignTimelineWidget />
                </div>
                <div className="pending-approvals-section">
                  <PendingApprovalsWidget />
                </div>
              </div>
    
              {/* Middle Section - Live Campaigns & Media Insights */}
              <div className="middle-section">
                <div className="live-campaigns-section">
                  <LiveCampaignsWidget />
                </div>
                <div className="media-insights-section">
                  <MediaInsightsWidget />
                </div>
              </div>
    
              {/* Bottom Section - Top Assets & AI Actions */}
              <div className="bottom-section">
                <div className="top-assets-section">
                  <TopAssetsWidget />
                </div>
                <div className="ai-actions-section">
                  <AIPoweredActionsWidget />
                </div>
              </div>
            </div>
          </main>
        </div>
      );
};

export default MyWorkView;