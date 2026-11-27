import { requireRole } from '@/lib/core/server';
import React from 'react';
export const dynamic = "force-dynamic";

const CustomerDashboardLayout = async ({children}: {children: React.ReactNode}) => {
    await requireRole('customer');
    return children; 
};

export default CustomerDashboardLayout;