import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HeroCarousel from "@/components//home/hero";
import { HomeSection } from "@/components/home/home-section";
import { ProductSection } from "@/components/home/product-section";
import { LevelSection } from "@/components/home/level-section";
import MainLayout from "./layouts/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <div>
        <HeroCarousel />
        <HomeSection />
        <ProductSection />
        <LevelSection />
      </div>
    </MainLayout>
  );
}
