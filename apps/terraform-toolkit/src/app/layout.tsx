'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession, signOut } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

function LogOutButton() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="absolute top-4 right-8 z-50">
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-white/80 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-lg shadow transition"
      >
        Log out
      </button>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ApolloProvider client={client}>
            <LogOutButton />
            <Toaster position="top-right" reverseOrder={false} /> 
            {children}
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
