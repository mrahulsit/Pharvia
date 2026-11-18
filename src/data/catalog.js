import catMusthave from "@/assets/img/cat-musthave.webp";
import catElderly from "@/assets/img/cat-elderly.webp";
import catPersonal from "@/assets/img/cat-personal.webp";
import catSkin from "@/assets/img/cat-skin.webp";
import catMotherBaby from "@/assets/img/cat-mother-baby.webp";
import catFitness from "@/assets/img/cat-fitness.webp";
import catAyurvedic from "@/assets/img/cat-ayurvedic.webp";
import catDiabetic from "@/assets/img/cat-diabetic.webp";

/** The 8 "Shop by category" entries from the original CarouselShop. */
export const categories = [
  {
    slug: "musthave",
    title: "Must Haves",
    image: catMusthave,
    description: "Everyday medicines worth keeping in every home.",
  },
  {
    slug: "elderly-care",
    title: "Elderly Care",
    image: catElderly,
    description: "Support for joints, mobility and daily wellbeing.",
  },
  {
    slug: "personal-care",
    title: "Personal Care",
    image: catPersonal,
    description: "Hygiene and grooming essentials.",
  },
  {
    slug: "skin-care",
    title: "Skin Care",
    image: catSkin,
    description: "Cleansers, moisturisers and sun care.",
  },
  {
    slug: "mother-baby",
    title: "Mother & Baby Care",
    image: catMotherBaby,
    description: "Maternal care and baby essentials.",
  },
  {
    slug: "fitness",
    title: "Fitness Supplements",
    image: catFitness,
    description: "Protein, nutrition and fitness supplements.",
  },
  {
    slug: "ayurvedic",
    title: "Ayurvedic Care",
    image: catAyurvedic,
    description: "Traditional Ayurvedic remedies and wellness.",
  },
  {
    slug: "diabetic-care",
    title: "Diabetic Care",
    image: catDiabetic,
    description: "Diabetes management products and nutrition.",
  },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug);

/** The 10 medicines from the original MedicineBrand list, with numeric prices. */
export const products = [
  { id: "paracetamol", name: "Paracetamol", description: "500mg tablets", price: 37.5, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "ibuprofen", name: "Ibuprofen", description: "200mg tablets", price: 60, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "amoxicillin", name: "Amoxicillin", description: "500mg capsules", price: 250, unit: "per 10 units", form: "capsule", category: "musthave" },
  { id: "atorvastatin", name: "Atorvastatin", description: "10mg tablets", price: 375, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "omeprazole", name: "Omeprazole", description: "20mg capsules", price: 360, unit: "per 10 units", form: "capsule", category: "musthave" },
  { id: "metformin", name: "Metformin", description: "500mg tablets", price: 67.5, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "lisinopril", name: "Lisinopril", description: "10mg tablets", price: 250, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "amlodipine", name: "Amlodipine", description: "5mg tablets", price: 250, unit: "per 10 units", form: "tablet", category: "musthave" },
  { id: "albuterol-inhaler", name: "Albuterol Inhaler", description: "90mcg inhaler", price: 1200, unit: "per inhaler", form: "inhaler", category: "musthave" },
  { id: "cetirizine", name: "Cetirizine", description: "10mg tablets", price: 60, unit: "per 10 units", form: "tablet", category: "musthave" },
];

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );
}
