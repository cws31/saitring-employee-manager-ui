import React from "react";
import {
  Users,
  CalendarDays,
  Wallet,
  BarChart3,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Naye employee add karein, details update karein, block/unblock karein, remove bhi kar sakte hain.",
  },
  {
    icon: CalendarDays,
    title: "Daily Attendance",
    description:
      "Har din ka attendance aasaan tarike se mark karein aur employee ka record ek hi jagah rakhein.",
  },
  {
    icon: Wallet,
    title: "Daily Advance",
    description:
      "Roz ke advance likhein taaki har employee ka poora record clear rahe.",
  },
  {
    icon: BarChart3,
    title: "Automatic Hisab",
    description:
      "Attendance aur advance ke record ke basis par system employee ka current hisab calculate karta hai.",
  },
  {
    icon: Receipt,
    title: "Month Closing",
    description:
      "Mahine ke end me hisab close karein aur zarurat padne par settlement amount add karein.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Aapke organization aur employee records ko controlled workspace me manage karna aasaan.",
  },
];

const Features = () => {
  return (
    <section id="features" className="w-full bg-white">
      <div
        className="
          mx-auto
          grid
          w-full
          grid-cols-1
          sm:grid-cols-2
          lg:max-w-[1600px]
          lg:grid-cols-6
        "
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;