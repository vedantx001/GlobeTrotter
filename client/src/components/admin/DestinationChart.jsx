import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DestinationChart = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Popular Destinations</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Top cities by trip count.</p>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-subtle)" />
            <XAxis 
              type="number"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
            />
            <YAxis 
              dataKey="city" 
              type="category"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-primary)', fontSize: 12, fontWeight: 500 }}
              width={80}
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
            <Bar dataKey="trips" fill="var(--color-terracotta)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DestinationChart;
