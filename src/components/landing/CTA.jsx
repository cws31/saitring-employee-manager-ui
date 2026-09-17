import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section
      id="contact"
      className="bg-slate-50 px-4 py-10 sm:px-8 sm:py-16 lg:px-10"
    >
      <div
        className="
          relative
          mx-auto
          max-w-7xl
          overflow-hidden
          rounded-[24px]
          bg-slate-950
          px-5
          py-8
          sm:px-10
          sm:py-12
          lg:px-16
          lg:py-14
        "
      >
        {/* Background Glow */}
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-slate-700/30 blur-3xl" />

        <div
          className="
            relative
            flex
            flex-col
            gap-7
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Content */}
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Get started
            </p>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Apna kaam aur hisaab
              <br className="hidden sm:block" />
              aaj se simple banayein.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Employee management ko ek organized aur easy-to-use
              workspace mein le aayein.
            </p>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <Link
              to="/register"
              className="
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-6
                text-sm
                font-bold
                text-slate-900
                shadow-lg
                transition
                hover:bg-slate-100
                sm:w-auto
              "
            >
              Create Owner Account

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;