import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import featuredManga from "@/assets/featured-manga.jpg";

const latestUpdates = [
  {
    id: 1,
    title: "Solo Leveling",
    chapter: "Chapter 179",
    time: "2 hours ago",
    coverUrl: featuredManga,
  },
  {
    id: 2,
    title: "Demon Slayer",
    chapter: "Chapter 205",
    time: "5 hours ago",
    coverUrl: mangaCover1,
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    chapter: "Chapter 278",
    time: "8 hours ago",
    coverUrl: mangaCover2,
  },
  {
    id: 4,
    title: "One Piece",
    chapter: "Chapter 1095",
    time: "12 hours ago",
    coverUrl: mangaCover3,
  },
  {
    id: 5,
    title: "Attack on Titan",
    chapter: "Chapter 139",
    time: "1 day ago",
    coverUrl: mangaCover4,
  },
];

const LatestUpdatesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Latest Updates List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold">
                  Latest Updates
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                See All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {latestUpdates.map((manga, index) => (
                <div
                  key={manga.id}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-border/50 transition-all duration-200 cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-12 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors">
                      {manga.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{manga.chapter}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {manga.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold mb-6">Site Statistics</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Manga</span>
                <span className="font-display font-bold text-xl">15,432</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Chapters</span>
                <span className="font-display font-bold text-xl">1.2M</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Readers</span>
                <span className="font-display font-bold text-xl">5.8M</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Daily Updates</span>
                <span className="font-display font-bold text-xl text-primary">250+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestUpdatesSection;
