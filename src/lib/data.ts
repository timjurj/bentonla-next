import { supabase } from "./supabase";
import type { Business } from "@/types/business";

export async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_active", true)
    .order("tier", { ascending: true });
  if (error) { console.error("getBusinesses error:", error); return []; }
  // Sort by tier order: featured, premium, standard, free
  const order = { featured: 0, premium: 1, standard: 2, free: 3 };
  return (data as Business[]).sort((a, b) => order[a.tier] - order[b.tier]);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) { console.error("getBusinessBySlug error:", error); return null; }
  return data as Business;
}

export async function getBusinessesByCategory(category: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("category", category)
    .eq("is_active", true);
  if (error) { console.error("getBusinessesByCategory error:", error); return []; }
  const order = { featured: 0, premium: 1, standard: 2, free: 3 };
  return (data as Business[]).sort((a, b) => order[a.tier] - order[b.tier]);
}

export async function getAllBusinessSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("slug")
    .eq("is_active", true);
  if (error) { console.error("getAllBusinessSlugs error:", error); return []; }
  return data.map((b: { slug: string }) => b.slug);
}

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getEvents error:", error); return []; }
  return data;
}

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getJobs error:", error); return []; }
  return data;
}

export async function getClassifieds() {
  const { data, error } = await supabase
    .from("classifieds")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getClassifieds error:", error); return []; }
  return data;
}