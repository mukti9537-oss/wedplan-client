import React from 'react';

const Unauthorizedpage = () => {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div>
                <h1 className="text-3xl font-bold text-center mt-10">Unauthorized Access</h1>
                <p className="text-center mt-4">You do not have permission to view this page.</p>
            </div>
        </section>
    );
};

export default Unauthorizedpage;