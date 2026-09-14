import {
  LogOut,
  Menu,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";


export default function Topbar({
  onMenuClick,
}) {

  const {
    owner,
    logout,
  } = useAuth();


  const logoUrl =
    owner?.logoUrl || null;


  const organizationName =
    owner?.organizationName || "Organization";


  return (

    <header className="sticky top-0 z-30 h-[64px] border-b border-gray-200 bg-white sm:h-[72px] lg:h-[76px]">

      <div className="flex h-full items-center justify-between px-3 sm:px-5 lg:px-8">

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >

            <Menu size={22} />

          </button>

          <div className="flex min-w-0 items-center gap-2.5">


            {/* Logo */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 sm:h-10 sm:w-10">

              {logoUrl ? (

                <img
                  src={logoUrl}
                  alt={`${organizationName} logo`}
                  className="h-full w-full object-contain"
                  onError={(event) => {

                    console.error(
                      "[TOPBAR] Failed to display owner logo."
                    );

                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              ) : (

                <span className="text-xs font-semibold text-slate-700 sm:text-sm">

                  {organizationName
                    .substring(0, 2)
                    .toUpperCase()}

                </span>

              )}

            </div>


            {/* Organization Name */}

            <div className="min-w-0">

              <span className="block max-w-[200px] truncate text-xs font-bold uppercase tracking-tight text-gray-900 sm:max-w-[280px] sm:text-sm md:text-base">

                {organizationName}

              </span>


              <span className="block truncate text-[11px] uppercase text-gray-500 sm:text-xs">

                Employee Management

              </span>

            </div>

          </div>

        </div>

        <div className="ml-auto flex items-center gap-2">

          <button
            type="button"
            onClick={logout}
            title="Logout"
            aria-label="Logout"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:h-10 sm:w-10"
          >

            <LogOut
              size={19}
              strokeWidth={1.8}
            />

          </button>

        </div>

      </div>

    </header>
  );
}
