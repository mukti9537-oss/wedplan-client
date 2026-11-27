import { requireRole } from '@/lib/core/server';
import React from 'react';
export const dynamic = "force-dynamic";

const vendorDashboardLayout = async ({children}: {children: React.ReactNode}) => {
    await requireRole('vendor');
    return children; 
};

export default vendorDashboardLayout;