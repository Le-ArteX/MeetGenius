"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./(auth)/landingPage/page";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  return <LandingPage />;
}
