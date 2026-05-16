import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: number;
  trendLabel: string;
  color?: 'primary' | 'success' | 'destructive' | 'info';
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'primary'
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="glass p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-foreground">{value}</h3>
        </div>
        <div className={cn(
          "p-2 rounded-lg",
          color === 'primary' && "bg-primary/10 text-primary",
          color === 'success' && "bg-green-500/10 text-green-500",
          color === 'destructive' && "bg-destructive/10 text-destructive",
          color === 'info' && "bg-blue-500/10 text-blue-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md",
          isPositive ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
        <span className="text-xs text-muted-foreground">{trendLabel}</span>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
    </div>
  );
};

export default KpiCard;
