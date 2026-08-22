import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserGrowthChart = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Monthly User Growth</h3>
        <p className="text-secondary text-(length:--text-body-sm)">New signups and returning users.</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-terracotta)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-terracotta)" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              contentStyle={{ 
                backgroundColor: 'var(--color-obsidian)', 
                color: 'var(--color-warm-white)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                boxShadow: 'var(--shadow-elevated)'
              }}
              itemStyle={{ color: 'var(--color-warm-white)' }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="var(--color-terracotta)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUsers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
