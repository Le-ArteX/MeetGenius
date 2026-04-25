import Nav, { type NavProps } from "../../components/nav/nav";
import Hero, { type HeroProps } from "../../components/hero/hero";
import Feature, { type FeatureProps } from "../../components/features/feature";
import Price, { type PriceProps } from "../../components/price/price";
import About, { type AboutProps } from "../../components/about/about";
import Contact from "../../components/contact/contact";
import Footer from "../../components/footer/footer";



const navProps: NavProps = {
  logoText: "MeetGenius",
  logoHref: "/landingPage",
  links: [
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#price" },
    { label: "Contact", href: "#contact" },
  ],
  signInLabel: "Sign in",
  signInHref: "/login",
  ctaLabel: "Get started",
  ctaHref: "/register",
};

const heroProps: HeroProps = {
  heading: "MeetGenius",
  headingHighlight: "Turn messy meetings",
  subheading: "Into clear actions. Paste transcript. Get AI summary, action items & follow-up email.",
  primaryHref: {
    label: "Start Free",
    href: "/register",
  },
  secondaryHref: {
    label: "How It Works",
    href: "#features",
  },
};

const featureProps: FeatureProps = {
  title: "Features",
  titleHighlight: "Everything you need",
  subheading: "Power up your meetings with AI-driven insights and automated workflows.",
  features: [
    {
      title: "AI Summaries",
      description: "Get concise summaries of your meetings automatically, saving hours of manual note-taking.",
    },
    {
      title: "Action Items",
      description: "Never miss a follow-up task with AI-extracted action items and deadlines.",
    },
    {
      title: "Email Automation",
      description: "Send professional follow-up emails to all participants with one click.",
    },
  ],
};

const pricingProps: PriceProps = {

  plans: [
    {
      name: "Free",
      price: "$0",
      period: "monthly",
      features: ["5 notes/month", "1 workspace"],
      ctaLabel: "Get Started",
      ctaHref: "/register",
      variant: "light",
    },
    {
      name: "Pro",
      price: "$12",
      period: "monthly",
      features: ["Unlimited notes", "Team workspaces", "PDF export"],
      ctaLabel: "Go Pro",
      ctaHref: "/register",
      variant: "dark",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "$144",
      period: "annually",
      features: ["Unlimited notes", "Team workspaces", "PDF export", "Unlimited Transcription", "File Uploads"],
      ctaLabel: "Go Enterprise",
      ctaHref: "/register",
      variant: "dark",
      isPopular: false,
    },
  ],
};

const aboutProps: AboutProps = {
  title: "We're reimagining how",
  titleHighlight: "work gets documented.",
  description: "MeetGenius was born out of the frustration of endless meetings and the lost knowledge that follows them. We believe your time is too valuable to spend on manual note-taking.",
  mission: "Our mission is to empower teams to focus on the conversation, not the keyboard. By leveraging advanced AI, we capture the essence of every meeting, ensuring every insight is preserved and every action item is clear.",
  stats: [
    { label: "Users", value: "10k+" },
    { label: "Notes Created", value: "500k+" },
    { label: "Time Saved", value: "1M hrs" },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav {...navProps} />
      <Hero {...heroProps} />
      <About {...aboutProps} />
      <Feature {...featureProps} />
      <Price {...pricingProps} />
      <Contact />
      <Footer />
    </div>
  );
}