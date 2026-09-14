import {
  Users,
  Wallet,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const cardConfig = {
  employees: {
    icon: Users,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    valueColor: "text-gray-900",
  },

  payable: {
    icon: Wallet,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    valueColor: "text-green-600",
  },

  advance: {
    icon: CreditCard,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    valueColor: "text-gray-900",
  },

  overAdvance: {
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    valueColor: "text-red-600",
  },
};

export default function DashboardCard({
  title,
  value,
  type,
  description,
}) {
  const config =
    cardConfig[type] || cardConfig.employees;

  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p
            className={`mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl ${config.valueColor}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs leading-5 text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
        >
          <Icon
            size={19}
            strokeWidth={2}
            className={config.iconColor}
          />
        </div>
      </div>
    </div>
  );
}