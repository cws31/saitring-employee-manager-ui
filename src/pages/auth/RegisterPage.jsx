import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Lock,
  Mail,
  Upload,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import authApi from "../../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: "",
    organizationName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setLogo(null);
      setLogoPreview("");
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Logo must be a PNG or JPEG image.");
      e.target.value = "";
      setLogo(null);
      setLogoPreview("");
      return;
    }

    setError("");
    setLogo(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };


  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);


  const validateForm = () => {
    const ownerName = form.ownerName.trim();
    const organizationName = form.organizationName.trim();
    const email = form.email.trim();
    const mobileNumber = form.mobileNumber.trim();
    const password = form.password;


    if (!ownerName) {
      return "Owner name is required.";
    }

    if (ownerName.length < 2 || ownerName.length > 100) {
      return "Owner name must be between 2 and 100 characters.";
    }


    if (!organizationName) {
      return "Organization name is required.";
    }

    if (
      organizationName.length < 2 ||
      organizationName.length > 150
    ) {
      return "Organization name must be between 2 and 150 characters.";
    }

    if (!email) {
      return "Email is required.";
    }

    if (email.length > 150) {
      return "Email must not exceed 150 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please provide a valid email address.";
    }

    if (!mobileNumber) {
      return "Mobile number is required.";
    }

    const mobileRegex = /^\+[1-9]\d{7,14}$/;

    if (!mobileRegex.test(mobileNumber)) {
      return "Mobile number must be in international format, for example +919876543210.";
    }

    if (!password) {
      return "Password is required.";
    }

    if (password.length < 8 || password.length > 100) {
      return "Password must be between 8 and 100 characters.";
    }

    if (!logo) {
      return "Organization logo is required.";
    }

    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      
      const requestData = {
        ownerName: form.ownerName.trim(),
        organizationName: form.organizationName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        password: form.password,
      };

     
      const formData = new FormData();

      const requestBlob = new Blob(
        [JSON.stringify(requestData)],
        {
          type: "application/json",
        }
      );

      
      formData.append("request", requestBlob);
      formData.append("logo", logo);

      await authApi.register(formData);

     
      navigate("/login");
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);

      const responseData = err.response?.data;

      let errorMessage =
        "Registration failed. Please try again.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50">


      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          w-full
          border-b
          border-slate-200
          bg-white/95
          shadow-sm
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[72px]
            w-full
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:h-20
            sm:px-8
            lg:px-10
          "
        >

          {/* Brand */}

          <Link
            to="/"
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              sm:gap-4
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                sm:h-12
                sm:w-12
              "
            >
              <img
                src="/app-logo.png"
                alt="Saitring Employee Manager"
                className="
                  h-10
                  w-10
                  object-contain
                  sm:h-12
                  sm:w-12
                "
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-[15px]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-slate-900
                  sm:text-[20px]
                "
              >
                Saitring Employee Manager
              </h1>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  text-slate-600
                  sm:mt-1
                  sm:text-sm
                "
              >
                Aapke kaam, aapke log, ek jagah
              </p>
            </div>
          </Link>

          {/* Desktop Sign In */}

          <Link
            to="/login"
            className="
              hidden
              items-center
              gap-2
              rounded-lg
              border
              border-slate-300
              bg-white
              px-5
              py-2.5
              text-sm
              font-bold
              text-slate-900
              transition
              hover:bg-slate-50
              sm:inline-flex
            "
          >
            Sign In
          </Link>
        </div>
      </header>

      <main
        className="
          px-4
          pb-7
          pt-[100px]
          sm:px-6
          sm:pb-10
          sm:pt-[120px]
          lg:px-8
          lg:pb-14
          lg:pt-[140px]
        "
      >
        <div className="mx-auto w-full max-w-2xl">

          <div className="mb-6 text-center sm:mb-8">

            {/* Badge */}

            <div
              className="
                mx-auto
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-200
                bg-white
                px-3.5
                py-2
                text-[11px]
                font-semibold
                text-slate-600
                shadow-sm
                sm:text-xs
              "
            >
              <CheckCircle2
                size={14}
                className="text-slate-700"
              />

              Simple workforce management
            </div>

            <h2
              className="
                text-2xl
                font-extrabold
                leading-tight
                tracking-tight
                text-slate-900
                sm:text-3xl
                lg:text-4xl
              "
            >
              Create your owner account
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-500
                sm:mt-3
                sm:text-[15px]
              "
            >
              Apna organization workspace setup karein aur
              employees ko ek hi jagah se manage karein.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="
                mb-5
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
                shadow-sm
              "
            >
              <span
                className="
                  mt-0.5
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-100
                  text-xs
                  font-bold
                  text-red-700
                "
              >
                !
              </span>

              <p className="leading-5">
                {error}
              </p>
            </div>
          )}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              sm:rounded-3xl
            "
          >

            {/* Card Header */}

            <div
              className="
                border-b
                border-slate-100
                bg-slate-50/70
                px-5
                py-4
                sm:px-7
                sm:py-5
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-900
                    text-white
                  "
                >
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Organization details
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter your account information below.
                  </p>
                </div>

              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-7"
            >

              <div>
                <label
                  htmlFor="ownerName"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Owner name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    strokeWidth={1.8}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={form.ownerName}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-400
                      focus:border-slate-700
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />

                </div>
              </div>

              <div>
                <label
                  htmlFor="organizationName"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Organization name
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    strokeWidth={1.8}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={form.organizationName}
                    onChange={handleChange}
                    autoComplete="organization"
                    placeholder="Enter organization name"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-400
                      focus:border-slate-700
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />

                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    strokeWidth={1.8}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-400
                      focus:border-slate-700
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />

                </div>
              </div>

              <div>
                <label
                  htmlFor="mobileNumber"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Mobile number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    strokeWidth={1.8}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="+919876543210"
                    maxLength={16}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-400
                      focus:border-slate-700
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />

                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Use international format, for example +919876543210.
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    strokeWidth={1.8}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-12
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-400
                      focus:border-slate-700
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-700
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Password must be between 8 and 100 characters.
                </p>
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Organization logo
                </label>

                <label
                  htmlFor="logo"
                  className="
                    block
                    cursor-pointer
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    p-4
                    transition
                    hover:border-slate-400
                    hover:bg-slate-100
                  "
                >

                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  {logo ? (
                    <div className="flex items-center gap-4">

                      {/* Preview */}

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                        "
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Organization logo preview"
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        ) : (
                          <ImageIcon
                            size={22}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      {/* File Info */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          {logo.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Logo selected successfully
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Click to change
                        </p>
                      </div>

                      <CheckCircle2
                        size={20}
                        className="
                          shrink-0
                          text-emerald-500
                        "
                      />

                    </div>
                  ) : (
                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-5
                        text-center
                      "
                    >
                      <div
                        className="
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-xl
                          bg-white
                          text-slate-500
                          shadow-sm
                        "
                      >
                        <Upload size={20} />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        Upload organization logo
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG or JPEG image
                      </p>
                    </div>
                  )}

                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-slate-800
                  focus:outline-none
                  focus:ring-4
                  focus:ring-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Owner Account

                    <ArrowRight
                      size={17}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>

            </form>
          </div>

          <div className="mt-5 text-center sm:mt-6">
            <p className="text-sm text-slate-500">
              Already have an owner account?{" "}

              <Link
                to="/login"
                className="
                  font-bold
                  text-slate-900
                  transition
                  hover:text-slate-600
                "
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </main>

      <footer className="px-4 pb-6 pt-2 text-center">
        <p className="text-[11px] text-slate-400 sm:text-xs">
          © {new Date().getFullYear()} Saitring Employee Manager.
          All rights reserved.
        </p>
      </footer>

    </div>
  );
}