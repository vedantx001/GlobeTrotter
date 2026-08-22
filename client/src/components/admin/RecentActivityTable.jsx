import React from 'react';

const RecentActivityTable = ({ data }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 bg-success-soft text-success rounded-full text-xs font-medium">Active</span>;
      case 'Planning':
        return <span className="px-2 py-1 bg-info-soft text-info rounded-full text-xs font-medium">Planning</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-surface-muted text-secondary rounded-full text-xs font-medium">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-surface-muted text-secondary rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle overflow-hidden">
      <div className="p-6 border-b border-border-subtle">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Recent Activity</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Latest trips created by users.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-secondary text-secondary text-(length:--text-caption) uppercase tracking-wider">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Trip Name</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Created Date</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-(length:--text-body-sm)">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-surface-secondary/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={row.avatar} alt={row.user} className="w-8 h-8 rounded-full border border-border-default" />
                  <span className="font-medium text-primary">{row.user}</span>
                </td>
                <td className="p-4 text-primary font-medium">{row.tripName}</td>
                <td className="p-4 text-secondary">{row.destination}</td>
                <td className="p-4 text-secondary">{row.createdDate}</td>
                <td className="p-4">{getStatusBadge(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
