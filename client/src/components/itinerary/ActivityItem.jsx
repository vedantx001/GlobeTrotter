import { Trash2, Clock } from 'lucide-react';

const ActivityItem = ({ activity, onRemove }) => {
  return (
    <div className="group flex items-center justify-between py-3 px-4 rounded-[var(--radius-md)] hover:bg-surface-muted transition-colors">
      <div className="flex flex-col">
        <span className="text-(length:--text-body-sm) font-medium text-primary">
          {activity.title}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1 text-(length:--text-caption) text-secondary">
            <Clock size={12} />
            {activity.time_slot || 'Anytime'}
          </span>
          <span className="text-(length:--text-caption) text-deep-olive">
            {activity.category}
          </span>
          <span className="text-(length:--text-caption) font-medium text-stone">
            €{activity.custom_cost || activity.defaultCost || 0}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => onRemove(activity.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-secondary hover:text-danger hover:bg-danger-soft rounded-full transition-all"
        title="Remove activity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ActivityItem;
