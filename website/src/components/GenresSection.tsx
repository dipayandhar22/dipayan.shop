import { Sparkles, Swords, Heart, Ghost, Laugh, Wand2, Trophy, Users } from "lucide-react";

const genres = [
  { name: "Action", icon: Swords, color: "from-red-500/20 to-orange-500/20", count: 2453 },
  { name: "Romance", icon: Heart, color: "from-pink-500/20 to-rose-500/20", count: 1832 },
  { name: "Fantasy", icon: Wand2, color: "from-purple-500/20 to-indigo-500/20", count: 1654 },
  { name: "Horror", icon: Ghost, color: "from-gray-500/20 to-slate-500/20", count: 987 },
  { name: "Comedy", icon: Laugh, color: "from-yellow-500/20 to-amber-500/20", count: 1432 },
  { name: "Sports", icon: Trophy, color: "from-green-500/20 to-emerald-500/20", count: 567 },
  { name: "Slice of Life", icon: Users, color: "from-blue-500/20 to-cyan-500/20", count: 1123 },
  { name: "Supernatural", icon: Sparkles, color: "from-violet-500/20 to-purple-500/20", count: 876 },
];

const GenresSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Browse by Genre
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore thousands of manga across different genres
          </p>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <div
              key={genre.name}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`relative p-6 rounded-xl bg-gradient-to-br ${genre.color} border border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/30`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-background/50 group-hover:bg-primary/20 transition-colors">
                    <genre.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {genre.count.toLocaleString()} titles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenresSection;
