import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  WalletCards,
  Calculator,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLogoUrl } from "../../utils/imageUrl";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },
  {
    name: "Advances",
    path: "/advances",
    icon: WalletCards,
  },
  {
    name: "Month Closing",
    path: "/month-closing",
    icon: Calculator,
  },
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { owner } = useAuth();

  const logoUrl = getLogoUrl(owner?.logoUrl);

  const organizationName =
    owner?.organizationName || "Organization";

  const renderNavigation = (mobile = false) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:py-5">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `group flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className={
                    isActive
                      ? "shrink-0 text-white"
                      : "shrink-0 text-slate-500 group-hover:text-slate-700"
                  }
                />

                <span className="truncate">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const renderFooter = () => (
    <div className="border-t border-gray-200 p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-3 rounded-lg p-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={organizationName}
              className="h-full w-full object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs font-semibold text-slate-600">
              {organizationName.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-gray-900">
            {owner?.ownerName || "Owner"}
          </p>

          <p className="truncate text-xs text-gray-500">
            {organizationName}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {renderNavigation(false)}

          {renderFooter()}
        </div>
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[280px] max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header (Close Button Only) */}
        <div className="flex h-16 shrink-0 items-center justify-end border-b border-gray-200 px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {renderNavigation(true)}

        {renderFooter()}
      </aside>
    </>
  );
}