import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Clock, 
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { cn } from '../utils/cn';

interface Ride {
  id: string;
  user: string;
  rider: string;
  status: 'live' | 'completed' | 'cancelled' | 'scheduled';
  type: 'standard' | 'prime' | 'pooled' | 'rental';
  fare: number;
  time: string;
  duration: string;
}

const mockRides: Ride[] = [
  { id: 'RD-9901', user: 'Alex Johnson', rider: 'Marco Polo', status: 'live', type: 'standard', fare: 24.50, time: '10:05 AM', duration: '12m' },
  { id: 'RD-9902', user: 'Sarah Smith', rider: 'Elena Gilbert', status: 'completed', type: 'pooled', fare: 12.00, time: '09:45 AM', duration: '25m' },
  { id: 'RD-9903', user: 'Mike Ross', rider: 'Harvey Specter', status: 'live', type: 'prime', fare: 45.20, time: '10:15 AM', duration: '5m' },
  { id: 'RD-9904', user: 'Rachel Zane', rider: 'Louis Litt', status: 'cancelled', type: 'standard', fare: 0, time: '09:30 AM', duration: '-' },
  { id: 'RD-9905', user: 'Donna Paulsen', rider: 'Robert Zane', status: 'scheduled', type: 'rental', fare: 85.00, time: '11:30 AM', duration: '-' },
];

const Rides: React.FC = () => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const columns = [
    { header: 'Ride ID', accessor: 'id' as keyof Ride },
    { header: 'User', accessor: 'user' as keyof Ride },
    { header: 'Rider', accessor: 'rider' as keyof Ride },
    { 
      header: 'Status', 
      accessor: (ride: Ride) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          ride.status === 'live' && "bg-green-500/10 text-green-500",
          ride.status === 'completed' && "bg-blue-500/10 text-blue-500",
          ride.status === 'cancelled' && "bg-destructive/10 text-destructive",
          ride.status === 'scheduled' && "bg-amber-500/10 text-amber-500",
        )}>
          {ride.status}
        </span>
      )
    },
    { header: 'Type', accessor: 'type' as keyof Ride, className: "capitalize" },
    { header: 'Fare', accessor: (ride: Ride) => `$${ride.fare.toFixed(2)}` },
    { header: 'Time', accessor: 'time' as keyof Ride },
    { header: 'Duration', accessor: 'duration' as keyof Ride },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-bold text-foreground">Ride Operations</h1>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">1,245 LIVE</span>
          </div>
          <p className="text-muted-foreground mt-1">Manage, track, and intervene in active ride sessions.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="glass p-4 rounded-xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by ID, User, or Rider..." 
            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
          <option>All Statuses</option>
          <option>Live</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
          <option>All Types</option>
          <option>Standard</option>
          <option>Prime</option>
          <option>Pooled</option>
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={mockRides} 
        rowIdKey="id"
        onRowClick={(ride) => setExpandedRowId(expandedRowId === ride.id ? null : ride.id)}
        expandedRowId={expandedRowId || undefined}
        expandedRowRender={(ride) => (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64">
            <div className="lg:col-span-2 bg-[#0a0a0a] rounded-lg border border-border relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e2024 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-muted-foreground">Rendering Route Map for {ride.id}...</p>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded text-[10px] border border-border">
                <p>Speed: 45 km/h</p>
                <p>ETA: 8 mins</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Ride Timeline</h4>
                <span className="text-[10px] text-muted-foreground uppercase">Real-time</span>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-1 top-2 bottom-2 w-px bg-border" />
                {[
                  { time: '10:05 AM', event: 'Ride Requested', icon: Clock, color: 'primary' },
                  { time: '10:07 AM', event: 'Rider Assigned', icon: ShieldCheck, color: 'success' },
                  { time: '10:12 AM', event: 'Arrived at Pickup', icon: MapPin, color: 'primary' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start relative pl-6">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary border border-background z-10" />
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-none">{step.event}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-[11px] font-bold hover:bg-primary/90 transition-colors">
                  INTERVENE
                </button>
                <button className="flex-1 bg-muted text-foreground py-2 rounded-lg text-[11px] font-bold hover:bg-muted/80 transition-colors flex items-center justify-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  CHAT
                </button>
                <button className="p-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Rides;
