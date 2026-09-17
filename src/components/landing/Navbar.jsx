import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>


      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          w-full
          border-b
          transition-all
          duration-300
          ${
            isScrolled
              ? "border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
              : "border-transparent bg-white"
          }
        `}
      >
        <nav className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-10">

          <Link
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-2.5 sm:gap-4"
          >
            {/* Logo */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
              <img
                src="/app-logo.png"
                alt="Saitring Employee Manager"
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            </div>

            {/* Brand Text */}
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[20px]">
                Saitring Employee Manager
              </h1>

              <p className="mt-0.5 truncate text-[10px] text-slate-600 sm:mt-1 sm:text-sm">
                Aapke kaam, aapke log, ek jagah
              </p>
            </div>
          </Link>


          <div className="hidden items-center gap-8 lg:flex">

            <a
              href="#home"
              className="border-b-2 border-slate-900 px-1 py-7 text-[14px] font-semibold text-slate-900"
            >
              Home
            </a>

            <a
              href="#features"
              className="px-1 py-7 text-[14px] font-medium text-slate-700 transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="px-1 py-7 text-[14px] font-medium text-slate-700 transition hover:text-slate-950"
            >
              How it works
            </a>

            <a
              href="#contact"
              className="px-1 py-7 text-[14px] font-medium text-slate-700 transition hover:text-slate-950"
            >
              Contact
            </a>

          </div>

          <div className="hidden items-center gap-3 lg:flex">

            <Link
              to="/login"
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-slate-900
                transition
                hover:bg-slate-50
              "
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                bg-slate-900
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Create Account

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-900
              shadow-sm
              transition
              active:scale-95
              lg:hidden
            "
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </nav>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              top-full
              w-full
              border-t
              border-slate-200
              bg-white
              px-4
              py-4
              shadow-xl
              lg:hidden
            "
          >
            <div className="flex flex-col">

              <a
                href="#home"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-900
                  transition
                  hover:bg-slate-50
                "
              >
                Home
              </a>

              <a
                href="#features"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                How it works
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Contact
              </a>

              {/* Buttons */}
              <div
                className="
                  mt-3
                  grid
                  gap-2
                  border-t
                  border-slate-100
                  pt-4
                  sm:grid-cols-2
                "
              >

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-bold
                    text-slate-900
                    transition
                    hover:bg-slate-50
                  "
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="
                    rounded-xl
                    bg-slate-900
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-slate-800
                  "
                >
                  Create Account
                </Link>

              </div>

            </div>
          </div>
        )}

      </header>

      <div className="h-[72px] sm:h-20" />
    </>
  );
};

export default Navbar;
