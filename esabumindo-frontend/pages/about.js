import React, { useState, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import CompanyProfil from "@/components/about/company-profil";
import Founder from "@/components/about/founder";
import History from "@/components/about/history";
import MainLayout from "./layouts/main-layout";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <MainLayout>
      <HeroSection />
      <History />
      <CompanyProfil />
      <Founder />
    </MainLayout>
  );
}
