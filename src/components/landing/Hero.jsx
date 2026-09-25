import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative
        -mt-0
        bg-slate-950
        px-0
        py-0
        sm:px-0
        sm:py-0
        lg:px-8
        lg:py-6
      "
    >
      <div
        className="
          relative
          mx-auto
          min-h-[880px]
          w-full
          overflow-hidden
          bg-slate-950

          sm:min-h-[820px]

          lg:min-h-[600px]
          lg:max-w-[1470px]
          lg:rounded-none
        "
      >
<img
  src="/images/landing-hero.png"
  alt="Construction workers working on a building site"
  className="
    absolute
    left-0
    top-[-40px]
    h-auto
    w-full
    object-contain
    object-top

    sm:top-[-30px]

    lg:inset-0
    lg:h-full
    lg:w-full
    lg:object-cover
    lg:object-center
  "
/>

        <div
          className="
            absolute
            inset-0
            bg-black/5
          "
        />

        <div
          className="
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
            absolute
            inset-0
            hidden
            lg:block
            lg:bg-gradient-to-r
            lg:from-slate-950/90
            lg:via-slate-950/55
            lg:to-transparent
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-[48%]

            bg-gradient-to-t
            from-slate-950
            via-slate-950/70
            to-transparent

            lg:hidden
          "
        />

      
<div
  className="
    relative
    z-10
    flex
    min-h-[880px]
    flex-col
    justify-start
    px-5
    pt-[34vh]
    pb-8

    sm:min-h-[820px]
    sm:px-7
    sm:pt-[29vh]

    lg:min-h-[600px]
    lg:items-center
    lg:justify-center
    lg:px-12
    lg:py-12
  "
>
          <div
            className="
              w-full
              max-w-[660px]

              lg:max-w-[620px]
            "
          >
          

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


            <h1
              className="
                max-w-[390px]
                text-[38px]
                font-extrabold
                leading-[1.02]
                tracking-[-0.04em]
                text-white

                sm:max-w-[550px]
                sm:text-[46px]

                lg:max-w-[620px]
                lg:text-[54px]
                lg:leading-[1.05]
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


            <p
              className="
                mt-5
                max-w-[570px]
                text-[14px]
                leading-6
                text-white/90

                sm:mt-6
                sm:text-[16px]
                sm:leading-7

                lg:text-[17px]
              "
            >
              Apne employees ko manage karein,
              attendance rakhein, advance likhein aur
              mahine ka hisaab ek hi jagah se aasani se
              handle karein.
            </p>


            <div
              className="
                mt-6
                grid
                grid-cols-1
                gap-2.5

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

                  sm:h-13
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

                  sm:h-13
                  sm:w-auto
                  sm:px-7
                "
              >
                Sign In
              </Link>
            </div>


            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-x-5
                gap-y-3
                text-[12px]
                font-medium
                text-white/90

                sm:mt-6
                sm:gap-x-6
                sm:text-sm
              "
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={15}
                  strokeWidth={2}
                />

                Employee records
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={15}
                  strokeWidth={2}
                />

                Daily attendance
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2
                  size={15}
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