import AgeGate from "@/components/AgeGate";
import ComplianceTicker from "@/components/ComplianceTicker";
import Navbar from "@/components/Navbar";
import HeroScrollStage from "@/components/hero/HeroScrollStage";
import TrustRow from "@/components/TrustRow";
import CategoryTiles from "@/components/CategoryTiles";
import OffersRail from "@/components/OffersRail";
import BrandsGrid from "@/components/BrandsGrid";
import BestsellersRail from "@/components/BestsellersRail";
import StoryBand from "@/components/StoryBand";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

// Section order follows the shopping intent: the hero introduces the product,
// trust removes the first objection, categories orient you, the flash-sale
// converts, then brands/bestsellers are for browsing.
export default function Home() {
  return (
    <>
      <AgeGate />
      <ComplianceTicker />
      <Navbar />
      <main className="flex-1">
        <HeroScrollStage />
        <TrustRow />
        <CategoryTiles />
        <OffersRail />
        <BrandsGrid />
        <BestsellersRail />
        <StoryBand />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
