import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  color?: string;
}

const StatCard = ({ title, value, icon, description, color = "bg-white" }: StatCardProps) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm border border-slate-200 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 text-primary">
          {icon}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 font-medium">{description}</p>
    </div>
  );
};

export default StatCard;
