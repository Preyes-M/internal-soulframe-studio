import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ShootTypeBreakdown = ({ data }) => {
  const COLORS = {
    'Modeling': '#3B82F6',
    'Podcasting': '#8B5CF6',
    'Maternity': '#EC4899',
    'Fashion': '#EF4444',
    'Baby': '#10B981',
    'Product': '#F59E0B'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.name}</p>
          <p className="text-xs text-muted-foreground">
            Revenue: ₹{payload?.[0]?.value?.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-muted-foreground">
            Share: {payload?.[0]?.payload?.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Shoot Type Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS?.[entry?.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px', color: 'var(--color-foreground)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShootTypeBreakdown;