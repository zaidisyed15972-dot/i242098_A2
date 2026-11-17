export const EXHIBITIONS_DATA = [
  {
    id: "exh-01",
    title: "Empires of the Silk Road",
    category: "Exhibitions",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 75,
    basePrice: 18,
    specialFee: 3, // Audio guide included upfront (solves late surcharge issue)
    galleryWing: "North Wing, Hall A",
    summary: "Explore 1,500 years of trade, manuscripts, and metalwork connecting East Asia to the Mediterranean.",
    timeSlots: [
      { time: "10:00", remainingSeats: 14 },
      { time: "12:30", remainingSeats: 4 },
      { time: "15:00", remainingSeats: 0 }
    ],
    // IMAGE PLACEHOLDER 1: Save a wide photo of ancient Silk Road pottery, coins, or camel caravan artifacts as /public/images/silk-road.jpg
    imageUrl: "/images/silk-road.jpg",
    imageAlt: "Gilded bronze Silk Road astrolabe and ceramic vessels on display",
    imageDescription: "Photo of ancient Silk Road artifacts, pottery, or historical maps"
  },
  {
    id: "exh-02",
    title: "Pharaohs & The Nile Delta",
    category: "Exhibitions",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 90,
    basePrice: 22,
    specialFee: 0,
    galleryWing: "Grand Rotunda",
    summary: "Monumental limestone reliefs, sarcophagi, and daily life artifacts from New Kingdom Egypt.",
    timeSlots: [
      { time: "09:30", remainingSeats: 20 },
      { time: "13:00", remainingSeats: 6 },
      { time: "16:00", remainingSeats: 11 }
    ],
    // IMAGE PLACEHOLDER 2: Save an Egyptian statue, hieroglyphic wall, or sarcophagus photo as /public/images/egypt-nile.jpg
    imageUrl: "/images/egypt-nile.jpg",
    imageAlt: "Carved limestone Egyptian pharaoh bust illuminated in gallery",
    imageDescription: "Photo of Ancient Egyptian statues, hieroglyphs, or museum sculpture gallery"
  },
  {
    id: "exh-03",
    title: "Bronze Casting & Metallurgy Lab",
    category: "Workshops",
    audience: "16+ Only",
    minAge: 16,
    requiresAdultWithChild: false,
    durationMins: 120,
    basePrice: 35,
    specialFee: 5, // Safety & materials kit
    galleryWing: "Studio 2, Lower Level",
    summary: "Hands-on conservation workshop examining ancient lost-wax casting techniques under conservator guidance.",
    timeSlots: [
      { time: "11:00", remainingSeats: 5 },
      { time: "14:30", remainingSeats: 2 }
    ],
    // IMAGE PLACEHOLDER 3: Save a photo of a craft workshop, metalworking tools, or museum restoration lab as /public/images/bronze-lab.jpg
    imageUrl: "/images/bronze-lab.jpg",
    imageAlt: "Conservator examining bronze tools at a museum workbench",
    imageDescription: "Photo of hands-on restoration studio, bronze sculptures, or craft tools"
  },
  {
    id: "exh-04",
    title: "Junior Archaeologists Dig",
    category: "Workshops",
    audience: "Family Friendly",
    minAge: 0,
    requiresAdultWithChild: true, // Operating Rule 2: Child tickets require 1+ Adult ticket
    durationMins: 60,
    basePrice: 12,
    specialFee: 0,
    galleryWing: "Education Discovery Zone",
    summary: "Interactive excavation grid where families uncover replica fossils and catalogue pottery sherds.",
    timeSlots: [
      { time: "10:30", remainingSeats: 10 },
      { time: "14:00", remainingSeats: 8 }
    ],
    // IMAGE PLACEHOLDER 4: Save a photo of archaeological excavation tools, fossils, or kids learning in a museum as /public/images/junior-dig.jpg
    imageUrl: "/images/junior-dig.jpg",
    imageAlt: "Brushes, trowels, and replica pottery fragments in an excavation tray",
    imageDescription: "Photo of archaeological excavation brushes, fossils, or family museum activity"
  },
  {
    id: "exh-05",
    title: "Curator Spotlight: Islamic Astrolabes",
    category: "Guided Tours",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 45,
    basePrice: 15,
    specialFee: 0,
    galleryWing: "Gallery 14, East Wing",
    summary: "A 45-minute curator-led walkthrough of medieval brass astronomical instruments and star charts.",
    timeSlots: [
      { time: "11:30", remainingSeats: 9 },
      { time: "15:30", remainingSeats: 7 }
    ],
    // IMAGE PLACEHOLDER 5: Save a photo of a brass astrolabe, antique globe, or astronomical instrument as /public/images/astrolabes.jpg
    imageUrl: "/images/astrolabes.jpg",
    imageAlt: "Engraved brass celestial astrolabe mounted on a display stand",
    imageDescription: "Photo of antique brass astrolabe, celestial globe, or historical science instrument"
  },
  {
    id: "exh-06",
    title: "Clockwork & Early Automata",
    category: "Exhibitions",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 60,
    basePrice: 16,
    specialFee: 2,
    galleryWing: "West Pavilion",
    summary: "Intricate Renaissance mechanical clocks, musical automata, and early calculating engines.",
    timeSlots: [
      { time: "10:00", remainingSeats: 16 },
      { time: "13:30", remainingSeats: 12 },
      { time: "16:30", remainingSeats: 5 }
    ],
    // IMAGE PLACEHOLDER 6: Save a photo of antique pocket watches, gears, or mechanical clocks as /public/images/clockwork.jpg
    imageUrl: "/images/clockwork.jpg",
    imageAlt: "Exposed brass gears of an eighteenth-century astronomical clock",
    imageDescription: "Photo of antique mechanical clock gears or horology exhibit"
  },
  {
    id: "exh-07",
    title: "Samurai Armour & Edo Prints",
    category: "Exhibitions",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 75,
    basePrice: 20,
    specialFee: 0,
    galleryWing: "Asia Gallery, Level 2",
    summary: "Ceremonial lacquered armour, katana fittings, and woodblock prints from 17th-century Edo.",
    timeSlots: [
      { time: "09:30", remainingSeats: 15 },
      { time: "12:00", remainingSeats: 3 },
      { time: "15:00", remainingSeats: 9 }
    ],
    // IMAGE PLACEHOLDER 7: Save a photo of Japanese Samurai armour, katana, or ukiyo-e woodblock art as /public/images/samurai-edo.jpg
    imageUrl: "/images/samurai-edo.jpg",
    imageAlt: "Lacquered Samurai helmet and chest armour in a dimly lit showcase",
    imageDescription: "Photo of Japanese Samurai armour or traditional Edo period artwork"
  },
  {
    id: "exh-08",
    title: "Behind the Vaults: Conservation Tour",
    category: "Guided Tours",
    audience: "16+ Only",
    minAge: 16,
    requiresAdultWithChild: false,
    durationMins: 90,
    basePrice: 28,
    specialFee: 0,
    galleryWing: "Research Annex",
    summary: "Restricted-access guided tour through X-ray imaging suites and textile preservation rooms.",
    timeSlots: [
      { time: "10:30", remainingSeats: 6 },
      { time: "14:00", remainingSeats: 1 }
    ],
    // IMAGE PLACEHOLDER 8: Save a photo of museum archives, storage shelves, or art restoration as /public/images/vault-tour.jpg
    imageUrl: "/images/vault-tour.jpg",
    imageAlt: "Climate-controlled museum storage racks holding framed paintings",
    imageDescription: "Photo of museum conservation lab or climate-controlled archive vaults"
  },
  {
    id: "exh-09",
    title: "Mediterranean Classical Sculptures",
    category: "Exhibitions",
    audience: "All Ages",
    minAge: 0,
    requiresAdultWithChild: false,
    durationMins: 60,
    basePrice: 14,
    specialFee: 0,
    galleryWing: "South Colonnade",
    summary: "Marble busts, architectural friezes, and bronze athletes from the Classical and Hellenistic eras.",
    timeSlots: [
      { time: "09:30", remainingSeats: 25 },
      { time: "13:00", remainingSeats: 18 },
      { time: "16:00", remainingSeats: 20 }
    ],
    // IMAGE PLACEHOLDER 9: Save a photo of Greek or Roman marble statues and columns as /public/images/classical-marble.jpg
    imageUrl: "/images/classical-marble.jpg",
    imageAlt: "Classical marble statue beneath a glass skylight in the South Colonnade",
    imageDescription: "Photo of Classical Greek or Roman marble sculptures in a bright gallery"
  },
  {
    id: "exh-10",
    title: "Calligraphy & Illuminated Manuscripts",
    category: "Workshops",
    audience: "Family Friendly",
    minAge: 0,
    requiresAdultWithChild: true,
    durationMins: 60,
    basePrice: 16,
    specialFee: 2,
    galleryWing: "Paper Arts Studio",
    summary: "Learn reed-pen lettering and mineral pigment gilding inspired by medieval manuscript folios.",
    timeSlots: [
      { time: "11:30", remainingSeats: 8 },
      { time: "15:00", remainingSeats: 6 }
    ],
    // IMAGE PLACEHOLDER 10: Save a photo of calligraphy pens, ink bottles, or illuminated manuscripts as /public/images/calligraphy.jpg
    imageUrl: "/images/calligraphy.jpg",
    imageAlt: "Reed pens, natural mineral pigments, and gilded parchment sheet",
    imageDescription: "Photo of traditional calligraphy pens, ink, and illuminated manuscript pages"
  }
];

/**
 * Asynchronous mock loader (FR14)
 * Supports simulated failure and modified availability for Task 6.1 testing.
 */
export function fetchExhibitions({ simulateError = false, simulateSoldOutId = null } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error("Unable to reach the Meridian Museum schedule service. Please check your connection and retry."));
        return;
      }

      const cloned = EXHIBITIONS_DATA.map((item) => {
        if (simulateSoldOutId && item.id === simulateSoldOutId) {
          return {
            ...item,
            timeSlots: item.timeSlots.map((slot) => ({ ...slot, remainingSeats: 0 }))
          };
        }
        return {
          ...item,
          timeSlots: item.timeSlots.map((slot) => ({ ...slot }))
        };
      });

      resolve(cloned);
    }, 350);
  });
}