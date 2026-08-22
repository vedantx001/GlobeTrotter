import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BudgetSummary = ({ totalExpense = 0, budget = null, tripId = null }) => {
  const navigate = useNavigate();
  const remaining = budget ? budget - totalExpense : null;
  const isOverBudget = remaining !== null && remaining < 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="py-5 px-6 my-8 border border-border-subtle/80 rounded-[var(--radius-2xl)] bg-surface-primary shadow-xs font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Section Tag & Main Stat */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-wider text-terracotta uppercase block font-sans">
            Budget Overview
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-2xl sm:text-3xl font-semibold text-primary">
              {formatCurrency(totalExpense)}
            </span>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider font-sans">
              Total Planned
            </span>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-6 sm:gap-10 border-t md:border-t-0 md:border-l border-border-subtle/60 pt-4 md:pt-0 md:pl-8 font-sans">
          {budget ? (
            <>
              <div>
                <span className="text-[10px] text-stone font-semibold uppercase tracking-wider block mb-0.5 font-sans">
                  Allocated Limit
                </span>
                <span className="font-sans text-lg font-medium text-primary">
                  {formatCurrency(budget)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone font-semibold uppercase tracking-wider block mb-0.5 font-sans">
                  Remaining
                </span>
                <span className={`font-sans text-lg font-medium ${isOverBudget ? 'text-danger' : 'text-primary'}`}>
                  {formatCurrency(remaining)}
                </span>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default BudgetSummary;
