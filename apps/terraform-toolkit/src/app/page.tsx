'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import Image from "next/image"
import { useEffect } from "react";

export default function LandingPage() {

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) { // Testing some redirect stuff (WORKS)
      console.log(session);
      router.push('/options');
      // signOut();
      // console.log("Updated session: ", session);
    } else {
      console.log("Yikes");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">
        Cloud Migration Toolkit
      </h1>
      <p className="text-lg text-gray-400 text-center max-w-2xl mb-10">
        Deploy and manage Google Cloud (for now, more options on the way!) infrastructure visually and securely using Terraform.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => signIn('google')}
          className="flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition"
        >
          <Image src="/assets/google-logo.png" alt="Google" width={20} height={20} />
          Sign In with Google
        </button>

        <button
          onClick={() => signIn('google', { prompt: 'consent' })}
          className="flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition"
        >
          <Image src="/assets/google-logo.png" alt="Google" width={20} height={20} />
          Register with Google
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}