import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Ban, 
  CreditCard, 
  History, 
  MessageSquare,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { cn } from '../utils/cn';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  totalRides: number;
  walletBalance: number;
  joinedDate: string;
}

const mockUsers: User[] = [
  { id: 'USR-1001', name: 'Alex Johnson', email: 'alex.j@example.com', status: 'active', totalRides: 45, walletBalance: 120.50, joinedDate: 'Jan 10, 2026' },
  { id: 'USR-1002', name: 'Sarah Smith', email: 'sarah.s@example.com', status: 'active', totalRides: 12, walletBalance: 15.00, joinedDate: 'May 02, 2026' },
  { id: 'USR-1003', name: 'Michael Brown', email: 'mike.b@example.com', status: 'suspended', totalRides: 89, walletBalance: -5.20, joinedDate: 'Dec 15, 2025' },
  { id: 'USR-1004', name: 'Emily Davis', email: 'emily.d@example.com', status: 'active', totalRides: 5, walletBalance: 50.00, joinedDate: 'Apr 20, 2026' },
  { id: 'USR-1005', name: 'David Wilson', email: 'david.w@example.com', status: 'pending', totalRides: 0, walletBalance: 0, joinedDate: 'May 15, 2026' },
];

const Users: React.FC = () => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const columns = [
    { header: 'User ID', accessor: 'id' as keyof User },
    { 
      header: 'User', 
      accessor: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-foreground leading-none">{user.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (user: User) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          user.status === 'active' && "bg-green-500/10 text-green-500",
          user.status === 'suspended' && "bg-destructive/10 text-destructive",
          user.status === 'pending' && "bg-amber-500/10 text-amber-500",
        )}>
          {user.status}
        </span>
      )
    },
    { header: 'Total Rides', accessor: 'totalRides' as keyof User, className: "text-center" },
    { 
      header: 'Wallet', 
      accessor: (user: User) => (
        <span className={cn(
          "font-mono font-bold",
          user.walletBalance < 0 ? "text-destructive" : "text-foreground"
        )}>
          ${user.walletBalance.toFixed(2)}
        </span>
      )
    },
    { header: 'Joined', accessor: 'joinedDate' as keyof User },
    { 
      header: '', 
      accessor: () => (
        <button className="p-1 hover:bg-muted rounded transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
      className: "w-10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Oversee customer profiles, ride history, and wallet operations.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-muted border border-border rounded-lg p-1 flex">
             <button className="px-3 py-1.5 text-xs font-bold rounded bg-background text-foreground shadow-sm">All Users</button>
             <button className="px-3 py-1.5 text-xs font-bold rounded text-muted-foreground hover:text-foreground transition-colors">Flagged</button>
           </div>
        </div>
      </div>

      <div className="glass p-4 rounded-xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border text-sm font-medium">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={mockUsers} 
        rowIdKey="id"
        onRowClick={(user) => setExpandedRowId(expandedRowId === user.id ? null : user.id)}
        expandedRowId={expandedRowId || undefined}
        expandedRowRender={(user) => (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="glass p-5 rounded-xl border border-border/50">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Account Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Lifetime Spend:</span>
                  <span className="text-foreground">$1,240.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Cancellation Rate:</span>
                  <span className="text-destructive">5.2%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Support Tickets:</span>
                  <span className="text-foreground">2 Active</span>
                </div>
                <div className="pt-3 border-t border-border/50">
                   <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                     <ShieldCheck className="w-4 h-4" />
                     ID Verified
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass p-5 rounded-xl border border-border/50">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Ride History</h4>
                 <button className="text-[10px] text-primary font-bold">View Full Log</button>
               </div>
               <div className="space-y-2">
                 {[
                   { id: 'RD-9901', destination: 'JFK Airport', fare: 45.20, date: '2h ago' },
                   { id: 'RD-9854', destination: 'Central Park', fare: 12.00, date: '1 day ago' },
                   { id: 'RD-9812', destination: 'Brooklyn Bridge', fare: 18.50, date: '3 days ago' },
                 ].map(ride => (
                   <div key={ride.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded border border-transparent hover:border-border transition-all">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                         <History className="w-4 h-4 text-muted-foreground" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-foreground">{ride.destination}</p>
                         <p className="text-[10px] text-muted-foreground">{ride.id} • {ride.date}</p>
                       </div>
                     </div>
                     <span className="text-xs font-bold text-foreground">${ride.fare.toFixed(2)}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Actions</h4>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                ADJUST WALLET
              </button>
              <button className="w-full bg-muted text-foreground py-2 rounded-lg text-xs font-bold hover:bg-muted/80 transition-colors border border-border flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                SEND MESSAGE
              </button>
              <button className="w-full bg-destructive/10 text-destructive border border-destructive/20 py-2 rounded-lg text-xs font-bold hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" />
                SUSPEND USER
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Users;
