"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@heroui/react";
import { pricingData } from "@/config/pricing";

export const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
    >
      <div className="text-center mb-10 max-w-2xl px-4">
        <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
        <p className="text-lg text-default-500">
          No hidden fees. We provide free diagnostics for all devices. Prices
          may vary slightly based on specific models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-4 w-full max-w-7xl">
        {pricingData.map((category) => (
          <Card key={category.id} className="p-3" shadow="sm">
            <CardHeader className="flex flex-col items-start px-4 pb-0 pt-2">
              <h3 className="text-xl font-bold">{category.title}</h3>
              <p className="text-small text-default-500 mt-1">
                {category.description}
              </p>
            </CardHeader>

            <Divider className="my-4" />

            <CardBody className="overflow-visible py-2">
              <ul className="flex flex-col gap-3">
                {category.services.map((service, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center w-full"
                  >
                    <div className="flex flex-col">
                      <span className="text-medium font-medium">
                        {service.name}
                      </span>
                      <span className="text-tiny text-default-400">
                        {service.duration}
                      </span>
                    </div>
                    <span className="text-large font-bold">
                      {service.price}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>

            <Divider className="my-4" />

            <CardFooter>
              <Button
                className="w-full"
                color="primary"
                variant="solid"
                radius="full"
              >
                Book {category.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
