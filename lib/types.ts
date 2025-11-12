export type ReviewLink = { outlet: string; title: string; url: string };
export type EventItem = {
  id: string;
  title: string;
  org: string;
  genre: "Opera" | "Classical" | "Theater" | "Dance" | "Jazz";
  venue: string;
  neighborhood?: string;
  url: string;
  date: string;
  startTime?: string;
  endTime?: string;
  price?: string;
  blurb?: string;
  reviews?: ReviewLink[];
  source?: string;
};
