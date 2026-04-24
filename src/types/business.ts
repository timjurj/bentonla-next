export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  phone: string;
  website: string | null;
  address: string;
  tier: "featured" | "premium" | "standard" | "free";
  is_new: boolean;
  is_active: boolean;
};
