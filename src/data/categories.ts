export const categories = [
  {
    slug: "home-services",
    name: "Home Services",
    icon: "🏠",
    title: "Best Home Services in Benton, LA",
    metaDescription:
      "Find the best home services in Benton, Louisiana. Cleaning, handyman, lawn care, pest control and more serving Bossier Parish.",
    seoIntro: `Looking for reliable home services in Benton, Louisiana? Whether you need house cleaning, lawn care, pest control, or a trusted handyman, Benton's growing community has you covered. BentonLA.com lists the top-rated home service providers serving Benton and the greater Bossier Parish area — all vetted and locally trusted.`,
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    icon: "🍽",
    title: "Best Restaurants in Benton, LA",
    metaDescription:
      "Discover the best restaurants in Benton, Louisiana. From local BBQ to Mexican food and Chinese takeout — find places to eat in Bossier Parish.",
    seoIntro: `Hungry in Benton? From smoky local barbecue to authentic Mexican cuisine and quick Chinese takeout, Benton, Louisiana has a growing dining scene worth exploring. BentonLA.com lists the top restaurants and food spots in Benton and North Bossier Parish — whether you're a longtime local or just moved to the area.`,
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: "🏡",
    title: "Real Estate Agents in Benton, LA",
    metaDescription:
      "Find top real estate agents and homes for sale in Benton, Louisiana. Buy, sell, or invest in Bossier Parish real estate.",
    seoIntro: `Benton, Louisiana is one of the fastest-growing communities in Bossier Parish. Whether you're buying your first home, selling, or investing in the booming Benton real estate market, our directory lists the most active and trusted agents serving the 71006 zip code and surrounding areas.`,
  },
  {
    slug: "health",
    name: "Health & Medical",
    icon: "⚕️",
    title: "Doctors & Medical Services in Benton, LA",
    metaDescription:
      "Find doctors, urgent care, and medical services in Benton, Louisiana and Bossier Parish. Family practice, emergency care, and more.",
    seoIntro: `Finding quality healthcare near Benton, Louisiana is easier than ever. From family practice clinics accepting new patients to full-service emergency hospitals, BentonLA.com lists the top medical providers serving Benton and the greater Bossier Parish area — including providers that accept all insurance, Medicare, and Medicaid.`,
  },
  {
    slug: "automotive",
    name: "Automotive",
    icon: "🚗",
    title: "Auto Repair Shops in Benton, LA",
    metaDescription:
      "Find trusted auto repair shops in Benton, Louisiana. BBB-rated mechanics, body shops, and car care services in Bossier Parish.",
    seoIntro: `Need a trusted mechanic near Benton, Louisiana? From full-service auto repair to collision and body work, BentonLA.com lists the top-rated automotive shops serving Benton and Bossier Parish. All listings are verified and include BBB ratings where available.`,
  },
  {
    slug: "churches",
    name: "Churches",
    icon: "✝️",
    title: "Churches in Benton, LA",
    metaDescription:
      "Find churches in Benton, Louisiana. Baptist, Assembly of God, and more serving the Bossier Parish faith community.",
    seoIntro: `Faith is at the heart of Benton, Louisiana. Whether you're new to the area or looking for a church home, BentonLA.com lists the active congregations serving Benton and North Bossier Parish — including Sunday service times, youth programs, and community outreach ministries.`,
  },
  {
    slug: "education",
    name: "Education",
    icon: "🎓",
    title: "Schools in Benton, LA",
    metaDescription:
      "Find public and private schools in Benton, Louisiana. Bossier Parish Schools, Benton High School, and more.",
    seoIntro: `Benton, Louisiana is served by the highly rated Bossier Parish School System, consistently ranked among the top school districts in Louisiana. Whether you're enrolling your children or researching private school options, BentonLA.com has the resources you need to navigate education in the Benton area.`,
  },
  {
    slug: "government",
    name: "Government",
    icon: "🏛️",
    title: "Government & Public Services in Benton, LA",
    metaDescription:
      "Find government offices and public services in Benton, Louisiana and Bossier Parish.",
    seoIntro: `From the Town of Benton City Hall to the Bossier Parish Police Jury, BentonLA.com connects residents with the local government offices and public services they need. Find contact information, hours, and services for all major government entities serving the Benton, LA 71006 area.`,
  },
];

export type Category = (typeof categories)[0];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}