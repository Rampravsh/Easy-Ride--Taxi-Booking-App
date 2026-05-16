import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Zap, 
  Server, 
  Database, 
  Globe,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { cn } from '../utils/cn';

const latencyData = [
  { time: '10:00', api: 45, db: 12, ws: 25 },
  { time: '10:05', api: 52, db: 15, ws: 30 },
  { time: '10:10', api: 48, db: 14, ws: 28 },
  { time: '10:15', api: 120, db: 18, ws: 150 }, // Spike
  { time: '10:20', api: 60, db: 16, ws: 45 },
  { time: '10:25', api: 42, db: 12, ws: 22 },
  { time: '10:30', api: 44, db: 13, ws: 24 },
];

const Monitoring: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">System Observability</h1>
          <p className="text-muted-foreground mt-1">Real-time health monitoring of infrastructure and services.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'API Throughput', value: '4.2k req/s', icon: Zap, status: 'ok' },
          { label: 'Memory Usage', value: '64%', icon: Cpu, status: 'warning' },
          { label: 'DB Connections', value: '1,240', icon: Database, status: 'ok' },
          { label: 'Active WebSockets', value: '12.5k', icon: Network, status: 'ok' },
        ].map((metric, i) => (
          <div key={i} className="glass p-6 rounded-xl border border-border group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-muted rounded-lg text-primary">
                <metric.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                metric.status === 'ok' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {metric.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{metric.label}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Service Latency (ms)
            </h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> API</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> DB</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-destructive" /> WebSocket</div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2024" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111317', border: '1px solid #1e2024', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="api" stroke="#f5b800" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="db" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ws" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-xl min-h-[350px] flex flex-col">
          <h3 className="font-heading font-bold text-foreground mb-8 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            Infrastructure Logs
          </h3>
          <div className="flex-1 bg-[#0a0a0a] rounded-lg border border-border p-4 font-mono text-[11px] overflow-y-auto space-y-1">
             <p className="text-green-500">[10:30:01] INFO: Payment gateway heartbeat received - Latency 12ms</p>
             <p className="text-blue-400">[10:30:05] DEBUG: Rider-Lifecycle-Node-01: Successfully matched ride RD-9912</p>
             <p className="text-green-500">[10:30:12] INFO: Redis cache flush completed for region-NYC</p>
             <p className="text-amber-500">[10:30:15] WARN: Higher than average latency in WebSocket Cluster 02</p>
             <p className="text-green-500">[10:30:20] INFO: Backup process started for MongoDB Primary</p>
             <p className="text-muted-foreground">[10:30:25] TRACE: Request received: GET /api/v1/rides/active</p>
             <p className="text-green-500">[10:30:30] INFO: Scaling group updated: +2 instances in us-east-1</p>
             <div className="animate-pulse inline-block w-2 h-4 bg-primary align-middle ml-1" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Redis Health', icon: Database, usage: 24, status: 'Healthy' },
          { label: 'MongoDB Cluster', icon: Server, usage: 78, status: 'Load' },
          { label: 'Web Tier', icon: Globe, usage: 42, status: 'Healthy' },
        ].map((svc, i) => (
          <div key={i} className="glass p-5 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svc.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">{svc.label}</span>
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase",
                svc.status === 'Healthy' ? "text-green-500" : "text-amber-500"
              )}>{svc.status}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Capacity</span>
                <span>{svc.usage}%</span>
              </div>
              <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    svc.usage > 70 ? "bg-amber-500" : "bg-primary"
                  )} 
                  style={{ width: `${svc.usage}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monitoring;
