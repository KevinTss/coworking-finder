export const CityId = {
  Lyon: "lyon"
} as const;

export type CityId = (typeof CityId)[keyof typeof CityId];

export const PlaceTypeId = {
  Cafe: "cafe",
  Coworking: "coworking"
} as const;

export type PlaceTypeId = (typeof PlaceTypeId)[keyof typeof PlaceTypeId];

export const OfferUnit = {
  Day: "day",
  HalfDay: "half_day",
  Hour: "hour",
  Month: "month",
  Week: "week"
} as const;

export type OfferUnit = (typeof OfferUnit)[keyof typeof OfferUnit];

export const TagId = {
  CoffeeIncluded: "coffee-included",
  DayPass: "day-pass",
  HighSpeedWifi: "high-speed-wifi",
  LaptopFriendly: "laptop-friendly",
  MeetingRooms: "meeting-rooms",
  MinimumSpend: "minimum-spend",
  Open247: "open-24-7",
  Outlets: "outlets",
  PhoneBox: "phone-box",
  StudentFriendly: "student-friendly",
  Terrace: "terrace",
  WeekdayLaptop: "weekday-laptop",
  WeekendLaptop: "weekend-laptop"
} as const;

export type TagId = (typeof TagId)[keyof typeof TagId];

export interface City {
  id: CityId;
  name: string;
  country: string;
  lat: number;
  lng: number;
  defaultZoom: number;
}

export interface PlaceType {
  id: PlaceTypeId;
  label: string;
  icon: string;
}

export interface LaptopPolicy {
  availability: string;
  details: string;
}

export interface Offer {
  id: string;
  label: string;
  price: number;
  unit: OfferUnit;
}

export interface Tag {
  id: TagId;
  label: string;
}

export interface Review {
  id: string;
  testerName: string;
  testerLink: string | null;
  rating: number | null;
  comment: string;
  date: string;
}

export interface Place {
  id: string;
  cityId: CityId;
  name: string;
  typeId: PlaceTypeId;
  address: string;
  lat: number;
  lng: number;
  websiteUrl: string;
  priceMonthlyEstimate: number | null;
  priceCurrency: string;
  laptopPolicy: LaptopPolicy;
  notes: string | null;
  offers: Offer[];
  reviews: Review[];
  tagIds: TagId[];
}

export interface SiteConfig {
  siteTitle: string;
  defaultCity: CityId;
  lastUpdatedAt: string;
  author: {
    name: string;
    linkedinUrl: string;
    githubUrl: string;
  };
}

export interface CoworkingData {
  config: SiteConfig;
  cities: City[];
  placeTypes: PlaceType[];
  tags: Tag[];
  places: Place[];
}

export interface EnrichedPlace extends Place {
  city: City;
  type: PlaceType;
  tags: Tag[];
  averageRating: number | null;
  cheapestOffer: Offer | null;
}

export interface DataSet {
  cities: City[];
  placeTypes: PlaceType[];
  places: EnrichedPlace[];
  tags: Tag[];
  config: SiteConfig;
}
