import React from 'react';
import { Map as MapIcon, Maximize2 } from 'lucide-react';

const RealtimeMap: React.FC = () => {
  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-[500px] group">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Operational Live Map</h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
        {/* Mock Map Grid */}
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#1e2024 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* Placeholder for actual Map implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Initializing Realtime Geospatial Engine...</p>
            <p className="text-xs text-muted-foreground/50 mt-1">Connecting to Ride-Lifecycle-Node-01</p>
          </div>
        </div>

        {/* Mock Map UI Elements */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-background/80 backdrop-blur-md border border-border p-2 rounded-lg text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-foreground">Active Ride</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-foreground">Online Rider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-foreground">Fraud Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMap;
