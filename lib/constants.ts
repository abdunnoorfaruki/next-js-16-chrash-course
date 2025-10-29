export type EventItem = {
  id: string;
  title: string;
  image: string; // path under /images
  location: string;
  date: string; // ISO date (YYYY-MM-DD) when known
  time: string; // simple time string
  description: string;
  slug: string;
};

export const events: EventItem[] = [
  {
    id: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    image: "/images/event1.png",
    location: "San Francisco, CA, USA",
    date: "2026-02-18",
    time: "09:00",
    description:
      "Annual Next.js conference with core team talks, case studies, and ecosystem workshops.",
    slug: "https://nextjs.org/conf",
  },
  {
    id: "react-summit-2026",
    title: "React Summit 2026",
    image: "/images/event2.png",
    location: "Amsterdam, Netherlands",
    date: "2026-03-10",
    time: "09:30",
    description:
      "Global React conference — deep-dive sessions on React, concurrent rendering, and ecosystem patterns.",
    slug: "https://reactsummit.com",
  },
  {
    id: "aws-reinvent-2025",
    title: "AWS re:Invent 2025",
    image: "/images/event3.png",
    location: "Las Vegas, NV, USA",
    date: "2025-11-25",
    time: "08:00",
    description:
      "Large cloud conference covering AWS product updates, architecture patterns, and hands-on labs.",
    slug: "https://reinvent.aws",
  },
  {
    id: "kubecon-2026",
    title: "KubeCon + CloudNativeCon 2026",
    image: "/images/event4.png",
    location: "Barcelona, Spain",
    date: "2026-04-22",
    time: "09:00",
    description:
      "The Cloud Native community event — Kubernetes, service mesh, observability, and edge topics.",
    slug: "https://events.linuxfoundation.org/kubecon-cloudnativecon/",
  },
  {
    id: "jsconf-eu-2026",
    title: "JSConf EU 2026",
    image: "/images/event5.png",
    location: "Berlin, Germany",
    date: "2026-05-14",
    time: "10:00",
    description:
      "Independent JavaScript conference with community talks on language improvements, tooling, and best practices.",
    slug: "https://jsconf.com",
  },
  {
    id: "mlh-hackathon-finale-2026",
    title: "Major League Hacking — Global Hackathon Finale",
    image: "/images/event6.png",
    location: "Online & City Hubs",
    date: "2026-07-03",
    time: "12:00",
    description:
      "Hackathon focused on student-built projects, workshops, and startup matchmaking. Great for portfolio work.",
    slug: "https://mlh.io",
  },
];

export default events;
