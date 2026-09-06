import { CityId, OfferUnit, PlaceTypeId, TagId, type CoworkingData } from "../lib/types";

export const coworkingData = {
  config: {
    siteTitle: "Coworking Finder",
    defaultCity: CityId.Lyon,
    lastUpdatedAt: "2026-09-05",
    author: {
      name: "Kevin Tassi",
      linkedinUrl: "https://www.linkedin.com/in/kevin-tassi/",
      githubUrl: "https://github.com/KevinTss"
    }
  },
  cities: [
    {
      id: CityId.Lyon,
      name: "Lyon",
      country: "FR",
      lat: 45.764,
      lng: 4.8357,
      defaultZoom: 12
    }
  ],
  placeTypes: [
    {
      id: PlaceTypeId.Coworking,
      label: "Coworking",
      icon: "🏢"
    },
    {
      id: PlaceTypeId.Cafe,
      label: "Café-coworking",
      icon: "☕"
    }
  ],
  tags: [
    {
      id: TagId.Open247,
      label: "24/7 member access"
    },
    {
      id: TagId.DayPass,
      label: "Day pass"
    },
    {
      id: TagId.PhoneBox,
      label: "Phone box"
    },
    {
      id: TagId.MeetingRooms,
      label: "Meeting rooms"
    },
    {
      id: TagId.CoffeeIncluded,
      label: "Coffee included"
    },
    {
      id: TagId.Terrace,
      label: "Terrace"
    },
    {
      id: TagId.HighSpeedWifi,
      label: "High-speed wifi"
    },
    {
      id: TagId.LaptopFriendly,
      label: "Laptop friendly"
    },
    {
      id: TagId.WeekdayLaptop,
      label: "Weekday laptop"
    },
    {
      id: TagId.WeekendLaptop,
      label: "Weekend laptop"
    },
    {
      id: TagId.MinimumSpend,
      label: "Minimum spend"
    },
    {
      id: TagId.Outlets,
      label: "Outlets"
    },
    {
      id: TagId.StudentFriendly,
      label: "Student friendly"
    }
  ],
  places: [
    {
      id: "hiptown-part-dieu",
      cityId: CityId.Lyon,
      name: "Hiptown Part-Dieu Britannia Campus",
      typeId: PlaceTypeId.Coworking,
      address: "20 boulevard Eugene Deruelle, 69003 Lyon",
      lat: 45.7626,
      lng: 4.858,
      websiteUrl: "https://hiptown.com/nos-espaces-coworking/hiptown-lyon-britannia-bat-c/",
      priceMonthlyEstimate: 180,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Day pass or monthly access",
        details: "Coworking venue; laptop access follows the booked day pass or monthly plan."
      },
      notes: "Monthly estimate uses Hiptown's published coworking nomade price from 180 EUR HT/month/poste.",
      offers: [
        {
          id: "hiptown-part-dieu-day",
          label: "Hiptown Days",
          price: 18,
          unit: OfferUnit.Day
        },
        {
          id: "hiptown-part-dieu-month",
          label: "Coworking nomade",
          price: 180,
          unit: OfferUnit.Month
        }
      ],
      reviews: [],
      tagIds: [TagId.DayPass, TagId.MeetingRooms, TagId.PhoneBox, TagId.LaptopFriendly]
    },
    {
      id: "mama-works-lyon",
      cityId: CityId.Lyon,
      name: "Mama Works Lyon",
      typeId: PlaceTypeId.Coworking,
      address: "92 cours Lafayette, 69003 Lyon",
      lat: 45.76289,
      lng: 4.84938,
      websiteUrl: "https://mamaworks.com/coworking-lyon/",
      priceMonthlyEstimate: 219,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Coworking access",
        details: "Coworking venue; laptop access follows the selected hourly or monthly offer."
      },
      notes: "Monthly estimate uses Mama Works' published full-time Mama mobile rate from 219 EUR HT/month.",
      offers: [
        {
          id: "mama-works-hour",
          label: "Mama mobile hourly",
          price: 5,
          unit: OfferUnit.Hour
        },
        {
          id: "mama-works-half-time",
          label: "Mama mobile half-time",
          price: 149,
          unit: OfferUnit.Month
        },
        {
          id: "mama-works-full-time",
          label: "Mama mobile full-time",
          price: 219,
          unit: OfferUnit.Month
        },
        {
          id: "mama-works-dedicated",
          label: "Mama desk",
          price: 340,
          unit: OfferUnit.Month
        }
      ],
      reviews: [],
      tagIds: [TagId.Open247, TagId.Terrace, TagId.PhoneBox, TagId.CoffeeIncluded, TagId.LaptopFriendly]
    },
    {
      id: "wojo-part-dieu",
      cityId: CityId.Lyon,
      name: "Wojo Lyon 3e Part-Dieu",
      typeId: PlaceTypeId.Coworking,
      address: "15 rue des Cuirassiers, 69003 Lyon",
      lat: 45.75939,
      lng: 4.85603,
      websiteUrl: "https://www.wojo.com/fr-FR/service/wojo-coworking/europe/france/auvergne-rhone-alpes/lyon/lyon-3e/lyon-3e-part-dieu/wojo-lyon-3e-part-dieu/espace-de-coworking",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Day pass access",
        details: "Coworking venue; laptop access follows the booked day or half-day pass."
      },
      notes: "This venue publishes day and half-day passes; monthly pricing is left null here.",
      offers: [
        {
          id: "wojo-part-dieu-half-day",
          label: "Half-day pass",
          price: 17,
          unit: OfferUnit.HalfDay
        },
        {
          id: "wojo-part-dieu-day",
          label: "Day pass",
          price: 27,
          unit: OfferUnit.Day
        }
      ],
      reviews: [],
      tagIds: [TagId.DayPass, TagId.MeetingRooms, TagId.HighSpeedWifi, TagId.LaptopFriendly]
    },
    {
      id: "la-cordee-liberte-guillotiere",
      cityId: CityId.Lyon,
      name: "La Cordée Liberté-Guillotière",
      typeId: PlaceTypeId.Coworking,
      address: "61 cours de la Liberte, 69003 Lyon",
      lat: 45.756,
      lng: 4.8405,
      websiteUrl: "https://www.la-cordee.net/cordee/lyon/lyon/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Member access",
        details: "Laptop access follows La Cordee's formula-based membership."
      },
      notes: "La Cordee uses formula-based pricing, so offers are captured separately instead of inventing one monthly equivalent.",
      offers: [
        {
          id: "la-cordee-liberte-balade-fixed",
          label: "Balade fixed monthly fee",
          price: 35,
          unit: OfferUnit.Month
        },
        {
          id: "la-cordee-liberte-balade-hour",
          label: "Balade hourly presence",
          price: 3.25,
          unit: OfferUnit.Hour
        },
        {
          id: "la-cordee-liberte-trail",
          label: "Trail unlimited",
          price: 249,
          unit: OfferUnit.Month
        }
      ],
      reviews: [],
      tagIds: [TagId.Open247, TagId.MeetingRooms, TagId.CoffeeIncluded, TagId.LaptopFriendly]
    },
    {
      id: "la-cordee-jean-mace",
      cityId: CityId.Lyon,
      name: "La Cordée Jean Macé",
      typeId: PlaceTypeId.Coworking,
      address: "19 rue Pere Chevrier, 69007 Lyon",
      lat: 45.7487,
      lng: 4.8429,
      websiteUrl: "https://www.la-cordee.net/cordee/lyon/lyon/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Member access",
        details: "Laptop access follows La Cordee's formula-based membership."
      },
      notes: "La Cordee uses formula-based pricing, so offers are captured separately instead of inventing one monthly equivalent.",
      offers: [
        {
          id: "la-cordee-jean-mace-balade-fixed",
          label: "Balade fixed monthly fee",
          price: 35,
          unit: OfferUnit.Month
        },
        {
          id: "la-cordee-jean-mace-balade-hour",
          label: "Balade hourly presence",
          price: 3.25,
          unit: OfferUnit.Hour
        },
        {
          id: "la-cordee-jean-mace-trail",
          label: "Trail unlimited",
          price: 249,
          unit: OfferUnit.Month
        }
      ],
      reviews: [],
      tagIds: [TagId.Open247, TagId.Terrace, TagId.MeetingRooms, TagId.LaptopFriendly]
    },
    {
      id: "sofffa-terreaux",
      cityId: CityId.Lyon,
      name: "Sofffa Terreaux",
      typeId: PlaceTypeId.Cafe,
      address: "17 rue Sainte-Catherine, 69001 Lyon",
      lat: 45.76827,
      lng: 4.83392,
      websiteUrl: "https://sofffa.com/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Slow-cafe workspace model; laptop access follows the captured time-based offers."
      },
      notes: "Slow-cafe pricing is modeled through offers. Verify current rates before relying on them operationally.",
      offers: [
        {
          id: "sofffa-terreaux-hour",
          label: "First hour",
          price: 6,
          unit: OfferUnit.Hour
        },
        {
          id: "sofffa-terreaux-day",
          label: "Day pass",
          price: 24,
          unit: OfferUnit.Day
        }
      ],
      reviews: [],
      tagIds: [TagId.DayPass, TagId.CoffeeIncluded, TagId.LaptopFriendly]
    },
    {
      id: "patchwork-cafe",
      cityId: CityId.Lyon,
      name: "Patchwork Café",
      typeId: PlaceTypeId.Cafe,
      address: "146 cours Gambetta, 69007 Lyon",
      lat: 45.7499,
      lng: 4.8537,
      websiteUrl: "https://www.patchwork-cafe.com/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Tuesday to Friday",
        details: "Laptop-friendly cafe workspace with free fiber wifi; weekends are not captured as laptop-friendly."
      },
      notes: "Cafe-friendly workspace entry. Patchwork publishes free fiber wifi; no structured coworking offer has been captured yet.",
      offers: [],
      reviews: [],
      tagIds: [TagId.HighSpeedWifi, TagId.LaptopFriendly, TagId.WeekdayLaptop]
    },
    {
      id: "caillou-cafe-comptoir",
      cityId: CityId.Lyon,
      name: "Caillou Café Comptoir",
      typeId: PlaceTypeId.Cafe,
      address: "60 quai Pierre Scize, 69005 Lyon",
      lat: 45.7667135,
      lng: 4.8209186,
      websiteUrl: "https://www.instagram.com/cailloucc/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Monday to Friday",
        details: "Laptop-friendly on weekdays only; do not plan laptop work there on weekends."
      },
      notes: "Added from a local laptop-friendly note and cross-checked against laptop-friendly cafe listings.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekdayLaptop]
    },
    {
      id: "cafe-du-pond",
      cityId: CityId.Lyon,
      name: "Café Du Pond",
      typeId: PlaceTypeId.Cafe,
      address: "11 place Maréchal Lyautey, 69006 Lyon",
      lat: 45.7682466,
      lng: 4.8426912,
      websiteUrl: "https://cafedupondrestaurant.fr/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Laptop-friendly according to a local note; check current venue hours before going."
      },
      notes: "Added from a local laptop-friendly note.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop]
    },
    {
      id: "le-smooth-lyon",
      cityId: CityId.Lyon,
      name: "Le Smooth'Lyon",
      typeId: PlaceTypeId.Cafe,
      address: "15 rue d'Anvers, 69007 Lyon",
      lat: 45.7514478,
      lng: 4.8451385,
      websiteUrl: "https://www.lesmoothlyon.fr/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Monday to Saturday",
        details: "Laptop-friendly coworking cafe; a minimum order of 7 EUR is captured as a day offer."
      },
      notes: "Lyon Campus describes it as a coworking coffee bar with wifi and no subscription requirement.",
      offers: [
        {
          id: "le-smooth-lyon-day",
          label: "Minimum order",
          price: 7,
          unit: OfferUnit.Day
        }
      ],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.MinimumSpend, TagId.StudentFriendly]
    },
    {
      id: "le-r-de-gerland",
      cityId: CityId.Lyon,
      name: "Le R de Gerland",
      typeId: PlaceTypeId.Cafe,
      address: "5 place Vaclav Havel, 69007 Lyon",
      lat: 45.7389693,
      lng: 4.8346371,
      websiteUrl: "https://linktr.ee/lergerland",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Monday to Friday",
        details: "Cafe-coworking setup with sockets and daytime work usage; check current hours before going."
      },
      notes: "Nomadable lists sockets and work-friendly amenities for this cafe-coworking spot.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekdayLaptop, TagId.Outlets]
    },
    {
      id: "rakwe-lafayette",
      cityId: CityId.Lyon,
      name: "Rakwé Lafayette",
      typeId: PlaceTypeId.Cafe,
      address: "11 cours Lafayette, 69003 Lyon",
      lat: 45.7636795,
      lng: 4.8431906,
      websiteUrl: "https://www.rakwe.fr/Rakwe-le-shop.html",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Deskover describes this Rakwé as clearly designed for laptop work, with stable wifi."
      },
      notes: "Source-backed laptop-friendly coffee shop entry.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.HighSpeedWifi]
    },
    {
      id: "zeitgeist-cafe",
      cityId: CityId.Lyon,
      name: "Zeitgeist Café",
      typeId: PlaceTypeId.Cafe,
      address: "12 rue des Augustins, 69001 Lyon",
      lat: 45.7676631,
      lng: 4.8310263,
      websiteUrl: "https://zeitgeist-cafe.com/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Laptop-friendly cafe with reliable wifi and calm tables, especially outside rush hours."
      },
      notes: "Deskover includes Zeitgeist in its Lyon laptop-friendly cafe recommendations.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.HighSpeedWifi]
    },
    {
      id: "hopper",
      cityId: CityId.Lyon,
      name: "Hopper",
      typeId: PlaceTypeId.Cafe,
      address: "43 cours Gambetta, 69003 Lyon",
      lat: 45.7541648,
      lng: 4.8466086,
      websiteUrl: "https://www.instagram.com/hopperlyon/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Deskover lists wifi, wall outlets, and tables adapted for laptops."
      },
      notes: "Source-backed laptop-friendly cafe entry.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.Outlets]
    },
    {
      id: "equilibres-cafe",
      cityId: CityId.Lyon,
      name: "Équilibres Café",
      typeId: PlaceTypeId.Cafe,
      address: "4 rue Terme, 69001 Lyon",
      lat: 45.76904,
      lng: 4.83145,
      websiteUrl: "https://equilibres-cafe.fr/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Wednesday to Sunday",
        details: "Work-friendly upstairs area with wifi and outlets; closed Monday and Tuesday."
      },
      notes: "Recommended by Deskover and Passion Teletravail for working from a cafe.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.Outlets]
    },
    {
      id: "botani-cafe",
      cityId: CityId.Lyon,
      name: "BOTANI Café",
      typeId: PlaceTypeId.Cafe,
      address: "8 quai Claude Bernard, 69007 Lyon",
      lat: 45.75324,
      lng: 4.83768,
      websiteUrl: "https://botani-cafe.fr/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Tuesday to Saturday, 14:30-18:30",
        details: "Official laptop-friendly slot is the afternoon limonade and coffee service."
      },
      notes: "Passion Teletravail recommends it; the venue publishes a specific laptop-friendly afternoon window.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.Outlets]
    },
    {
      id: "cafe-joyeux-lyon",
      cityId: CityId.Lyon,
      name: "Café Joyeux Lyon",
      typeId: PlaceTypeId.Cafe,
      address: "13 rue Ferrandière, 69002 Lyon",
      lat: 45.7621318,
      lng: 4.8343977,
      websiteUrl: "https://www.cafejoyeux.com/fr/content/40-lyon",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Monday to Saturday",
        details: "Passion Teletravail lists it among cafes accepting remote workers with wifi."
      },
      notes: "Source-backed laptop-friendly cafe entry.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop]
    },
    {
      id: "les-cafetiers",
      cityId: CityId.Lyon,
      name: "Les Cafetiers",
      typeId: PlaceTypeId.Cafe,
      address: "36 rue Ferrandière, 69002 Lyon",
      lat: 45.7621176,
      lng: 4.8364337,
      websiteUrl: "https://lescafetiers.com/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Specific periods",
        details: "Work-friendly cafe listed by Passion Teletravail; hours can vary, so check before going."
      },
      notes: "Source-backed laptop-friendly cafe entry.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly]
    },
    {
      id: "belle-lurette",
      cityId: CityId.Lyon,
      name: "Belle Lurette",
      typeId: PlaceTypeId.Cafe,
      address: "34 rue de la Claire, 69009 Lyon",
      lat: 45.7794536,
      lng: 4.8047683,
      websiteUrl: "https://www.instagram.com/bellelurette_lyon/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Monday to Friday",
        details: "Neighborhood cafe recommended for work; weekends are not captured as laptop-friendly."
      },
      notes: "Passion Teletravail includes Belle Lurette among Lyon cafes suitable for remote work.",
      offers: [],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekdayLaptop]
    },
    {
      id: "le-36-ho36",
      cityId: CityId.Lyon,
      name: "Le 36 by HO36",
      typeId: PlaceTypeId.Cafe,
      address: "36 rue Montesquieu, 69007 Lyon",
      lat: 45.752923,
      lng: 4.84204,
      websiteUrl: "https://ho36lyon.com/le-36/",
      priceMonthlyEstimate: null,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "HO36 says the cafe offers high-speed wifi, outlets, and work amenities; consume a little if staying."
      },
      notes: "The venue suggests around 5 EUR of consumption for a half-day work session.",
      offers: [
        {
          id: "le-36-ho36-half-day",
          label: "Suggested consumption",
          price: 5,
          unit: OfferUnit.HalfDay
        }
      ],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.MinimumSpend, TagId.Outlets]
    },
    {
      id: "anticafe-lyon",
      cityId: CityId.Lyon,
      name: "Anticafé Lyon",
      typeId: PlaceTypeId.Cafe,
      address: "9 rue du Bât d'Argent, 69001 Lyon",
      lat: 45.7661653,
      lng: 4.835313,
      websiteUrl: "https://www.anticafe.eu/lyon",
      priceMonthlyEstimate: 260,
      priceCurrency: "EUR",
      laptopPolicy: {
        availability: "Every day",
        details: "Time-based cafe-coworking model with hourly, day, and monthly rates."
      },
      notes: "Coworking Lyon lists hourly, day, and monthly prices for Anticafe Lyon.",
      offers: [
        {
          id: "anticafe-lyon-hour",
          label: "Hourly access",
          price: 6,
          unit: OfferUnit.Hour
        },
        {
          id: "anticafe-lyon-day",
          label: "Day access",
          price: 26,
          unit: OfferUnit.Day
        },
        {
          id: "anticafe-lyon-month",
          label: "Monthly access",
          price: 260,
          unit: OfferUnit.Month
        }
      ],
      reviews: [],
      tagIds: [TagId.LaptopFriendly, TagId.WeekendLaptop, TagId.DayPass]
    }
  ]
} satisfies CoworkingData;
