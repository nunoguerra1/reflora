import { Hero } from "@/components/sections/hero";
import { PlantStory } from "@/components/sections/plant-story";
import { Features } from "@/components/sections/features";
import { MapTeaser } from "@/components/sections/map-teaser";

export default function Home() {
  return (
    <main>
      <Hero />
      <PlantStory />
      <Features />
      <MapTeaser />
    </main>
  );
}