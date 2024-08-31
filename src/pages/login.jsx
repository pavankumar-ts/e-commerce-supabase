import { LoginForm } from '@/components/LoginForm'
import Head from 'next/head'
import React from 'react'

const login = () => {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Our best-selling products and categories" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="h-screen  bg-primary w-full fixed top-0 z-50 flex items-center justify-center" >
                <div className="dark"  >
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export default login