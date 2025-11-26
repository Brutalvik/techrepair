"use client";

import { Card, CardHeader, CardBody, Avatar } from "@heroui/react";
import { reviewsData } from "@/config/reviews";

// Updated StarIcon that handles Full, Empty, and Half states
const StarIcon = ({ state }: { state: "full" | "half" | "empty" }) => {
  const fillColor = {
    full: "#FBBF24", // Yellow
    empty: "#E5E7EB", // Gray
    half: "url(#half-star-gradient)", // Reference the gradient below
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill={fillColor[state]}
    >
      {/* Define a reusable gradient for the half-star.
         This splits the color 50% Yellow / 50% Gray 
      */}
      <defs>
        <linearGradient id="half-star-gradient">
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>

      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ReviewsSection = () => {
  const filteredReviews = reviewsData.filter((r) => r.rating >= 4.9);
  const scrollingReviews = [...filteredReviews, ...filteredReviews];

  return (
    <section className="w-full py-12 md:py-16 overflow-hidden bg-background">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Loved by Locals</h2>
        <div className="flex items-center justify-center gap-2 text-default-500">
          <span className="font-semibold text-lg">Google Reviews</span>
          <div className="flex">
            {/* Header stars are always full */}
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} state="full" />
            ))}
          </div>
          <span className="text-sm">(4.9/5.0 Average)</span>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="flex w-max animate-scroll gap-6 px-4">
          {scrollingReviews.map((review, index) => (
            <Card
              key={`${review.id}-${index}`}
              className="w-[300px] md:w-[350px] shrink-0 p-4"
              shadow="sm"
            >
              <CardHeader className="flex gap-3">
                <Avatar
                  showFallback
                  name={review.name}
                  src={review.avatar}
                  className="w-10 h-10 text-large"
                />
                <div className="flex flex-col">
                  <p className="text-md font-bold">{review.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-small font-semibold">
                      {review.rating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        // LOGIC: Determine if star is full, half, or empty
                        const diff = review.rating - i;
                        let state: "full" | "half" | "empty" = "empty";

                        if (diff >= 1) {
                          state = "full";
                        } else if (diff > 0 && diff < 1) {
                          // Matches 4.9 (where diff is 0.9) -> becomes half
                          state = "half";
                        }

                        return <StarIcon key={i} state={state} />;
                      })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="py-2">
                <p className="text-default-500 text-sm italic leading-relaxed">
                  &quot;{review.content}&quot;
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
