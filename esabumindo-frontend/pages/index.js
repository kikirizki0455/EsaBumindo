import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HeroCarousel from "@/components//home/hero";
import { HomeSection } from "@/components/home/home-section";
import { ProductSection } from "@/components/home/product-section";
import { LevelSection } from "@/components/home/level-section";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <HomeSection />
      <ProductSection />
      <LevelSection />
    </div>
  );
}
