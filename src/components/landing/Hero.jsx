import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full bg-slate-950"
    >
      <div
        className="
          relative
          mx-auto
          w-full
          overflow-hidden
          bg-slate-950

          lg:max-w-[1470px]
        "
      >
  
        <img
          src="/images/landing-hero.png"
          alt="Construction workers working on a building site"
          className="
            block
            h-auto
            w-full
            object-contain
            object-center
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/5
          "
        />
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-transparent
            via-slate-950/10
            to-slate-950/95

            lg:hidden
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            hidden
            lg:block
            bg-gradient-to-r
            from-slate-950/90
            via-slate-950/55
            to-transparent
          "
        />

  
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-[45%]
            bg-gradient-to-t
            from-slate-950
            via-slate-950/65
            to-transparent

            lg:hidden
          "
        />


        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-end

            px-5
            pb-8

            sm:px-7
            sm:pb-10

            md:pb-12

            lg:items-center
            lg:px-12
            lg:pb-0
          "
        >
          <div
            className="
              w-full
              max-w-[660px]

              lg:max-w-[620px]
            "
          >
            {/* Badge */}
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/30
                bg-white/15
                px-3
                py-2
                text-[11px]
                font-semibold
                text-white
                shadow-lg
                backdrop-blur-md

                sm:mb-5
                sm:px-4
                sm:py-2.5
                sm:text-xs
              "
            >
              <CheckCircle2
                size={14}
                strokeWidth={2.3}
              />

              Saitring ke kaam ke liye
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-[390px]
                text-[34px]
                font-extrabold
                leading-[1.02]
                tracking-[-0.04em]
                text-white

                xs:text-[38px]

                sm:max-w-[550px]
                sm:text-[46px]

                md:text-[50px]

                lg:max-w-[620px]
                lg:text-[54px]
                lg:leading-[1.05]

                xl:text-[58px]
              "
            >
              Apne Saitring ka
              <br />

              poora hisaab,

              <br className="sm:hidden" />

              ab aur

              <br className="hidden sm:block" />

              bhi aasaan.
            </h1>

            {/* Description */}
            <p
              className="
                mt-4
                max-w-[570px]
                text-[13px]
                leading-5
                text-white/90

                sm:mt-5
                sm:text-[15px]
                sm:leading-6

                md:text-[16px]
                md:leading-7

                lg:mt-6
                lg:text-[17px]
              "
            >
              Apne employees ko manage karein,
              attendance rakhein, advance likhein aur
              mahine ka hisaab ek hi jagah se aasani se
              handle karein.
            </p>

            {/* Buttons */}
            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-2.5

                sm:mt-6
                sm:flex
                sm:flex-row
                sm:gap-3

                lg:mt-7
              "
            >
              <Link
                to="/register"
                className="
                  group
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  text-[14px]
                  font-bold
                  text-slate-900
                  shadow-xl
                  transition-all
                  duration-200
                  hover:bg-slate-100
                  active:scale-[0.99]

                  sm:w-auto
                  sm:px-6
                "
              >
                Create Owner Account

                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                to="/login"
                className="
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/40
                  bg-white/10
                  px-5
                  text-[14px]
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-200
                  hover:bg-white
                  hover:text-slate-900
                  active:scale-[0.99]

                  sm:w-auto
                  sm:px-7
                "
              >
                Sign In
              </Link>
            </div>

            {/* Features */}
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-x-4
                gap-y-2
                text-[11px]
                font-medium
                text-white/90

                sm:mt-5
                sm:gap-x-5
                sm:text-xs

                md:text-sm
              "
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={14}
                  strokeWidth={2}
                />
                Employee records
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={14}
                  strokeWidth={2}
                />
                Daily attendance
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={14}
                  strokeWidth={2}
                />
                Monthly hisaab
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
