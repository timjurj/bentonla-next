const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://cruoqjzrukdapfcozxgu.supabase.co",
  process.env.SUPABASE_KEY
);

const businesses = [
  { id: "gleaux-cleaning", slug: "gleaux-cleaning", name: "Gleaux Cleaning LLC", category: "home-services", tagline: "Benton's Premier Residential & Commercial Cleaning Service", description: "Professional residential and commercial cleaning for Benton and the surrounding Bossier Parish area. Trusted by hundreds of local families. Move-in/move-out specialists.", phone: "(318) 965-9055", website: "https://gleauxcleaning.com", address: "Benton, LA 71006", tier: "featured", is_new: false, is_active: true },
  { id: "los-compas-cantina", slug: "los-compas-cantina", name: "Los Compas Cantina & Grill", category: "restaurants", tagline: "Authentic Mexican · Dine-In · Outdoor Seating", description: "Authentic Mexican cuisine in the heart of Benton.", phone: "(318) 550-5017", website: "https://loscompasmexicanrestaurant.com", address: "5608 LA-3, Benton, LA 71006", tier: "premium", is_new: false, is_active: true },
  { id: "lins-kitchen", slug: "lins-kitchen", name: "Lin's Kitchen", category: "restaurants", tagline: "Best Chinese Takeout in Benton", description: "Fast, fresh Chinese cuisine. Locally loved for cashew chicken, beef with broccoli, and quick service.", phone: "(318) 965-9300", website: "https://thelinskitchenbentonla.com", address: "4717 Palmetto Rd, Benton, LA 71006", tier: "standard", is_new: false, is_active: true },
  { id: "uncle-henrys-bbq", slug: "uncle-henrys-bbq", name: "Uncle Henry's BBQ", category: "restaurants", tagline: "Local Smokehouse · Benton/North Bossier", description: "Small, locally owned barbecue restaurant proudly serving the Benton and North Bossier area.", phone: "See Facebook for hours", website: "https://facebook.com/UncleHenrysSmokehouseBBQ", address: "Benton, LA 71006", tier: "standard", is_new: false, is_active: true },
  { id: "pizza-hut-benton", slug: "pizza-hut-benton", name: "Pizza Hut Benton", category: "restaurants", tagline: "Pizza Delivery & Carryout · Benton, LA", description: "Pizza delivery and carryout serving Benton and Bossier Parish.", phone: "(318) 965-4191", website: "https://pizzahut.com", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
  { id: "benton-medical", slug: "benton-medical", name: "Benton Medical", category: "health", tagline: "Family Practice · All Ages · All Insurance", description: "Comprehensive family practice clinic accepting new patients of all ages.", phone: "(318) 965-5017", website: "https://facebook.com/BentonMedical", address: "188 Burt Blvd, Benton, LA 71006", tier: "premium", is_new: false, is_active: true },
  { id: "christus-bossier", slug: "christus-bossier", name: "CHRISTUS Bossier Emergency Hospital", category: "health", tagline: "24/7 Emergency Care · Bossier Parish", description: "Full-service emergency hospital serving Benton and Bossier Parish.", phone: "(318) 841-4000", website: "https://christushealth.org", address: "Bossier City, LA 71111", tier: "standard", is_new: false, is_active: true },
  { id: "willis-knighton", slug: "willis-knighton", name: "Willis-Knighton Health System", category: "health", tagline: "Full-Service Hospital · North Louisiana", description: "One of Louisiana's largest health systems serving Benton and the greater Shreveport-Bossier area.", phone: "(318) 212-4000", website: "https://wkhs.com", address: "Shreveport, LA 71103", tier: "standard", is_new: false, is_active: true },
  { id: "the-auto-repair-shop", slug: "the-auto-repair-shop", name: "The Auto Repair Shop", category: "automotive", tagline: "Full Service Auto Repair · BBB A+ · Benton, LA", description: "Trusted full-service auto repair shop in Benton. BBB A+ rated.", phone: "(318) 470-8362", website: null, address: "714 5th St, Benton, LA 71006", tier: "standard", is_new: false, is_active: true },
  { id: "kb-auto-care", slug: "kb-auto-care", name: "K&B Auto Care & Services", category: "automotive", tagline: "Mobile Service Available · All Makes & Models", description: "Top-rated auto care serving the Benton and Shreveport area.", phone: "See website for contact", website: "https://autorepairshreveport.com", address: "Serving Benton, LA", tier: "standard", is_new: false, is_active: true },
  { id: "hwy3-auto-body", slug: "hwy3-auto-body", name: "Auto Body & Repair — Hwy 3", category: "automotive", tagline: "Collision Repair · Body Work · BBB A+", description: "BBB A+ rated auto body and collision repair shop on Highway 3 in Benton.", phone: "(318) 458-4436", website: null, address: "6438 Hwy 3, Benton, LA 71006", tier: "standard", is_new: false, is_active: true },
  { id: "first-baptist-benton", slug: "first-baptist-benton", name: "First Baptist Church Benton", category: "churches", tagline: "Sunday Services · Youth · Community · Since 1991", description: "Welcoming Southern Baptist congregation in downtown Benton.", phone: "(318) 965-2351", website: "https://fbcbenton.net", address: "201 Bellevue St, Benton, LA 71006", tier: "standard", is_new: false, is_active: true },
  { id: "bossier-parish-schools", slug: "bossier-parish-schools", name: "Bossier Parish Schools", category: "education", tagline: "K-12 Public Education · Enrollment Open", description: "Bossier Parish School System serves Benton and the surrounding area with top-rated public schools.", phone: "(318) 549-5000", website: "https://bossierschools.org", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
  { id: "benton-high-school", slug: "benton-high-school", name: "Benton High School", category: "education", tagline: "Home of the Tigers · Bossier Parish Schools", description: "Benton High School serves grades 9-12 in the Bossier Parish School System.", phone: "(318) 549-5240", website: "https://bossierschools.org", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
  { id: "berkshire-hathaway-ally", slug: "berkshire-hathaway-ally", name: "Berkshire Hathaway HomeServices Ally", category: "real-estate", tagline: "Top Benton Area Listings · Buy & Sell", description: "One of the most active real estate agencies in the Benton and Bossier Parish market.", phone: "See website for local agents", website: "https://bhhsally.com", address: "Serving Benton, LA", tier: "standard", is_new: false, is_active: true },
  { id: "keller-williams-nwla", slug: "keller-williams-nwla", name: "Keller Williams Northwest LA", category: "real-estate", tagline: "Buy · Sell · Invest · Bossier Parish", description: "Keller Williams agents specializing in Benton and Bossier Parish residential and investment properties.", phone: "See website for local agents", website: "https://kw.com", address: "Serving Benton, LA", tier: "standard", is_new: false, is_active: true },
  { id: "town-of-benton", slug: "town-of-benton", name: "Town of Benton", category: "government", tagline: "City Hall · Permits · Public Works", description: "Official government office for the Town of Benton, Louisiana.", phone: "(318) 965-2781", website: "https://townofbenton.com", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
  { id: "bossier-parish-police-jury", slug: "bossier-parish-police-jury", name: "Bossier Parish Police Jury", category: "government", tagline: "Parish Government · Road & Drainage", description: "Governing body of Bossier Parish handling roads, drainage, and parish-wide government services.", phone: "(318) 226-6950", website: "https://bossierparishpolicejury.com", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
  { id: "bossier-parish-library", slug: "bossier-parish-library", name: "Bossier Parish Library", category: "government", tagline: "Books · Events · Community Programs", description: "Bossier Parish Library system serving Benton and surrounding communities.", phone: "(318) 746-1693", website: "https://mybossier.com/library", address: "Benton, LA 71006", tier: "free", is_new: false, is_active: true },
];

const events = [
  { id: "event-1", title: "Bossier Parish Heritage Festival", date: "May 3, 2025", location: "Downtown Benton", link: "#", is_active: true },
  { id: "event-2", title: "Benton Farmers Market Opens", date: "Every Saturday, 8AM", location: "Town Square, Benton", link: "#", is_active: true },
  { id: "event-3", title: "Bossier Parish Library Book Sale", date: "May 10, 2025", location: "Bossier Parish Library", link: "#", is_active: true },
  { id: "event-4", title: "Benton High School Graduation", date: "May 17, 2025", location: "Benton High School", link: "#", is_active: true },
  { id: "event-5", title: "North Bossier Community Yard Sale", date: "May 24, 2025", location: "Benton Community Center", link: "#", is_active: true },
];

const jobs = [
  { id: "job-1", title: "Registered Nurse — ICU", company: "Willis-Knighton Health", type: "Full-Time", link: "#", is_active: true },
  { id: "job-2", title: "Warehouse Associate", company: "Amazon — Bossier City", type: "Full-Time", link: "#", is_active: true },
  { id: "job-3", title: "Elementary School Teacher", company: "Bossier Parish Schools", type: "Full-Time", link: "#", is_active: true },
  { id: "job-4", title: "Residential Cleaning Tech", company: "Gleaux Cleaning LLC", type: "Part-Time", link: "https://gleauxcleaning.com?utm_source=bentonla&utm_medium=jobs", is_active: true },
  { id: "job-5", title: "Real Estate Agent", company: "Keller Williams NW LA", type: "Commission", link: "#", is_active: true },
];

const classifieds = [
  { id: "bs-1", title: "2019 Ford F-150 XLT", price: "$28,500", condition: "Used", link: "#", is_active: true },
  { id: "bs-2", title: "3BR/2BA Home — Benton", price: "$224,000", condition: "For Sale", link: "#", is_active: true },
  { id: "bs-3", title: "John Deere Riding Mower", price: "$1,200", condition: "Used", link: "#", is_active: true },
  { id: "bs-4", title: "Kids Bunk Bed Set", price: "$150", condition: "Good Condition", link: "#", is_active: true },
  { id: "bs-5", title: "Commercial Pressure Washer", price: "$800", condition: "Like New", link: "#", is_active: true },
];

async function seed() {
  console.log("Seeding businesses...");
  const { error: e1 } = await supabase.from("businesses").upsert(businesses);
  if (e1) console.error("❌ Businesses:", e1.message);
  else console.log(`✓ ${businesses.length} businesses inserted`);

  console.log("Seeding events...");
  const { error: e2 } = await supabase.from("events").upsert(events);
  if (e2) console.error("❌ Events:", e2.message);
  else console.log(`✓ ${events.length} events inserted`);

  console.log("Seeding jobs...");
  const { error: e3 } = await supabase.from("jobs").upsert(jobs);
  if (e3) console.error("❌ Jobs:", e3.message);
  else console.log(`✓ ${jobs.length} jobs inserted`);

  console.log("Seeding classifieds...");
  const { error: e4 } = await supabase.from("classifieds").upsert(classifieds);
  if (e4) console.error("❌ Classifieds:", e4.message);
  else console.log(`✓ ${classifieds.length} classifieds inserted`);

  console.log("✅ Seed complete!");
}

seed().catch(console.error);