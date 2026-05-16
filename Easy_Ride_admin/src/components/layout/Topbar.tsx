import React from 'react';
import { Search, Bell, AlertTriangle, User, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setEmergencyMode } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const Topbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { emergencyMode } = useAppSelector((state) => state.ui);

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md px-6 flex items-center justify-between z-40">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Global search (rides, users, riders)..." 
            className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-500">System Online</span>
        </div>

        <button 
          onClick={() => dispatch(setEmergencyMode(!emergencyMode))}
          className={cn(
            "p-2 rounded-lg transition-colors relative",
            emergencyMode ? "bg-destructive text-destructive-foreground" : "hover:bg-muted text-muted-foreground"
          )}
        >
          <AlertTriangle className="w-5 h-5" />
          {emergencyMode && <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>}
        </button>

        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
