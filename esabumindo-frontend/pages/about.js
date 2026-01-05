import React, { useState, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import CompanyProfil from "@/components/about/company-profil";
import Founder from "@/components/about/founder";
import History from "@/components/about/history";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <div>
      <HeroSection />
      <History />
      <CompanyProfil />
      <Founder />
    </div>
  );
}

