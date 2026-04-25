import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Promotions from "@/components/home/Promotions";
import SearchFilters from "@/components/home/SearchFilters";
import Services from "@/components/home/Services";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import UserReviews from "@/components/home/UserReviews";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Promotions />
        <SearchFilters />
        <Services />
        <FeaturedLawyers />
        <UserReviews />
        <Testimonials />
        <BlogSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
