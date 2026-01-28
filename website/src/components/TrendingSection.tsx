import { TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MangaCard from "./MangaCard";

import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import mangaCover5 from "@/assets/manga-cover-5.jpg";
import mangaCover6 from "@/assets/manga-cover-6.jpg";

const trendingManga = [
  {
    id: 1,
    title: "Demon Slayer: Kimetsu no Yaiba",
    coverUrl: mangaCover1,
    rating: 4.9,
    chapters: 205,
    genre: "Action",
    isNew: true,
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    coverUrl: mangaCover2,
    rating: 4.8,
    chapters: 236,
    genre: "Supernatural",
    isNew: false,
  },
  {
    id: 3,
    title: "One Piece",
    coverUrl: mangaCover3,
    rating: 4.9,
    chapters: 1095,
    genre: "Adventure",
    isNew: true,
  },
  {
    id: 4,
    title: "Attack on Titan",
    coverUrl: mangaCover4,
    rating: 4.9,
    chapters: 139,
    genre: "Drama",
    isNew: false,
  },
  {
    id: 5,
    title: "My Hero Academia",
    coverUrl: mangaCover5,
    rating: 4.7,
    chapters: 410,
    genre: "Action",
    isNew: true,
  },
  {
    id: 6,
    title: "Chainsaw Man",
    coverUrl: mangaCover6,
    rating: 4.8,
    chapters: 145,
    genre: "Horror",
    isNew: false,
  },
];

const TrendingSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Trending Now
              </h2>
              <p className="text-muted-foreground text-sm">Most popular this week</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2">
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {trendingManga.map((manga, index) => (
            <div
              key={manga.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MangaCard {...manga} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
