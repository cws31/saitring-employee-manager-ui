import React from "react";
import {
  UserPlus,
  CalendarCheck2,
  Wallet,
  Calculator,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Employees add karein",
    description:
      "Apne workers ki basic details ek baar add karein aur sabhi records ek jagah manage karein.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Attendance mark karein",
    description:
      "Har din employee ki attendance quickly mark karein aur daily record maintain karein.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Advance record karein",
    description:
      "Employee ko diye gaye daily advance ko record karein taaki hisaab clear rahe.",
  },
  {
    number: "04",
    icon: Calculator,
    title: "Hisaab automatically",
    description:
      "System attendance aur advance ke records ke basis par monthly hisaab calculate karta hai.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Heading */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center gap-4">
            <span className="hidden h-px w-14 bg-slate-300 sm:block" />

            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Saitring Employee Manager
            </h2>

            <span className="hidden h-px w-14 bg-slate-300 sm:block" />
          </div>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Aapke kaam ko banayein aur bhi behtar
          </p>
        </div>

        {/* Steps */}
        <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  sm:p-6
                "
              >
                <div className="flex items-center justify-between">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-900
                      text-white
                      transition
                      group-hover:scale-105
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-3xl font-extrabold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-[15px] font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;