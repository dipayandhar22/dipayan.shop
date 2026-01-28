import { Star, BookOpen } from "lucide-react";

interface MangaCardProps {
  title: string;
  coverUrl: string;
  rating: number;
  chapters: number;
  genre: string;
  isNew?: boolean;
}

const MangaCard = ({ title, coverUrl, rating, chapters, genre, isNew }: MangaCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="manga-card aspect-[3/4] relative">
        {/* Cover Image */}
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="manga-card-overlay flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
              {genre}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{chapters} Ch</span>
            </div>
          </div>
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded">
              NEW
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 font-display font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>
    </div>
  );
};

export default MangaCard;
