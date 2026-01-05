import React from "react";
import HeroCarousel from "@/components/home/hero";
import { HomeSection } from "@/components/home/home-section";
import { ProductSection } from "@/components/home/product-section";
import { LevelSection } from "@/components/home/level-section";
export default function Home() {
  return (
    <>
      <HeroCarousel />
      <HomeSection />
      <ProductSection />
      <LevelSection />
    </>
  );
}
