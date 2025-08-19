"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Circle,
  Loader,
  Loader2,
  Loader2Icon,
  LoaderCircle,
  LoaderCircleIcon,
} from "lucide-react";

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/on-boarding";

  useEffect(() => {
    signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-screen new-gradient text-black">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mb-6 animate-pulse"
      />

      <h1 className="text-2xl font-bold mb-4">
        Taking you closer to your customers...
      </h1>
      <p className="text-lg">
        We're optimizing PiBi GTM Engine to accelerate your growth...
      </p>
      <p className="text-lg mt-4">
        Hang tight while we connect you via Google!
      </p>

      <div className="mt-10">
        <div className="relative w-16 h-16">
          <LoaderCircle className="absolute inset-0  text-blue-700 h-16 w-16 animate-spin" />
          <LoaderCircle className="absolute inset-4 text-gray-700 h-8 w-8 animate-spin-reverse" />
        </div>
      </div>
    </div>
  );
}
