import React from "react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div
      className="
        group
        flex
        gap-4
        border-b
        border-slate-100
        px-5
        py-5
        transition
        active:bg-slate-50
        sm:px-6
        sm:py-6
        lg:border-b-0
        lg:border-r
        lg:px-6
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-800
          transition
          group-hover:bg-slate-900
          group-hover:text-white
        "
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold leading-5 text-slate-900">
          {title}
        </h3>

        <p className="mt-1.5 text-[12px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;