import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          gap-5
          px-4
          py-7
          sm:px-8
          sm:py-8
          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:px-12
        "
      >
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 sm:gap-4"
        >
          {/* Logo */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
            <img
              src="/app-logo.png"
              alt="Saitring Employee Manager"
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />
          </div>

          {/* Brand Text */}
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[20px]">
              Saitring Employee Manager
            </h2>

            <p className="mt-1 text-[11px] text-slate-600 sm:text-sm">
              Aapke kaam, aapke log, ek jagah
            </p>
          </div>
        </Link>

        {/* Copyright */}
        <p className="text-[11px] text-slate-500 sm:text-sm">
          © {new Date().getFullYear()} Saitring Employee Manager. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;