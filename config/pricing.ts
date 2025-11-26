// config/pricing.ts

export type ServiceItem = {
  name: string;
  price: string;
  duration: string;
};

export type PricingCategory = {
  id: string;
  title: string;
  description: string;
  services: ServiceItem[];
};

export const pricingData: PricingCategory[] = [
  {
    id: "smartphones",
    title: "Smartphone Repairs",
    description: "iPhones, Samsung Galaxy, Pixel, and more.",
    services: [
      {
        name: "Screen Replacement (OLED)",
        price: "$89.00",
        duration: "1 Hour",
      },
      { name: "Battery Replacement", price: "$49.00", duration: "45 Mins" },
      { name: "Charging Port Repair", price: "$59.00", duration: "1 Hour" },
      { name: "Back Glass Repair", price: "$79.00", duration: "2 Hours" },
      {
        name: "Water Damage Cleaning",
        price: "$39.00",
        duration: "2-24 Hours",
      },
    ],
  },
  {
    id: "laptops",
    title: "Computer & Laptop",
    description: "MacBook, Dell, HP, Lenovo, and Custom PCs.",
    services: [
      { name: "Screen Replacement", price: "$149.00", duration: "2 Hours" },
      { name: "Keyboard Replacement", price: "$89.00", duration: "2 Hours" },
      { name: "Battery Replacement", price: "$79.00", duration: "1 Hour" },
      { name: "SSD Upgrade (1TB)", price: "$129.00", duration: "1 Hour" },
      { name: "Virus Removal & Tune-up", price: "$59.00", duration: "2 Hours" },
    ],
  },
  {
    id: "consoles",
    title: "Game Consoles",
    description: "PS5, Xbox Series X, Nintendo Switch.",
    services: [
      { name: "HDMI Port Repair", price: "$89.00", duration: "2 Hours" },
      { name: "Overheating/Cleaning", price: "$49.00", duration: "1 Hour" },
      { name: "Disc Drive Repair", price: "$79.00", duration: "1 Hour" },
      { name: "Controller Drift Fix", price: "$29.00", duration: "30 Mins" },
    ],
  },
  {
    id: "tablets",
    title: "Tablets & iPads",
    description: "iPad Pro, Air, Mini, and Android Tablets.",
    services: [
      { name: "Glass/Digitizer Repair", price: "$79.00", duration: "2 Hours" },
      { name: "LCD & Glass Assembly", price: "$129.00", duration: "2 Hours" },
      { name: "Battery Replacement", price: "$69.00", duration: "1 Hour" },
      { name: "Charging Port Repair", price: "$59.00", duration: "1 Hour" },
    ],
  },
];
