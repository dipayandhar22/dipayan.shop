import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { demoContent } from "../data/demoData";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold">{demoContent.title}</h1>
        <p className="mt-4">{demoContent.subtitle}</p>
      </main>
      <Footer />
    </>
  );
}