export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  timeAgo: string;
  photos?: [string, string];
};

export const testimonials: Testimonial[] = [
  {
    id: "bezerk0n",
    name: "BezerK0N",
    role: "Google Review",
    quote:
      "Faced a major issue with my Volkswagen Passat. They quite literally rescued me from my troubles. Special mention to the executive Mr. Ruzaiman who guided me and provided me updates of my car and told me when to come again for further maintenance. Would recommend coming here if you have Smart warranty.",
    avatar: "/images/testimonials/bezerk0n.png",
    timeAgo: "3 months ago",
    photos: ["/images/branches/branch-01.jpg", "/images/branches/branch-02.jpg"],
  },
  {
    id: "daniel-ng",
    name: "Daniel Ng",
    role: "Google Review",
    quote:
      "Service car as warranty, the supervisor sharvin explained in detail what are the most common issue that needed to replace for servicing. Job done quickly despite 6-7 car needed to be service. Great servicing team to ensure car is ready.",
    avatar: "/images/testimonials/daniel-ng.png",
    timeAgo: "4 months ago",
    photos: ["/images/branches/branch-05.jpg", "/images/branches/branch-03.jpg"],
  },
  {
    id: "eunice-liu",
    name: "Eunice Liu",
    role: "Google Review",
    quote:
      "Big thanks to Smart Auto Garage for fixing my car! I really appreciate the staff who received my car even though it was a Sunday. The whole process was smooth and professional. They kept me updated, explained everything clearly, and the price was very reasonable. Honest service, fair pricing, and friendly people. Highly recommend if you're looking for a reliable workshop!",
    avatar: "/images/testimonials/eunice-liu.png",
    timeAgo: "2 months ago",
    photos: ["/images/branches/branch-04.jpg", "/images/branches/branch-06.jpg"],
  },
  {
    id: "dylan-choo",
    name: "Dylan Choo",
    role: "Google Review",
    quote:
      "I have been sending my vellfire to SAG for its periodic service over the past 6 years. Their service and responsiveness has always been superb. Thumbs up especially to their service advisor Isha for her great service.",
    avatar: "/images/testimonials/dylan-choo.png",
    timeAgo: "5 months ago",
    photos: ["/images/branches/branch-07.jpg", "/images/branches/branch-08.jpg"],
  },
  {
    id: "khairi-hadi",
    name: "khairi hadi",
    role: "Google Review",
    quote:
      "I'm here to service my mini clubman as warranty is also taken care of by this service centre. Satisfied so far with their service. The crews are friendly and attentive, especially Wan (service advisor). He really tried his best to solve all my issues. I would recommend this service centre to anyone who is looking for reliable service advisors and mechanics.",
    avatar: "/images/testimonials/khairi-hadi.png",
    timeAgo: "1 month ago",
    photos: ["/images/branches/branch-09.jpg", "/images/branches/branch-10.jpg"],
  },
  {
    id: "goh-kok-seong",
    name: "Goh Kok Seong",
    role: "Google Review",
    quote:
      "Mr. Wan provided excellent service during my car maintenance and offered valuable advice. I will definitely return. However, I have a suggestion: if SAG Service Center could speed up their service and repairs, it would be perfect. 😉",
    avatar: "/images/testimonials/goh-kok-seong.png",
    timeAgo: "6 weeks ago",
    photos: ["/images/branches/branch-01.jpg", "/images/branches/branch-05.jpg"],
  },
];

export const featuredTestimonials = testimonials.slice(0, 3);
