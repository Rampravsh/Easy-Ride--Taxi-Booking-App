import React from 'react';
import { 
  Car, 
  Users, 
  DollarSign, 
  AlertOctagon,
  BarChart,
  History
} from 'lucide-react';
import KpiCard from '../components/dashboard/KpiCard';
import RealtimeMap from '../components/dashboard/RealtimeMap';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Operational Command Center</h1>
        <p className="text-muted-foreground mt-1">Real-time mobility oversight and fleet intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Active Rides" 
          value="1,245" 
          icon={Car} 
          trend={12.5} 
          trendLabel="vs last hour"
          color="primary"
        />
        <KpiCard 
          title="Online Riders" 
          value="850" 
          icon={Users} 
          trend={-2.4} 
          trendLabel="vs last hour"
          color="success"
        />
        <KpiCard 
          title="Revenue Today" 
          value="$12.5k" 
          icon={DollarSign} 
          trend={8.2} 
          trendLabel="vs yesterday"
          color="primary"
        />
        <KpiCard 
          title="Fraud Alerts" 
          value="12" 
          icon={AlertOctagon} 
          trend={150} 
          trendLabel="spike detected"
          color="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealtimeMap />
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-destructive" />
                Critical Alerts
              </h3>
              <button className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { id: 1, type: 'Fraud', msg: 'Suspicious GPS jump detected #R-9902', time: '2m ago', severity: 'high' },
                { id: 2, type: 'System', msg: 'Redis latency spike in Region-West', time: '5m ago', severity: 'medium' },
                { id: 3, type: 'Payment', msg: 'Failed payout batch for 12 riders', time: '12m ago', severity: 'medium' },
              ].map(alert => (
                <div key={alert.id} className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] uppercase font-bold tracking-tighter px-1.5 py-0.5 rounded ${
                      alert.severity === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm mt-2 text-foreground/90 leading-tight">{alert.msg}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-xl flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Live Feed
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { id: 1, action: 'Ride Completed', sub: 'NYC-8829 | $24.50', time: 'Just now' },
                { id: 2, action: 'Rider Onboarded', sub: 'James Wilson | Bike', time: '1m ago' },
                { id: 3, action: 'Scheduled Ride', sub: 'Pickup in 30m | JFK Airport', time: '3m ago' },
              ].map(item => (
                <div key={item.id} className="flex gap-3 relative pb-4 last:pb-0">
                  <div className="absolute left-1.5 top-5 bottom-0 w-px bg-border last:hidden" />
                  <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary z-10 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-xs font-semibold text-foreground">{item.action}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl h-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Ride Volume Trend</h3>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-[10px] rounded bg-primary text-primary-foreground">1H</button>
              <button className="px-2 py-1 text-[10px] rounded bg-muted text-muted-foreground">24H</button>
            </div>
          </div>
          <div className="h-40 flex items-end gap-2 px-2">
            {[40, 65, 45, 90, 55, 70, 85, 60, 40, 30, 50, 75].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all group relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[8px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h * 10} rides
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-xl h-64">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">System Health</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Optimal</span>
          </div>
          <div className="space-y-4 mt-4">
            {[
              { label: 'API Gateway', val: 99.9, status: 'ok' },
              { label: 'Ride Matcher', val: 98.4, status: 'ok' },
              { label: 'Payment Svc', val: 99.2, status: 'ok' },
              { label: 'Redis Cluster', val: 100, status: 'ok' },
            ].map(svc => (
              <div key={svc.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{svc.label}</span>
                  <span className="text-foreground font-mono">{svc.val}%</span>
                </div>
                <div className="w-full bg-muted/50 h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all" style={{ width: `${svc.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
