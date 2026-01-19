import React from "react";
import HeroCarousel from "@/components/home/hero";
import { HomeSection } from "@/components/home/home-section";
import { ProductSection } from "@/components/home/product-section";
import { LevelSection } from "@/components/home/level-section";
import MainLayout from "./layouts/main-layout";
export default function Home() {
  return (
    <MainLayout>
      <HeroCarousel />
      <HomeSection />
      <ProductSection />
      <LevelSection />
    </MainLayout>
  );
}
