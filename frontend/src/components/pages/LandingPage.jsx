import Navbar from "../layouts/Navbar";
import Hero from "../layouts/landing/Hero";
import WhyUs from "../layouts/landing/WhyUs";
import Pricing from "../layouts/landing/Pricing";
import ContactUs from "../layouts/landing/ContactUs";
import FAQ from "../layouts/landing/FAQ";
import Footer from "../layouts/Footer";

import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    document.title =
      "RentStreet | Find Your Perfect Room in Sogod, Southern Leyte";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Find verified boarding houses, dormitories, and rooms near Southern Leyte State University. Interactive map search, trust scores, and offline access for students."
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyUs />
      <Pricing />
      <FAQ />
      <ContactUs />
      <Footer />
    </div>
  );
}
