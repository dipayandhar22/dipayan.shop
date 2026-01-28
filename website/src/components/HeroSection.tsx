import { Play, BookMarked, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import featuredMangaCover from "@/assets/featured-manga.jpg";

interface FeaturedManga {
  title: string;
  description: string;
  rating: number;
  chapters: number;
  genre: string[];
}

const featuredManga: FeaturedManga = {
  title: "Solo Leveling",
  description: "In a world where hunters with supernatural powers battle deadly monsters, Sung Jin-Woo is the weakest of them all. But after a near-death experience, he gains a unique power that allows him to level up without limit.",
  rating: 4.9,
  chapters: 179,
  genre: ["Action", "Fantasy", "Adventure"],
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="genre-badge">{featuredManga.genre[0]}</span>
              <span className="genre-badge">{featuredManga.genre[1]}</span>
              <span className="genre-badge">{featuredManga.genre[2]}</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
              {featuredManga.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-medium text-foreground">{featuredManga.rating}</span>
              </div>
              <span>•</span>
              <span>{featuredManga.chapters} Chapters</span>
              <span>•</span>
              <span>Ongoing</span>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {featuredManga.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Button size="lg" className="gap-2 font-semibold">
                <Play className="w-5 h-5" />
                Start Reading
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookMarked className="w-5 h-5" />
                Add to Library
              </Button>
            </div>
          </div>

          {/* Featured Manga Cover */}
          <div className="relative animate-fade-up animation-delay-200">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-2xl" />
              
              {/* Cover Image */}
              <div className="relative h-full rounded-2xl overflow-hidden manga-card">
                <img
                  src={featuredMangaCover}
                  alt={featuredManga.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -right-4 top-1/4 glass rounded-xl p-4 animate-fade-up animation-delay-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-1/3 glass rounded-xl p-4 animate-fade-up animation-delay-500">
                <div className="text-center">
                  <div className="text-2xl font-bold">2.1M</div>
                  <div className="text-xs text-muted-foreground">Readers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
