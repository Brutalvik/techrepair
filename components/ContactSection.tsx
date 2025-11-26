"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Link,
  Divider,
} from "@heroui/react";

// --- Icons ---
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z"
      clipRule="evenodd"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

export const ContactSection = () => {
  const locations = [
    {
      id: "elveden",
      name: "Downtown (Elveden Centre)",
      address: "707 7 Ave SW Main Floor, Calgary, AB T2P 3H6",
      landmark: "Beside Good Earth Coffee",
      // Real Google Maps link for the button
      mapLink:
        "https://www.google.com/maps/place/707+7+Ave+SW,+Calgary,+AB+T2P+3H6",
      // Embed URL specific to this address
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2508.087548653466!2d-114.07753902328512!3d51.0481209717132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716fefcb41c729%3A0x8629454268852884!2s707%207%20Ave%20SW%2C%20Calgary%2C%20AB%20T2P%203H6!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca",
    },
    {
      id: "kensington",
      name: "Kensington",
      address: "1211 Kensington Rd NW #101, Calgary, AB T2N 3P6",
      landmark: "Unit #101",
      // Real Google Maps link for the button
      mapLink:
        "https://www.google.com/maps/place/1211+Kensington+Rd+NW+%23101,+Calgary,+AB+T2N+3P6",
      // Embed URL specific to this address
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.546087964949!2d-114.09012992328468!3d51.05842467171487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716f858258930f%3A0x7707963428620751!2s1211%20Kensington%20Rd%20NW%20%23101%2C%20Calgary%2C%20AB%20T2N%203P6!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca",
    },
  ];

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-content1/30 w-full"
    >
      <div className="text-center mb-6 max-w-2xl px-4">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg text-default-500 mb-6">
          Ready to get your device fixed? Visit us at one of our two locations
          or give us a call.
        </p>

        {/* Phone Numbers Area */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            as={Link}
            href="tel:+14034625456"
            color="primary"
            variant="flat"
            size="lg"
            startContent={<PhoneIcon className="w-5 h-5" />}
          >
            +1 (403) 462-5456
          </Button>
          <Button
            as={Link}
            href="tel:+18254544444"
            color="secondary"
            variant="flat"
            size="lg"
            startContent={<PhoneIcon className="w-5 h-5" />}
          >
            +1 (825) 454-4444
          </Button>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 w-full max-w-5xl items-start">
        {locations.map((loc) => (
          <Card key={loc.id} className="p-2" shadow="sm">
            <CardHeader className="flex gap-3 pb-2">
              <div className="p-2 bg-primary/10 rounded-full shrink-0">
                <MapPinIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold line-clamp-1">{loc.name}</p>
                <p className="text-small text-default-500 line-clamp-1">
                  {loc.landmark}
                </p>
              </div>
            </CardHeader>

            <Divider />

            <CardBody className="py-4 flex flex-col gap-4">
              {/* Address Text */}
              <p className="text-default-600 font-medium text-sm h-10">
                {loc.address}
              </p>

              {/* Embedded Google Map */}
              <div className="w-full h-[200px] rounded-xl overflow-hidden bg-default-100">
                <iframe
                  src={loc.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>

              {/* External Link Button */}
              <Button
                as={Link}
                href={loc.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                className="w-full"
              >
                Open in Google Maps
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};
