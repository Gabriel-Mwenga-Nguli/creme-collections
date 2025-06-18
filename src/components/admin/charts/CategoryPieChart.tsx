
"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryPieChartProps {
  data: Array<{ name: string; value: number; fill: string }>; // Example data structure
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
   if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No category data available.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          stroke="hsl(var(--border))"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            fontSize: '12px'
          }}
           formatter={(value: number, name: string) => [`${value} products`, name]}
        />
        <Legend wrapperStyle={{fontSize: '12px'}}/>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
