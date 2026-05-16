import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  UserSquare2, 
  Wallet, 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  MessageSquare, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MapPin, label: 'Rides', path: '/rides' },
  { icon: UserSquare2, label: 'Riders', path: '/riders' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Wallet, label: 'Payments', path: '/payments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: ShieldAlert, label: 'Fraud', path: '/fraud' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: MessageSquare, label: 'Support', path: '/support' },
  { icon: Activity, label: 'Monitoring', path: '/monitoring' },
  { icon: Settings, label: 'Admin', path: '/admin' },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <aside 
      className={cn(
        "glass h-full transition-all duration-300 ease-in-out flex flex-col z-50",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center justify-between border-b border-border">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Easy Ride</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold">E</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
              isActive 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", !sidebarOpen && "mx-auto")} />
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
