export interface Retailer {
  id: RetailerId;
  label: string;
  hostname: string;
  order: number;
  searchUrl: string;
}

export type RetailerId = "oda" | "kiwi" | "meny";

export const retailers: Retailer[] = [
  {
    id: "oda",
    label: "Oda",
    hostname: "oda.com",
    order: 1,
    searchUrl: "https://oda.com/no/search/products/?q=",
  },
  {
    id: "kiwi",
    label: "KIWI",
    hostname: "kiwi.no",
    order: 2,
    searchUrl: "https://kiwi.no/sok/?query=",
  },
  {
    id: "meny",
    label: "MENY",
    hostname: "meny.no",
    order: 3,
    searchUrl: "https://meny.no/sok/?query=",
  },
];
