import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from "axios";
import authTokenManager from '../../utils/authTokenManager';
import { WorkfrontServiceClient } from '../../utils/wfClient';
import { attach } from "@adobe/uix-guest";



const PendingApprovalsWidget = () => {
  const [accessToken, setAccessToken] = useState('');
  const [hostname, sethostname] = useState('');
  const [approvals, setApprovals] = useState([]);
  useEffect(() => {
    const doAttach = async () => {
      try {
        const conn = await attach({ id: "my-work-view" }); // replace with your actual extensionId
        const auth = conn?.sharedContext?.get("auth");
        const imsToken = auth?.imsToken;
        if (imsToken) {
          authTokenManager.initialize(imsToken);
          setAccessToken(imsToken);
        }
        const hostname = conn?.sharedContext?.get("hostname");
        if(hostname) {
          sethostname(hostname);
        }

      } catch (e) {
        console.error("Failed to attach and get auth token", e);
      }
    };
    doAttach();
  }, []);
  
  useEffect(() => {
    if (!accessToken) return; // Only run if accessToken is set
    // You can now use accessToken here
    const fetchData = async () => {
      const actionUrl = `https://27200-wep-stage.adobeio-static.net/api/v1/web/heineken/wfapi`
      const axiosInstance = axios.create();
      const myApprovals = await axiosInstance.post(actionUrl,
        {
            'requestObj': {
              'hostname': hostname,
              'method': 'get',
              'objCode': 'APPROVAL',
              'parameters': {
                'query': 'myApprovals'
              }
            }
        },
        {
          headers: {'Authorization': `Bearer ${accessToken}`}
        }
      );
      const rawApprovals = myApprovals.data;

      const priorityMap = {
          '0': 'None',
          '1': 'Low',
          '2': 'Normal',
          '3': 'High',
          '4': 'Urgent'
        };

      const processedApprovals = await Promise.all(
        rawApprovals.slice(0, 3).map(async(item) => {
          const awaitingApprovals = await axiosInstance.post(actionUrl,
            {
              'requestObj': {
                'hostname': hostname,
                'method': 'get',
                'objCode': item.objCode,
                'ID': item.ID,
                'parameters': {
                  'fields': 'approvalStartDate,awaitingApprovals:*,approvalProcess:name,currentApprovalStep'
                }
              }
            },
            {
              headers: {'Authorization': `Bearer ${accessToken}`}
            }
          );

          const approvalSubmittedBy = await axiosInstance.post(actionUrl,
            {
              'requestObj': {
                'hostname': hostname,
                'method': 'get',
                'objCode': 'USER',
                'ID': awaitingApprovals.data.awaitingApprovals[0].submittedByID,
                'parameters': {
                  'fields': 'name'
                }
              }
            },
            {
              headers: {'Authorization': `Bearer ${accessToken}`}
            }
          );
            
          const wfDate = awaitingApprovals.data.approvalStartDate;
          const fixedDate = wfDate.replace(/:(\d{3})-/, '.$1-');
          const date = new Date(fixedDate);
          const formattedDate = date.toISOString().slice(0, 10); // "2025-08-07"
          return {
            id: item.ID,
            objCode: item.objCode,
            title: item.name,
            type: 'Debrief Approval',
            priority: priorityMap[item.priority],
            requester: 'TBD',
            date: formattedDate,
            link: `https://experience.adobe.com/#/@bilbroug/so:bilbroug-Production/workfront/project/${item.ID}`,
            approvalStepName: awaitingApprovals.data.currentApprovalStep.name,
            approvalSubmittedBy: approvalSubmittedBy.data.name // Example link, adjust as needed
          };
          
        })
      )
      setApprovals(processedApprovals);
    };
    fetchData();
  }, [accessToken, hostname, approvals]);
  //console.log(`My IMS Token: ${accessToken}`);

  const handleDecision = async (objID,objCode,decision) => {
    console.log(`Decision ${decision} on approval with ID: ${objID}`);
    const actionUrl = `https://27200-wep-stage.adobeio-static.net/api/v1/web/heineken/wfapi`
    const axiosInstance = axios.create();
    const res = await axiosInstance.post(actionUrl,
      {
        'requestObj': {
          'hostname': hostname,
          'method': 'put',
          'objCode': objCode,
          'ID': objID,
          'parameters': {
            'action': `${decision}Approval`
          }
        }
      },
      {
        headers: {'Authorization': `Bearer ${accessToken}`}
      }
    );
    if (res.status === 200) {
      console.log(`Successfully decisioned approval with ID: ${objID}`);
      // Optionally, you can refresh the approvals list after a decision
      setApprovals(prev => prev.filter(approval => approval.id !== objID));
    }
  }

  let objType;
  const objLink = async (objID,objCode) => {
    switch (objCode) {
      case 'PROJ':
        objType = 'project';
        break;
      case 'TASK':
        objType = 'task';
        break;
      case 'OPTASK':
        objType = 'issue';
        break;
    }
    //window.top.location.href = `https://experience.adobe.com/#/@bilbroug/so:bilbroug-Production/workfront/${objType}/${objID}`;
    window.open(`https://experience.adobe.com/#/@bilbroug/so:bilbroug-Production/workfront/${objType}/${objID}`, "_blank") 
  }
  
  /*
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
  */

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
              {approvals.length}
            </div>
          </div>
        </div>
      </div>

      {/* Access Token Display 
      <div style={{ margin: '1rem 0', padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', wordBreak: 'break-all' }}>
        <strong>Access Token:</strong>
        <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0}}>{accessToken}</pre>
      </div>
      */}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {approvals.map((approval) => (
          <div key={approval.id} className="approval-card">
            <div className="approval-header">
              <div>
                <h4 className="approval-title" style={{cursor: 'pointer'}} onClick={() => objLink(approval.id, approval.objCode)}>{approval.title}</h4>
                <p className="approval-type">Approval Step: {approval.approvalStepName}</p>
              </div>
              <span className={`approval-priority ${approval.priority}`}>
                {approval.priority}
              </span>
            </div>
            
            <div className="approval-meta">
              <span>Requested by {approval.approvalSubmittedBy}</span>
              <span>{approval.date}</span>
            </div>
            
            <div className="approval-actions">
              <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }} onClick={() => handleDecision(approval.id, approval.objCode, 'approve')}>
                Approve
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }} onClick={() => handleDecision(approval.id, approval.objCode, 'reject')}>
                Reject
              </button>
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