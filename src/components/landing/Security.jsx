import React from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  UserRoundCheck,
} from "lucide-react";

const Security = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-2 lg:items-center lg:gap-12">
        {/* Left */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
            Security & Reliability
          </span>

          <h2 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Aapke employee records,
            <br className="hidden sm:block" />
            aapki zimmedari.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7">
            Employee details, attendance aur financial records ko ek
            controlled workspace mein organize karke rakhein.
          </p>

          {/* Controlled Workspace */}
          <div className="mt-6 flex items-center gap-3 sm:mt-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white sm:h-12 sm:w-12">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Controlled workspace
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Important records ek hi jagah organized.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <LockKeyhole className="text-slate-800" size={22} />

            <h3 className="mt-4 font-bold text-slate-900 sm:mt-5">
              Secure Access
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Owner-based access se application ko controlled rakhein.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <Database className="text-slate-800" size={22} />

            <h3 className="mt-4 font-bold text-slate-900 sm:mt-5">
              Organized Records
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Employee aur attendance data ko structured form mein rakhein.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md sm:col-span-2 sm:p-6">
            <UserRoundCheck className="text-slate-800" size={22} />

            <h3 className="mt-4 font-bold text-slate-900 sm:mt-5">
              Simple Employee Management
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Employee details, attendance, advances aur monthly settlement
              ko ek consistent workflow ke through manage karein.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;