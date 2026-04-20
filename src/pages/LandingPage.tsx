import { motion } from "framer-motion";
import { PortfolioHeadingWaves } from "../components/PortfolioHeadingWaves";

interface Props {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="w-full max-w-3xl">
        <PortfolioHeadingWaves
          titleAs="h1"
          title="Automated Investing, Tailored to You."
          subtitle="Build wealth with our systematic allocation engine. Answer a few questions, and we'll build a personalized portfolio."
        />
      </div>
      <motion.button
        onClick={onGetStarted}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 px-12 py-4 bg-brand text-white font-semibold text-lg rounded-xl hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 cursor-pointer"
      >
        Get Started
      </motion.button>
      <p className="mt-5 text-sm text-muted">
        Account minimum $500 &nbsp;|&nbsp;{" "}
        <a href="#fees" className="underline hover:text-brand transition-colors">
          See Advisory Fees
        </a>
      </p>
    </motion.main>
  );
}
