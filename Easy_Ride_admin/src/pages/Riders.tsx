import React, { useState } from 'react';
import { 
  UserSquare2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  MapPin,
  Star,
  ExternalLink,
  Clock
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { cn } from '../utils/cn';

interface Rider {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'blocked' | 'offline';
  rating: number;
  totalEarnings: number;
  vehicle: string;
  joinedDate: string;
}

const mockRiders: Rider[] = [
  { id: 'RID-501', name: 'John Doe', status: 'active', rating: 4.8, totalEarnings: 2450.00, vehicle: 'Toyota Prius (White)', joinedDate: 'Jan 12, 2026' },
  { id: 'RID-502', name: 'Jane Smith', status: 'pending', rating: 0, totalEarnings: 0, vehicle: 'Honda Civic (Black)', joinedDate: 'May 10, 2026' },
  { id: 'RID-503', name: 'Marco Rossi', status: 'active', rating: 4.9, totalEarnings: 5100.20, vehicle: 'Tesla Model 3', joinedDate: 'Dec 05, 2025' },
  { id: 'RID-504', name: 'Elena Gilbert', status: 'blocked', rating: 3.2, totalEarnings: 120.00, vehicle: 'Scooter (Yellow)', joinedDate: 'Feb 20, 2026' },
  { id: 'RID-505', name: 'Robert Zane', status: 'offline', rating: 4.7, totalEarnings: 3200.00, vehicle: 'Bike (Hero)', joinedDate: 'Mar 15, 2026' },
];

const Riders: React.FC = () => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const columns = [
    { header: 'Rider ID', accessor: 'id' as keyof Rider },
    { 
      header: 'Rider Name', 
      accessor: (rider: Rider) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs">
            {rider.name.charAt(0)}
          </div>
          <span>{rider.name}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (rider: Rider) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          rider.status === 'active' && "bg-green-500/10 text-green-500",
          rider.status === 'pending' && "bg-amber-500/10 text-amber-500",
          rider.status === 'blocked' && "bg-destructive/10 text-destructive",
          rider.status === 'offline' && "bg-muted text-muted-foreground",
        )}>
          {rider.status}
        </span>
      )
    },
    { 
      header: 'Rating', 
      accessor: (rider: Rider) => (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="font-mono">{rider.rating || 'N/A'}</span>
        </div>
      )
    },
    { header: 'Earnings', accessor: (rider: Rider) => `$${rider.totalEarnings.toLocaleString()}` },
    { header: 'Vehicle', accessor: 'vehicle' as keyof Rider },
    { header: 'Joined', accessor: 'joinedDate' as keyof Rider },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Rider Management</h1>
          <p className="text-muted-foreground mt-1">Onboard, verify, and monitor your fleet of drivers.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
            <UserSquare2 className="w-4 h-4" />
            Add New Rider
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Riders', value: '2,450', color: 'primary' },
          { label: 'Pending Verification', value: '18', color: 'amber-500' },
          { label: 'Blocked/Suspended', value: '12', color: 'destructive' },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 rounded-xl border-l-4" style={{ borderColor: `var(--color-${stat.color})` }}>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass p-4 rounded-xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or vehicle..." 
            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <button className="p-2 bg-muted rounded-lg border border-border">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={mockRiders} 
        rowIdKey="id"
        onRowClick={(rider) => setExpandedRowId(expandedRowId === rider.id ? null : rider.id)}
        expandedRowId={expandedRowId || undefined}
        expandedRowRender={(rider) => (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-4">Document Verification</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Driving License', status: 'verified', date: 'Jan 12, 2026' },
                    { label: 'Vehicle Registration', status: 'verified', date: 'Jan 12, 2026' },
                    { label: 'Insurance Policy', status: rider.status === 'pending' ? 'pending' : 'verified', date: 'Jan 12, 2026' },
                    { label: 'Background Check', status: rider.status === 'pending' ? 'processing' : 'verified', date: 'Jan 13, 2026' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{doc.label}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.date}</p>
                        </div>
                      </div>
                      {doc.status === 'verified' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : doc.status === 'pending' ? (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-4">Live Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Acceptance Rate</p>
                    <p className="text-xl font-bold text-foreground mt-1">94%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Cancellation</p>
                    <p className="text-xl font-bold text-destructive mt-1">2.4%</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-border h-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#f5b800 1px, transparent 0)', backgroundSize: '15px 15px' }} />
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Current Location</span>
                  </div>
                  <p className="text-xs text-foreground mt-1 font-mono">40.7128° N, 74.0060° W</p>
                  <p className="text-[10px] text-muted-foreground">Downtown Manhattan, NY</p>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground mb-4">Admin Actions</h4>
              <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                APPROVE VERIFICATION
              </button>
              <button className="w-full bg-muted text-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-muted/80 transition-colors border border-border">
                MESSAGE RIDER
              </button>
              <button className="w-full bg-destructive/10 text-destructive border border-destructive/20 py-2.5 rounded-lg text-xs font-bold hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                SUSPEND ACCOUNT
              </button>
              
              <div className="pt-4 border-t border-border">
                 <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2 tracking-widest">Fraud Flags</p>
                 <div className="flex items-center gap-2 text-xs text-amber-500 font-bold bg-amber-500/10 p-2 rounded border border-amber-500/20">
                   <AlertCircle className="w-4 h-4" />
                   Potential GPS Spoofing detected 2 days ago
                 </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Riders;
