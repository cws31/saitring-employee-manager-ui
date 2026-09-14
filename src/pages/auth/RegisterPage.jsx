import React, { useState } from "react";
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

  const validateForm = () => {
    const ownerName = form.ownerName.trim();
    const organizationName = form.organizationName.trim();
    const email = form.email.trim();
    const mobileNumber = form.mobileNumber.trim();
    const password = form.password;

    /*
     * Owner Name
     */
    if (!ownerName) {
      return "Owner name is required.";
    }

    if (ownerName.length < 2 || ownerName.length > 100) {
      return "Owner name must be between 2 and 100 characters.";
    }

    /*
     * Organization Name
     */
    if (!organizationName) {
      return "Organization name is required.";
    }

    if (
      organizationName.length < 2 ||
      organizationName.length > 150
    ) {
      return "Organization name must be between 2 and 150 characters.";
    }

    /*
     * Email
     */
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

    /*
     * Mobile Number
     *
     * Backend requirement:
     *
     * ^\+[1-9]\d{7,14}$
     *
     * Example:
     * +919876543210
     */
    if (!mobileNumber) {
      return "Mobile number is required.";
    }

    const mobileRegex = /^\+[1-9]\d{7,14}$/;

    if (!mobileRegex.test(mobileNumber)) {
      return "Mobile number must be in international format, for example +919876543210.";
    }

    /*
     * Password
     */
    if (!password) {
      return "Password is required.";
    }

    if (password.length < 8 || password.length > 100) {
      return "Password must be between 8 and 100 characters.";
    }

    /*
     * Logo
     */
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
      /*
       * This object MUST match:
       *
       * OwnerRegistrationRequest
       */
      const requestData = {
        ownerName: form.ownerName.trim(),
        organizationName: form.organizationName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        password: form.password,
      };

      /*
       * Multipart request
       */
      const formData = new FormData();

      /*
       * Convert JSON request into application/json part
       */
      const requestBlob = new Blob(
        [JSON.stringify(requestData)],
        {
          type: "application/json",
        }
      );

      /*
       * Backend:
       *
       * @RequestPart("request")
       * @RequestPart("logo")
       */
      formData.append("request", requestBlob);
      formData.append("logo", logo);

      await authApi.register(formData);

      /*
       * Registration successful
       */
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
    <div className="min-h-dvh bg-slate-100 px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">

      {/* Main Workspace */}
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:min-h-[calc(100dvh-2.5rem)] lg:min-h-[calc(100dvh-4rem)]">

        {/* Desktop Brand Section */}
        <div className="relative hidden w-[42%] shrink-0 overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">

          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-slate-800/70" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-slate-700/60" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900 shadow-sm">
                SE
              </div>

              <div>

                <p className="text-lg font-semibold tracking-tight text-white">
                  Saitring Employee Manager
                </p>

                <p className="text-xs text-slate-400">
                  Employee management platform
                </p>

              </div>

            </div>

          </div>

          <div className="relative z-10 max-w-md">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300">
              <CheckCircle2 size={14} />
              Simple workforce management
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Manage your employees
              <span className="block text-slate-400">
                from one place.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Create your organization workspace, manage employees,
              track attendance, handle advances and complete monthly
              closing from a centralized management system.
            </p>

          </div>

          <div className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Saitring Employee Manager.
            All rights reserved.
          </div>

        </div>

        {/* Registration Section */}
        <div className="flex flex-1 items-center justify-center bg-slate-50/80 px-4 py-7 sm:px-8 sm:py-10 lg:px-10 xl:px-14">

          <div className="w-full max-w-xl">

            {/* Mobile Branding */}
            <div className="mb-7 lg:hidden">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                  SE
                </div>

                <div className="min-w-0">

                  <p className="truncate text-base font-bold text-slate-900">
                    Saitring Employee Manager
                  </p>

                  <p className="text-xs text-slate-500">
                    Employee management platform
                  </p>

                </div>

              </div>

            </div>

            {/* Heading */}
            <div className="mb-6">

              <p className="mb-1.5 text-sm font-medium text-slate-500">
                Get started
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create your owner account
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-500">
                Set up your organization workspace and start managing
                your employees.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span className="mt-0.5 shrink-0 font-bold">
                  !
                </span>

                <p className="leading-5">
                  {error}
                </p>

              </div>
            )}

            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Owner Name */}
                <div>

                  <label
                    htmlFor="ownerName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Owner name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      value={form.ownerName}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                </div>

                {/* Organization */}
                <div>

                  <label
                    htmlFor="organizationName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Organization name
                  </label>

                  <div className="relative">

                    <Building2
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      value={form.organizationName}
                      onChange={handleChange}
                      autoComplete="organization"
                      placeholder="Enter organization name"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                </div>

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                </div>

                {/* Mobile Number */}
                <div>

                  <label
                    htmlFor="mobileNumber"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Mobile number
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Use international format, for example +919876543210.
                  </p>

                </div>

                {/* Password */}
                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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

                {/* Logo */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Organization logo
                  </label>

                  <label
                    htmlFor="logo"
                    className="block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-slate-100"
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

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">

                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Organization logo preview"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ImageIcon
                              size={22}
                              className="text-slate-400"
                            />
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-medium text-slate-800">
                            {logo.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Logo selected successfully
                          </p>

                        </div>

                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-emerald-500"
                        />

                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center">

                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                          <Upload size={19} />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                          Upload organization logo
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          PNG or JPEG image
                        </p>

                      </div>
                    )}

                  </label>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>

              </form>

            </div>

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an owner account?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-900 hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
