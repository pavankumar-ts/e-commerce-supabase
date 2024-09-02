import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { Dashboard } from '@/components/Admin/Dashboard';
import { handleSignOut, useSignOut } from '@/utils/Logout';

export default function Page(user) {
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="User dashboard" />
            </Head>
            <div className="container mx-auto p-4 px-20">
                <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
                <p>Hello, {user.email}!</p>
                <button
                    onClick={handleSignOut}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign Out
                </button>
            </div>
            <Dashboard />
        </>
    );
}

