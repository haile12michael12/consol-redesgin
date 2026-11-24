import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/consol-original-logo.webp.asset.json";
import { company, legacyUrl, navigation } from "@/lib/site";

export function SiteHeader() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="utility-bar"><div className="site-container utility-inner">
      <span><MapPin size={13} /> Addis Ababa, Ethiopia</span>
      <div className="utility-contact"><a href={`mailto:${company.email}`}><Mail size={13} />{company.email}</a><a href="tel:+251114700452"><Phone size={13} />{company.landline}</a></div>
    </div></div>
    <header className="site-header"><div className="site-container header-inner">
      <Link to="/" aria-label="CONSOL home" className="brand-link"><img src={logo.url} alt="CONSOL — Construction Solutions PLC" width={205} height={74} /></Link>
      <nav className="desktop-navigation" aria-label="Main navigation">
        <Button asChild variant="navigation"><Link to="/" className="current-nav" aria-current="page">Home</Link></Button>
        {navigation.map(item => item.children ? <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild><Button variant="navigation">{item.label}<ChevronDown size={12} /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={15}>{item.children.map(child => <DropdownMenuItem asChild key={child.path}><a href={legacyUrl(child.path)}>{child.label}<ArrowUpRight className="ml-auto" /></a></DropdownMenuItem>)}</DropdownMenuContent>
        </DropdownMenu> : <Button asChild key={item.label} variant="navigation"><a href={legacyUrl(item.path)}>{item.label}</a></Button>)}
      </nav>
      <Button asChild variant="gold" className="header-cta"><a href={legacyUrl("/contact.php")}>Let’s talk <ArrowUpRight /></a></Button>
      <Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="mobile-menu-trigger" aria-label="Open navigation"><Menu /></Button></SheetTrigger>
        <SheetContent className="mobile-navigation"><SheetTitle>CONSOL</SheetTitle><SheetDescription className="sr-only">Company navigation</SheetDescription>
          <nav aria-label="Mobile navigation"><Link to="/">Home</Link>
            {navigation.map(item => <div key={item.label}>{item.children ? <><h2>{item.label}</h2>{item.children.map(child => <a key={child.path} href={legacyUrl(child.path)}>{child.label}<ArrowUpRight size={14} /></a>)}</> : <a href={legacyUrl(item.path)}>{item.label}<ArrowUpRight size={14} /></a>}</div>)}
            <a href={legacyUrl("/contact.php")}>Contact us<ArrowUpRight size={14} /></a>
          </nav>
        </SheetContent>
      </Sheet>
    </div></header>
  </>;
}