const BudgetSummary = ({ totalExpense, budget }) => {
  const remaining = (budget || 0) - totalExpense;
  const isOverBudget = remaining < 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-surface-secondary border border-border-default rounded-[var(--radius-xl)] p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
      <div>
        <h2 className="text-(length:--text-caption) text-secondary font-bold uppercase tracking-widest mb-1">Budget Summary</h2>
        <p className="text-(length:--text-body-sm) text-secondary">A high-level view of your planned expenses.</p>
      </div>

      <div className="flex flex-wrap gap-8 md:gap-12">
        <div>
          <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Total Planned</div>
          <div className="font-display text-(length:--text-heading-md) text-primary">{formatCurrency(totalExpense)}</div>
        </div>
        
        {budget ? (
          <>
            <div>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Allocated Budget</div>
              <div className="font-display text-(length:--text-heading-sm) text-stone mt-1 sm:mt-2">{formatCurrency(budget)}</div>
            </div>
            <div>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Remaining</div>
              <div className={`font-display text-(length:--text-heading-sm) mt-1 sm:mt-2 ${isOverBudget ? 'text-danger' : 'text-success'}`}>
                {formatCurrency(remaining)}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BudgetSummary;
