import qlMaternal from "@/assets/img/ql-maternal.webp";
import qlMedicines from "@/assets/img/ql-medicines.webp";
import qlBlogs from "@/assets/img/ql-blogs.webp";
import qlMedicare from "@/assets/img/ql-medicare.webp";
import qlGift from "@/assets/img/ql-gift.webp";
import qlHealth from "@/assets/img/ql-health.webp";
import qlProtein from "@/assets/img/ql-protein.webp";

/** Rotating hero search phrases (from the original Home page). */
export const searchPhrases: string[] = [
  "Search for Medicines",
  "Search for Healthcare Products",
  "Search for Facial Products",
  "Search for Diabetic products",
  "Search for Thyroid products",
];

export const navLinks: { to: string; label: string }[] = [
  { to: "/medicine", label: "Medicine" },
  { to: "/healthcare", label: "Healthcare" },
  { to: "/offers", label: "Offers" },
  { to: "/plus", label: "PLUS" },
];

export interface QuickLink {
  title: string;
  image: string;
  to: string | null;
}

/** The 7 home tiles from the original CardHome. `to: null` = no page yet. */
export const quickLinks: QuickLink[] = [
  { title: "Maternal Care", image: qlMaternal, to: "/category/mother-baby" },
  { title: "Medicines", image: qlMedicines, to: "/medicine" },
  { title: "Health Blogs", image: qlBlogs, to: null },
  { title: "Medicare", image: qlMedicare, to: "/upload-prescription" },
  { title: "Gift Subscribe", image: qlGift, to: "/plus" },
  { title: "Health Products", image: qlHealth, to: "/healthcare" },
  { title: "Protein Boost", image: qlProtein, to: "/category/fitness" },
];

export type ProcessStepIcon = "upload" | "map" | "phone" | "truck";

/** "How the process works" (from the original Prescribe component). */
export const processSteps: { title: string; icon: ProcessStepIcon }[] = [
  { title: "Upload photo of your prescription", icon: "upload" },
  { title: "Add delivery address and place order", icon: "map" },
  { title: "We will confirm your medicines by call", icon: "phone" },
  { title: "Rest until your order is delivered", icon: "truck" },
];

export interface Offer {
  code: string;
  title: string;
  detail: string;
}

/** Offer codes that appear in the app's own banners and copy. */
export const offers: Offer[] = [
  {
    code: "PHARMA10",
    title: "Flat 10% off on any medicine",
    detail: "Plus guaranteed benefits up to ₹1000 on any order.",
  },
  {
    code: "STAYHOME",
    title: "Flat 20% off + 20% cashback",
    detail: "On your first order.",
  },
];

export interface PlusBenefit {
  title: string;
  detail: string;
}

/** PLUS benefits, as printed on Plus-Banner.png. */
export const plusBenefits: PlusBenefit[] = [
  { title: "10% off on medicines", detail: "Get your medicines at a 10% discount." },
  { title: "Free delivery", detail: "Free delivery on your orders." },
  { title: "Unlimited offers", detail: "Enjoy offers on every order." },
  { title: "Great offers and more", detail: "Member-only deals as they launch." },
];

export interface FooterLink {
  label: string;
  to?: string;
}

export interface FooterColumn {
  title: string;
  links: (string | FooterLink)[];
}

/** Footer content (from the original Footer). Plain strings have no page yet. */
export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Medicines", to: "/medicine" },
      { label: "Healthcare products", to: "/healthcare" },
      { label: "Upload prescription", to: "/upload-prescription" },
      { label: "Offers", to: "/offers" },
      { label: "PLUS membership", to: "/plus" },
    ],
  },
  {
    title: "Featured Categories",
    links: [
      { label: "Nutrition & Fitness", to: "/category/fitness" },
      { label: "Personal Care", to: "/category/personal-care" },
      { label: "Ayurvedic Care", to: "/category/ayurvedic" },
      { label: "Maternal Care", to: "/category/mother-baby" },
      { label: "Diabetic Care", to: "/category/diabetic-care" },
      { label: "Elderly Care", to: "/category/elderly-care" },
    ],
  },
  {
    title: "Company",
    links: ["About us", "Partner", "Careers", "Blogs", "News", "Policy", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Timeline", { label: "FAQs", to: "/#faq" }, "Support", { label: "Products", to: "/medicine" }, "Newsletter"],
  },
  {
    title: "Help & Support",
    links: [
      "Customer Support",
      "Return & Exchange Policy",
      "Payment Options",
      "Shipping & Delivery",
      "Refund & Return",
      "Terms & Conditions",
      "Privacy Policy",
    ],
  },
];
