import Navbar from "@/components/main-components/homePage/Navbar";
import Hero from "@/components/main-components/homePage/Hero";
import Services from "@/components/main-components/homePage/Services";
import Mission from "@/components/main-components/homePage/Mission";
import CaseStudies from "@/components/main-components/homePage/CaseStudies";
import HowWeWork from "@/components/main-components/homePage/Homework";
import Testimonial from "@/components/main-components/homePage/Testimonial";
import WhyChooseUs from "@/components/main-components/homePage/Whyus";
import Team from "@/components/main-components/homePage/Team";
import FAQ from "@/components/main-components/homePage/Faq";
import CTA from "@/components/main-components/homePage/Cta";
import Footer from "@/components/main-components/homePage/Footer";
export default function App() {
  return (
    <div
      style={{ backgroundColor: "var(--color-100)" }}
      className="min-h-screen"
    >
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Mission />
        <CaseStudies />
        <HowWeWork />
        <Testimonial />
        <WhyChooseUs />
        <Team />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
