// config/reviews.ts

export type Review = {
  id: string;
  name: string;
  avatar: string; // URL to an image or empty string for initials
  rating: number;
  content: string;
  date: string;
};

export const reviewsData: Review[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    rating: 5.0,
    content:
      "Absolutely amazing service. They fixed my MacBook screen in under 2 hours. Highly recommended!",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    rating: 5.0,
    content:
      "Honest pricing and great communication. I thought my phone was a goner, but they brought it back to life.",
    date: "1 week ago",
  },
  {
    id: "3",
    name: "Emily R.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    rating: 4.0, // THIS SHOULD BE FILTERED OUT
    content: "Good service but took a bit longer than expected.",
    date: "3 weeks ago",
  },
  {
    id: "4",
    name: "David Smith",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    rating: 4.9,
    content: "Professional and fast. The new battery works perfectly.",
    date: "1 month ago",
  },
  {
    id: "5",
    name: "Jessica Wu",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    rating: 5.0,
    content: "Best tech repair in Calgary. Don't go anywhere else!",
    date: "1 month ago",
  },
  {
    id: "6",
    name: "Tom H.",
    avatar: "",
    rating: 3.5, // THIS SHOULD BE FILTERED OUT
    content: "It was okay.",
    date: "2 months ago",
  },
  {
    id: "7",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    rating: 5.0,
    content:
      "Saved my data when the Apple Store said it was impossible. Customers for life!",
    date: "2 months ago",
  },
];
