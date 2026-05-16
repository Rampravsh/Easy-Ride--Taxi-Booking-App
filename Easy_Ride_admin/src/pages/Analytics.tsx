import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Car, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { cn } from '../utils/cn';

const revenueData = [
  { name: 'Mon', revenue: 4000, rides: 240 },
  { name: 'Tue', revenue: 3000, rides: 139 },
  { name: 'Wed', revenue: 2000, rides: 980 },
  { name: 'Thu', revenue: 2780, rides: 390 },
  { name: 'Fri', revenue: 1890, rides: 480 },
  { name: 'Sat', revenue: 2390, rides: 380 },
  { name: 'Sun', revenue: 3490, rides: 430 },
];

const categoryData = [
  { name: 'Standard', value: 400, color: '#f5b800' },
  { name: 'Prime', value: 300, color: '#fbbf24' },
  { name: 'Pooled', value: 300, color: '#d97706' },
  { name: 'Rental', value: 200, color: '#92400e' },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Analytics & Intelligence</h1>
          <p className="text-muted-foreground mt-1">Deep insights into revenue, growth, and fleet performance.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-muted border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$142,500', trend: 12, icon: DollarSign, color: 'primary' },
          { label: 'Total Rides', value: '12,450', trend: 8, icon: Car, color: 'info' },
          { label: 'New Users', value: '1,204', trend: -2, icon: Users, color: 'success' },
          { label: 'Avg. ETA', value: '4.5m', trend: -5, icon: Clock, color: 'destructive' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              </div>
              <div className="p-2 bg-muted rounded-lg text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {stat.trend > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-bold",
                stat.trend > 0 ? "text-green-500" : "text-destructive"
              )}>
                {Math.abs(stat.trend)}%
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">vs prev. period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-xl min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Revenue Growth
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Revenue ($)</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5b800" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5b800" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2024" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111317', border: '1px solid #1e2024', borderRadius: '8px' }}
                  itemStyle={{ color: '#f5b800' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f5b800" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-xl min-h-[400px] flex flex-col">
          <h3 className="font-heading font-bold text-foreground mb-8">Ride Categories</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111317', border: '1px solid #1e2024', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{cat.name}</span>
                <span className="text-xs text-foreground font-bold ml-auto">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-xl">
        <h3 className="font-heading font-bold text-foreground mb-6">Daily Operational Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2024" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(245, 184, 0, 0.05)' }}
                contentStyle={{ backgroundColor: '#111317', border: '1px solid #1e2024', borderRadius: '8px' }}
              />
              <Bar dataKey="rides" fill="#f5b800" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
