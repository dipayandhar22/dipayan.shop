import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import GenresSection from "@/components/GenresSection";
import LatestUpdatesSection from "@/components/LatestUpdatesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrendingSection />
        <GenresSection />
        <LatestUpdatesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
