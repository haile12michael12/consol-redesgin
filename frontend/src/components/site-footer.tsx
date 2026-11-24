import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { company, legacyUrl } from "@/lib/site";
import logo from "@/assets/consol-original-logo.webp.asset.json";

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-container footer-grid">
    <div className="footer-brand"><Link to="/" aria-label="CONSOL home"><img src={logo.url} alt="CONSOL" width={205} height={74} loading="lazy" /></Link><p>Your partner in growth.</p><span>Construction consultancy.<br />Professional training. Certification.</span></div>
    <div><h2>Explore CONSOL</h2><a href={legacyUrl("/about.php")}>About us<ArrowUpRight /></a><a href={legacyUrl("/index.php")}>Projects<ArrowUpRight /></a><a href={legacyUrl("/news.php")}>News & insights<ArrowUpRight /></a><a href={legacyUrl("/events.php")}>Events<ArrowUpRight /></a></div>
    <div><h2>Our expertise</h2><a href={legacyUrl("/cm_consultancy.php")}>Construction management</a><a href={legacyUrl("/bm_consultancy.php")}>Business management</a><a href={legacyUrl("/cm_trainings.php")}>Professional training</a><a href={legacyUrl("/pmi_atp.php")}>PMI® ATP</a><a href={legacyUrl("/autodesk_atc.php")}>Autodesk® ATC</a></div>
    <div className="footer-contact"><h2>Get in touch</h2><a href="tel:+251114700452"><Phone />{company.landline}</a><a href={`mailto:${company.email}`}><Mail /><span>{company.email}</span></a><p><MapPin /><span>{company.address}<br />Addis Ababa, Ethiopia</span></p></div>
  </div><div className="site-container footer-bottom"><span>© 2026 Construction Solutions PLC. All rights reserved.</span><span>Addis Ababa, Ethiopia <span className="footer-gold">↗</span></span></div></footer>;
}