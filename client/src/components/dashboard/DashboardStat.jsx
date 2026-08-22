const DashboardStat = ({ label, value }) => {
  return (
    <div className="bg-warm-white border border-border-subtle rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-soft)] flex flex-col justify-center">
      <span className="text-(length:--text-body-sm) text-secondary font-medium mb-1">{label}</span>
      <span className="font-display text-(length:--text-heading-md) text-primary leading-none">{value}</span>
    </div>
  );
};

export default DashboardStat;
