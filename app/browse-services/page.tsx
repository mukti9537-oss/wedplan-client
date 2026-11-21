import { getService } from '@/lib/actions/service';
import React from 'react';

const BrowseServicesPage = async ({searchParams} : { searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string, string>) 
    const query = urlSearch.toString();

    console.log('search params:', query);
    const service = await getService(query);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">
        Browse Services
        <ul>
            {service.map((service: Awaited<ReturnType<typeof getService>>[number]) => (
                <li key={service._id}>{service.serviceName}</li>
            ))}
        </ul>
      </h1>
    </section>
  );
};

export default BrowseServicesPage;