import React from 'react';

const PendingApprovalsWidget = () => {
  const approvals = [
    {
      id: 1,
      title: 'Q2 Marketing Campaign',
      type: 'Budget Approval',
      priority: 'high',
      requester: 'John Smith',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Brand Guidelines Update',
      type: 'Creative Review',
      priority: 'medium',
      requester: 'Maria Garcia',
      date: '2024-01-14'
    },
    {
      id: 3,
      title: 'Website Redesign',
      type: 'Stakeholder Sign-off',
      priority: 'high',
      requester: 'David Lee',
      date: '2024-01-13'
    },
    {
      id: 4,
      title: 'Product Launch',
      type: 'Legal Review',
      priority: 'medium',
      requester: 'Mike Wilson',
      date: '2024-01-11'
    }
  ];

  return (
    <div className="widget-card">
      <div className="widget-header">
        <div>
          <h3 className="widget-title">Pending Approvals</h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginTop: '0.25rem'
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              background: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              4
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {approvals.map((approval) => (
          <div key={approval.id} className="approval-card">
            <div className="approval-header">
              <div>
                <h4 className="approval-title">{approval.title}</h4>
                <p className="approval-type">{approval.type}</p>
              </div>
              <span className={`approval-priority ${approval.priority}`}>
                {approval.priority}
              </span>
            </div>
            
            <div className="approval-meta">
              <span>Requested by {approval.requester}</span>
              <span>{approval.date}</span>
            </div>
            
            <div className="approval-actions">
              <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                Approve
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                Reject
              </button>
              {approval.id === 2 && (
                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                  Edit with Lovable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #f1f5f9',
        textAlign: 'center'
      }}>
        <a href="#" style={{ 
          color: '#3b82f6', 
          textDecoration: 'none', 
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          View All Approvals
        </a>
      </div>
    </div>
  );
};

export default PendingApprovalsWidget; 