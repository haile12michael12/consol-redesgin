import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Award, Building2, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import city from "@/assets/consol-addis-ababa.webp.asset.json";
import { legacyUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "CONSOL — Construction Solutions PLC | Your Partner in Growth" },
    { name: "description", content: "Explore Construction Solutions PLC: construction and business management consultancy, professional training and certification in Addis Ababa, Ethiopia." },
    { property: "og:title", content: "CONSOL — Construction Solutions PLC" },
    { property: "og:description", content: "Building expertise. Strengthening organizations. Advancing the construction industry in Ethiopia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(city.url.startsWith("https://") ? [{ property: "og:image", content: city.url }, { name: "twitter:image", content: city.url }] : []),
  ] }),
  component: Index,
});

const expertise = [
  { number: "01", icon: Building2, title: "Management consultancy", description: "Construction and business management consultancy, grounded in the needs of organizations and the industry.", path: "/cm_consultancy.php", link: "Explore consultancy" },
  { number: "02", icon: GraduationCap, title: "Professional training", description: "Develop practical expertise in construction management, engineering software and project management.", path: "/cm_trainings.php", link: "Explore our training" },
  { number: "03", icon: Award, title: "Training & certification", description: "Discover our PMI® Authorized Training Partner and Autodesk® Authorized Training Center programs.", path: "/pmi_atp.php", link: "Explore programs" },
];

function Index() {
  return <main id="main-content">
    <section className="foundation-cover" aria-labelledby="company-title">
      <img className="cover-photo" src={city.url} alt="Addis Ababa skyline at night, from CONSOL’s existing website" width={1024} height={576} fetchPriority="high" />
      <div className="cover-shade" />
      <div className="site-container cover-content">
        <p className="eyebrow">CONSOL · Your partner in growth</p>
        <h1 id="company-title">Construction<br />Solutions<span>.</span></h1>
        <p className="cover-tagline">Building expertise. Strengthening organizations.<br className="hidden sm:block" /> Advancing the construction industry.</p>
        <p className="cover-description">Construction consultancy, professional training and certification.<br className="hidden sm:block" /> Connecting knowledge with practice in Ethiopia.</p>
        <div className="cover-actions"><Button asChild variant="gold"><a href={legacyUrl("/cm_consultancy.php")}>Explore our services<ArrowUpRight /></a></Button><Button asChild variant="heroOutline"><a href={legacyUrl("/cm_trainings.php")}>Discover our training<ArrowRight /></a></Button></div>
      </div>
      <div className="cover-bottom"><div className="site-container cover-bottom-inner"><div className="cover-disciplines"><span>Consultancy</span><span>Professional training</span><span>Certification</span></div><span className="cover-caption"><MapPin size={12} />Addis Ababa, Ethiopia</span></div></div>
    </section>
    <section className="expertise-section site-container" aria-labelledby="expertise-title">
      <div className="section-heading"><div><p className="eyebrow">Knowledge. Practice. Progress.</p><h2 id="expertise-title">Expertise that moves you forward.</h2></div><p>Supporting the people and organizations shaping the construction industry through consultancy and professional development.</p></div>
      <div className="expertise-grid">{expertise.map(item => <article key={item.number} className="expertise-item"><div className="expertise-top"><item.icon className="expertise-icon" /><span className="expertise-number">{item.number}</span></div><h3>{item.title}</h3><p>{item.description}</p><Button asChild variant="link"><a href={legacyUrl(item.path)}>{item.link}<ArrowUpRight /></a></Button></article>)}</div>
    </section>
    <section className="contact-band"><div className="site-container contact-band-inner"><div><h2>Let’s build what comes next.</h2><p>Talk to CONSOL about your organization’s next step.</p></div><Button asChild><a href={legacyUrl("/contact.php")}>Start a conversation<ArrowUpRight /></a></Button></div></section>
  </main>;
}
