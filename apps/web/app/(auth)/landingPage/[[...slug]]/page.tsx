import LandingPage from "../page";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page({ params }: Props) {
  // We can await params if we need the slug, but for now we just show the UI
  await params;
  
  return <LandingPage />;
}
