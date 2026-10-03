export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  timeAgo: string;
  photos?: string[];
};

export const testimonials: Testimonial[] = [
  {
    id: "mrs-laila",
    name: "Mrs Laila",
    role: "Google Review",
    quote:
      "Satisfied with the mechanics’ expertise, especially in handling Daihatsu Taft models.\nThe service center provides a comfortable waiting area with basic amenities.\nServices are reasonably quick and efficient.\nService charges are considered fair and align with market standards.\nS.A.G Bukit Mertajam is a reliable choice for Daihatsu Taft owners seeking quality service.",
    avatar: "/images/reviews/profile/mrslaila.png",
    timeAgo: "",
    photos: ["/images/reviews/mrslaila.webp"],
  },
  {
    id: "ainriduan",
    name: "ainriduan",
    role: "Google Review",
    quote:
      "This is the place I always go to for servicing both of my cars. Very reliable, with knowledgeable staff and great customer service.\n\nThe waiting room is clean, air-conditioned, and fully equipped with snacks and drinks. The only downside this time was that the TV was not working, so it can get a little boring if the waiting time is long.\n\nOther than that, the car service here is tip-top. I’ve been sending my car to SAG for almost 10 years now, and they have always been reliable.",
    avatar: "/images/reviews/profile/ainriduanprofile.png",
    timeAgo: "",
    photos: ["/images/reviews/ainriduan.webp", "/images/reviews/ainriduan2.webp"],
  },
  {
    id: "how-hock-keong",
    name: "How Hock Keong",
    role: "Google Review",
    quote:
      "I had a really great experience at Smart Autocare Garage (Chan Sow Lin branch) and wanted to share my appreciation.\n\nThe service provided was professional, honest, and very efficient. The team took the time to properly diagnose my car issues and explained everything clearly, which gave me a lot of confidence.\n\nA special thank you to Ms. Angel for her excellent support. She was very helpful in identifying the problem with my car and went the extra mile to assist me with the steering rack warranty claim due to the fault. Her dedication and customer care truly made the whole process smooth and stress-free.\n\nHighly recommended workshop if you are looking for reliable and trustworthy service 👍",
    avatar: "/images/reviews/profile/howheckkeongprofile.png",
    timeAgo: "",
    photos: ["/images/reviews/howhockheng.webp"],
  },
  {
    id: "yongxuan-sooi",
    name: "YongXuan Sooi",
    role: "Google Review",
    quote:
      "This is my first time coming here because I'm still under warranty, but I didn't expect it to be so close to my dorm and for the workshop to be so high-end. It's rare to find such a place. My first impression is that the environment is comfortable, with air conditioning, a waiting area, and even a glass-walled waiting room where you can see your car being serviced. There's also a snack area with water, instant noodles, nasi lemak, and coffee. The service adviser, Wan, has excellent service; he responds quickly on WhatsApp and doesn't give generic replies. The main reason I came was to check my gearbox because I think there might be an issue. So, I took it to them for inspection. I went for a test ride with their manager, and he was very professional, though his serious attitude made the ride feel a bit intense. It probably has to do with his serious appearance. After half a day, they initially diagnosed that the gear level bush was damaged and needed to be replaced. They worked fast and got it done in about 1 or 2 days. When I picked up the car, it was already washed. I’ll definitely consider coming here for maintenance next time.",
    avatar: "/images/reviews/profile/yongxuan.png",
    timeAgo: "",
    photos: [
      "/images/reviews/yongxuan.webp",
      "/images/reviews/yongxuan2.webp",
      "/images/reviews/yongxuan3.webp",
    ],
  },
  {
    id: "bezerk0n",
    name: "BezerK0N",
    role: "Google Review",
    quote:
      "Faced a major issue with my Volkswagen Passat. They quite literally rescued me from my troubles. Special mention to the executive Mr. Ruzaiman who guided me and provided me updates of my car and told me when to come again for further maintenance. Would recommend coming here if you have Smart warranty.",
    avatar: "/images/testimonials/bezerk0n.png",
    timeAgo: "3 months ago",
    photos: [
      "/images/reviews/bezer.webp",
      "/images/reviews/bezer2.webp",
      "/images/reviews/bezer3.webp",
    ],
  },
  {
    id: "daniel-ng",
    name: "Daniel Ng",
    role: "Google Review",
    quote:
      "Service car as warranty, the supervisor sharvin explained in detail what are the most common issue that needed to replace for servicing. Job done quickly despite 6-7 car needed to be service. Great servicing team to ensure car is ready.",
    avatar: "/images/testimonials/daniel-ng.png",
    timeAgo: "4 months ago",
  },
  {
    id: "eunice-liu",
    name: "Eunice Liu",
    role: "Google Review",
    quote:
      "Big thanks to Smart Auto Garage for fixing my car! I really appreciate the staff who received my car even though it was a Sunday. The whole process was smooth and professional. They kept me updated, explained everything clearly, and the price was very reasonable. Honest service, fair pricing, and friendly people. Highly recommend if you're looking for a reliable workshop!",
    avatar: "/images/testimonials/eunice-liu.png",
    timeAgo: "2 months ago",
  },
  {
    id: "dylan-choo",
    name: "Dylan Choo",
    role: "Google Review",
    quote:
      "I have been sending my vellfire to SAG for its periodic service over the past 6 years. Their service and responsiveness has always been superb. Thumbs up especially to their service advisor Isha for her great service.",
    avatar: "/images/testimonials/dylan-choo.png",
    timeAgo: "5 months ago",
  },
  {
    id: "khairi-hadi",
    name: "khairi hadi",
    role: "Google Review",
    quote:
      "I'm here to service my mini clubman as warranty is also taken care of by this service centre. Satisfied so far with their service. The crews are friendly and attentive, especially Wan (service advisor). He really tried his best to solve all my issues. I would recommend this service centre to anyone who is looking for reliable service advisors and mechanics.",
    avatar: "/images/testimonials/khairi-hadi.png",
    timeAgo: "1 month ago",
  },
  {
    id: "goh-kok-seong",
    name: "Goh Kok Seong",
    role: "Google Review",
    quote:
      "Mr. Wan provided excellent service during my car maintenance and offered valuable advice. I will definitely return. However, I have a suggestion: if SAG Service Center could speed up their service and repairs, it would be perfect. 😉",
    avatar: "/images/testimonials/goh-kok-seong.png",
    timeAgo: "6 weeks ago",
  },
];
