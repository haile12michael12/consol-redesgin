import { describe, expect, it } from "vitest";
import { legacyUrl, navigation } from "@/lib/site";

describe("Existing CONSOL destinations", () => {
  it("preserves all original company and service URLs", () => {
    const paths = navigation.flatMap(item => item.children ? item.children.map(child => child.path) : [item.path]);
    expect(paths).toEqual([
      "/about.php", "/cm_consultancy.php", "/bm_consultancy.php",
      "/cm_trainings.php", "/cms_trainings.php", "/eng_trainings.php",
      "/autodesk_atc.php", "/pmi_atp.php", "/news.php", "/events.php",
    ]);
  });
  it("keeps contact inquiries on the existing company website until the new module is approved", () => {
    expect(legacyUrl("/contact.php")).toBe("https://www.constructionsolutionsplc.com/contact.php");
  });
});