'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

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
            <Toaster position="top-right" reverseOrder={false} /> 
            {children}
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
