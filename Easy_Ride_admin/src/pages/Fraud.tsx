import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Share2, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Gavel,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Incident {
  id: string;
  type: string;
  user: string;
  rider: string;
  severity: 'critical' | 'warning' | 'low';
  time: string;
  status: 'pending' | 'investigating' | 'resolved';
}

const mockIncidents: Incident[] = [
  { id: 'FR-102', type: 'GPS Spoofing', user: 'Mark T.', rider: 'John D.', severity: 'critical', time: '2m ago', status: 'pending' },
  { id: 'FR-103', type: 'Multiple Account', user: 'Sarah W.', rider: 'Elena G.', severity: 'warning', time: '15m ago', status: 'investigating' },
  { id: 'FR-104', type: 'Card Fraud', user: 'Tom B.', rider: 'Harvey S.', severity: 'critical', time: '1h ago', status: 'pending' },
  { id: 'FR-105', type: 'Promo Abuse', user: 'Emma L.', rider: 'Mike R.', severity: 'low', time: '3h ago', status: 'resolved' },
];

const Fraud: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(mockIncidents[0]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Security & Integrity</h1>
          <p className="text-muted-foreground mt-1">Real-time fraud detection and incident response.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Active Alerts</p>
            <p className="text-2xl font-bold text-destructive">42</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Blocked Today</p>
            <p className="text-2xl font-bold text-foreground">156</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Pane: Incident List */}
        <div className="w-80 flex flex-col glass rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search incidents..." 
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-xs"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockIncidents.map((incident) => (
              <div 
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={cn(
                  "p-4 border-b border-border/50 cursor-pointer transition-colors",
                  selectedIncident.id === incident.id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/30"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    incident.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                    incident.severity === 'warning' ? "bg-amber-500/20 text-amber-500" : "bg-blue-500/20 text-blue-500"
                  )}>
                    {incident.severity}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{incident.time}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{incident.type}</p>
                <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
                  <span>{incident.id}</span>
                  <span className="capitalize">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Pane: Investigation */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="glass p-6 rounded-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedIncident.type}</h3>
                  <p className="text-sm text-muted-foreground">Incident {selectedIncident.id} | Reported by Automated-Heuristics-V4</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block p-4 rounded-full border-4 border-destructive/30 text-destructive font-mono font-bold text-xl">
                  85/100
                </div>
                <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">Risk Score</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold">User Details</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{selectedIncident.user}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Account Age:</span> <span className="text-foreground">14 Days</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Device ID:</span> <span className="text-foreground font-mono">DVC-8829-AX</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">App Version:</span> <span className="text-foreground">2.4.1 (Android)</span></div>
                  </div>
               </div>
               <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold">Rider Details</h4>
                  </div>
                   <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{selectedIncident.rider}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Rating:</span> <span className="text-foreground">4.2 ⭐</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">License:</span> <span className="text-foreground font-mono">LIC-TX-1102</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fleet Status:</span> <span className="text-foreground">Bronze</span></div>
                  </div>
               </div>
            </div>

            <div className="h-64 bg-[#0a0a0a] rounded-xl border border-border relative overflow-hidden group">
              <div className="p-3 bg-background/80 backdrop-blur-md border-b border-border flex items-center gap-2 absolute top-0 left-0 right-0 z-10">
                <MapIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Evidence Map: GPS Jump Detected</span>
              </div>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e2024 1px, transparent 0)', backgroundSize: '30px 30px' }} />
              <div className="absolute inset-0 flex items-center justify-center pt-10">
                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute" />
                  <div className="w-4 h-4 bg-primary rounded-full relative" />
                  <div className="h-px w-32 bg-destructive border-t-2 border-dashed border-destructive absolute top-2 left-4" />
                  <div className="w-4 h-4 bg-destructive rounded-full absolute top-0 left-36 animate-pulse" />
                  <p className="absolute -bottom-10 left-0 text-[10px] text-muted-foreground whitespace-nowrap">Actual: 40.7128° N, 74.0060° W</p>
                  <p className="absolute -top-10 left-36 text-[10px] text-destructive font-bold whitespace-nowrap">Spoofed: 34.0522° N, 118.2437° W</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-primary">Relationship Graph</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Found 3 other accounts sharing the same Credit Card ending in **4421.</p>
              <div className="flex items-center gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">User_{i}02</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Actions */}
        <div className="w-80 glass rounded-xl flex flex-col p-6 gap-6">
          <h4 className="text-sm font-bold text-foreground">Incident Actions</h4>
          
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Investigation Notes</p>
            <textarea 
              placeholder="Enter investigation details..."
              className="w-full bg-background border border-border rounded-lg p-3 text-xs h-32 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <button className="w-full bg-destructive text-destructive-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              SUSPEND ACCOUNTS
            </button>
            <button className="w-full bg-muted text-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-muted/80 transition-colors border border-border">
              INVALIDATE RIDE
            </button>
            <button className="w-full bg-green-500 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              MARK AS SAFE
            </button>
            <button className="w-full bg-muted text-foreground py-2.5 rounded-lg text-xs font-bold hover:bg-muted/80 transition-colors border border-border flex items-center justify-center gap-2">
              <Gavel className="w-4 h-4" />
              ESCALATE TO LEGAL
            </button>
          </div>

          <div className="mt-auto p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Automated Rule</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Ruleset V4.2 active: High-risk GPS jumps are auto-flagged and pending intervention.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck: React.FC<{ className?: string }> = ({ className }) => <CheckCircle2 className={className} />;

export default Fraud;
