import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  'var(--color-terracotta)', 
  'var(--color-sage)', 
  'var(--color-sand)', 
  'var(--color-primary)', 
  'var(--color-accent)'
];

const CategoryPieChart = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-2">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Category Distribution</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Travel categories breakdown.</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-obsidian)', 
                color: 'var(--color-warm-white)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
              }}
              itemStyle={{ color: 'var(--color-warm-white)' }}
              formatter={(value) => `${value}%`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: 'var(--color-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPieChart;
