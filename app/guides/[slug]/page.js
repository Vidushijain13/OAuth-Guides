import { notFound } from "next/navigation";
import GuideView from "@/components/GuideView";
import CopyLink from "@/components/CopyLink";
import { getLibrary, getGuide } from "@/lib/library";

export const generateStaticParams = () => getLibrary().map((g) => ({ slug: g.slug }));
export default async function Page({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  return (<><div className="bar"><a href="/">← All guides</a><CopyLink /></div><GuideView g={g} /></>);
}
