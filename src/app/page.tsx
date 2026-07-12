import AgeGate from "@/components/AgeGate";
import ComplianceTicker from "@/components/ComplianceTicker";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustRow from "@/components/TrustRow";
import BrandsGrid from "@/components/BrandsGrid";
import BestsellersRail from "@/components/BestsellersRail";
import StoryBand from "@/components/StoryBand";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AgeGate />
      <ComplianceTicker />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustRow />
        <BrandsGrid />
        <BestsellersRail />
        <StoryBand />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
