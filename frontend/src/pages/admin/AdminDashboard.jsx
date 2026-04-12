import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Home, Users, CreditCard, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navItems = [
    { path: '/admin', exact: true, label: 'Rooms', icon: <Home size={20} /> },
    { path: '/admin/students', exact: false, label: 'Students', icon: <Users size={20} /> },
    { path: '/admin/payments', exact: false, label: 'Payments', icon: <CreditCard size={20} /> },
    { path: '/admin/complaints', exact: false, label: 'Complaints', icon: <AlertCircle size={20} /> },
  ];

  return <DashboardLayout role="admin" navItems={navItems} />;
};

export default AdminDashboard;
