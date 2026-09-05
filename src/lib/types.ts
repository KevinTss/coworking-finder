export type OfferUnit = "hour" | "half_day" | "day" | "week" | "month";

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  default_zoom: number;
}

export interface PlaceType {
  id: string;
  label: string;
  icon: string;
}

export interface Place {
  id: string;
  city_id: string;
  name: string;
  type_id: string;
  address: string;
  lat: number;
  lng: number;
  website_url: string;
  price_monthly_estimate: number | null;
  price_currency: string;
  notes: string | null;
}

export interface Offer {
  id: string;
  place_id: string;
  label: string;
  price: number;
  unit: OfferUnit;
}

export interface Tag {
  id: string;
  label: string;
}

export interface PlaceTag {
  place_id: string;
  tag_id: string;
}

export interface Review {
  id: string;
  place_id: string;
  tester_name: string;
  tester_link: string | null;
  rating: number | null;
  comment: string;
  date: string;
}

export interface SiteConfig {
  site_title: string;
  default_city: string;
  author: {
    name: string;
    linkedin_url: string;
    github_url: string;
  };
}

export interface EnrichedPlace extends Place {
  city: City;
  type: PlaceType;
  offers: Offer[];
  tags: Tag[];
  reviews: Review[];
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
