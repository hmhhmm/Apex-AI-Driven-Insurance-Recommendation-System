import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  // In a real app, would fetch user's active policies from backend
  const mockPolicies = [
    { type: 'Health', plan: 'Standard Plus', status: 'Active', premium: '$129/mo' },
    { type: 'Auto', plan: 'Comprehensive', status: 'Active', premium: '$89/mo' },
    { type: 'Life', plan: 'Term 20yr', status: 'Active', premium: '$49/mo' }
  ]

  return (
    <div className="dashboard-page">
      <div className="panel">
        <h2>My Insurance Policies</h2>
        <p>Manage your active insurance plans and view coverage details.</p>

        {mockPolicies.length > 0 ? (
          <div className="policies-grid">
            {mockPolicies.map((policy, i) => (
              <div key={i} className="policy-card">
                <div className="policy-header">
                  <h3>{policy.type} Insurance</h3>
                  <span className="status-badge active">{policy.status}</span>
                </div>
                <div className="policy-plan">{policy.plan}</div>
                <div className="policy-premium">{policy.premium}</div>
                <button className="btn-secondary btn-small">View Details</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You don't have any active policies yet.</p>
            <Link to="/onboarding" className="btn-primary">
              Get Your First Policy
            </Link>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn-secondary">File a Claim</button>
          <button className="btn-secondary">Update Profile</button>
          <button className="btn-secondary">Download Documents</button>
          <Link to="/onboarding" className="btn-primary">Add New Policy</Link>
        </div>
      </div>
    </div>
  )
}
