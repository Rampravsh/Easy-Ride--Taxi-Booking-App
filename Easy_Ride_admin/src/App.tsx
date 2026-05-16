import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Rides from './pages/Rides';
import Fraud from './pages/Fraud';
import Analytics from './pages/Analytics';
import Riders from './pages/Riders';
import Users from './pages/Users';
import Monitoring from './pages/Monitoring';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="rides" element={<Rides />} />
              <Route path="riders" element={<Riders />} />
              <Route path="users" element={<Users />} />
              <Route path="payments" element={<div>Payments & Wallet</div>} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="fraud" element={<Fraud />} />
              <Route path="notifications" element={<div>Notifications Center</div>} />
              <Route path="support" element={<div>Support Console</div>} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="admin" element={<div>Admin Management</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
