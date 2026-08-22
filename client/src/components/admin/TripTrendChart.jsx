import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TripTrendChart = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Trip Creation Trends</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Total trips created per month.</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'var(--color-surface-muted)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-obsidian)', 
                color: 'var(--color-warm-white)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
              }}
              itemStyle={{ color: 'var(--color-warm-white)' }}
            />
            <Bar dataKey="trips" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TripTrendChart;
