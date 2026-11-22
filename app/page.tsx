import Banner from "@/components/Banner";
import { FeaturedServices } from "@/components/FeaturedServices";
import { ServiceCategories } from "@/components/ServiceCategories";
import { WhyChooseWedPlan } from "@/components/WhyChooseWedPlan";
import { HowItWorks } from "@/components/HowItWorks";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-[#fffaf7]">
      <Banner />

      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseWedPlan />
      <HowItWorks />
    </div>
  );
}
