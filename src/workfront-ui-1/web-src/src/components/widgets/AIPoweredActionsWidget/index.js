import React from 'react';

const AIPoweredActionsWidget = () => {
  const actions = [
    {
      id: 1,
      icon: '🤖',
      title: 'Ask Assistant',
      description: 'Get help with anything'
    },
    {
      id: 2,
      icon: '➕',
      title: 'New Campaign',
      description: 'Launch campaign'
    },
    {
      id: 3,
      icon: '✅',
      title: 'AI Reviewer',
      description: 'Review assets'
    },
    {
      id: 4,
      icon: '📁',
      title: 'Directory',
      description: 'Access agents'
    }
  ];

  return (
    <div className="widget-card">
      <div className="widget-header">
        <div>
          <h3 className="widget-title">AI-Powered Actions</h3>
        </div>
      </div>

      <div className="ai-actions-grid">
        {actions.map((action) => (
          <div key={action.id} className="ai-action-card">
            <div className="ai-action-icon">{action.icon}</div>
            <div className="ai-action-title">{action.title}</div>
            <div className="ai-action-desc">{action.description}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>📊</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>PowerBI Integration</span>
        </div>
        <p style={{ margin: 0, lineHeight: '1.4' }}>
          Connected to live PowerBI workspace for real-time media insights and automated reporting.
        </p>
      </div>
    </div>
  );
};

export default AIPoweredActionsWidget; 