export const legacyBase = "https://www.constructionsolutionsplc.com";
export const company = {
  name: "Construction Solutions PLC",
  shortName: "CONSOL",
  email: "info@constructionsolutionsplc.com",
  landline: "+251 114 70 04 52",
  mobile: "+251 911 51 30 11",
  address: "Meskel Flower to Wello Sefer Street, Martereza Building, 3rd Floor, 301",
};
// Preserve original destinations until each replacement module is reviewed.
export const navigation = [
  { label: "About us", path: "/about.php" },
  { label: "Consultancy", children: [
    { label: "Construction management", path: "/cm_consultancy.php" },
    { label: "Business management", path: "/bm_consultancy.php" },
  ] },
  { label: "Training", children: [
    { label: "Construction management", path: "/cm_trainings.php" },
    { label: "Construction management software", path: "/cms_trainings.php" },
    { label: "Engineering software", path: "/eng_trainings.php" },
  ] },
  { label: "Certification", children: [
    { label: "Autodesk® ATC", path: "/autodesk_atc.php" },
    { label: "PMI® ATP", path: "/pmi_atp.php" },
  ] },
  { label: "News & events", children: [
    { label: "News", path: "/news.php" },
    { label: "Events", path: "/events.php" },
  ] },
];
export function legacyUrl(path: string) { return `${legacyBase}${path}`; }