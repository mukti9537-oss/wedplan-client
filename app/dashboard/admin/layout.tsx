import { requireRole } from '@/lib/core/server';
import React from 'react';

export const dynamic = "force-dynamic";

const AdminDashboardLayout = async ({children}: {children: React.ReactNode}) => {
    await requireRole('admin');
    return children; 
};

export default AdminDashboardLayout;