import { Hero } from "@/components/sections/hero";
import { PlantStory } from "@/components/sections/plant-story";
import { Features } from "@/components/sections/features";

export default function Home() {
  return (
    <main>
      <Hero />
      <PlantStory />
      <Features />
    </main>
  );
}