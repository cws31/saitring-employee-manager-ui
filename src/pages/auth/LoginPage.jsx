import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  MailCheck,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, verifyOtp } = useAuth();

  const [step, setStep] = useState("login");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const otpInputRef = useRef(null);



  useEffect(() => {
    console.log(
      "[LOGIN PAGE] Current step:",
      step
    );
  }, [step]);



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(
      "[LOGIN PAGE] Login form submitted"
    );

    console.log(
      "[LOGIN PAGE] Username:",
      form.username
    );

    setError("");
    setSuccess("");

    if (!form.username.trim() || !form.password) {
      console.warn(
        "[LOGIN PAGE] Username/password missing"
      );

      setError(
        "Username and password are required."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "[LOGIN PAGE] Calling AuthContext.login()..."
      );

      const response = await login(
        form.username.trim(),
        form.password
      );

      console.log(
        "[LOGIN PAGE] Login response:",
        response
      );

      if (response?.otpRequired) {
        console.log(
          "[LOGIN PAGE] OTP required. Switching to OTP screen."
        );

        setStep("otp");

        setSuccess(
          response.message ||
            "A verification code has been sent to your registered email."
        );

        setOtp("");

        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);

        return;
      }

      console.warn(
        "[LOGIN PAGE] Backend did not request OTP."
      );

      setError(
        "OTP verification is required before continuing."
      );
    } catch (err) {
      console.error(
        "[LOGIN PAGE] LOGIN ERROR:",
        err
      );

      console.error(
        "[LOGIN PAGE] Response:",
        err?.response
      );

      console.error(
        "[LOGIN PAGE] Response data:",
        err?.response?.data
      );

      if (err.response?.status === 401) {
        setError(
          "Invalid username or password."
        );
      } else if (err.response?.data?.message) {
        setError(
          err.response.data.message
        );
      } else if (
        typeof err.response?.data === "string"
      ) {
        setError(
          err.response.data
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Unable to login. Please check the server and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const handleOtpChange = (e) => {
    const value = e.target.value.replace(
      /\D/g,
      ""
    );

    console.log(
      "[LOGIN PAGE] OTP input:",
      value
    );

    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    console.log(
      "=================================================="
    );

    console.log(
      "[LOGIN PAGE] VERIFY FORM SUBMITTED"
    );

    console.log(
      "[LOGIN PAGE] Username:",
      form.username
    );

    console.log(
      "[LOGIN PAGE] OTP length:",
      otp.length
    );

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      console.warn(
        "[LOGIN PAGE] Invalid OTP format"
      );

      setError(
        "Please enter the 6-digit verification code."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "[LOGIN PAGE] Calling AuthContext.verifyOtp()..."
      );

      const response = await verifyOtp(
        form.username.trim(),
        otp
      );

      console.log(
        "[LOGIN PAGE] verifyOtp() completed successfully."
      );

      console.log(
        "[LOGIN PAGE] Verify response:",
        response
      );

      console.log(
        "[LOGIN PAGE] JWT exists:",
        Boolean(response?.token)
      );

      if (!response?.token) {
        console.error(
          "[LOGIN PAGE] No JWT returned from backend."
        );

        throw new Error(
          "Authentication token was not returned."
        );
      }

      const destination =
        location.state?.from ||
        "/dashboard";

      console.log(
        "[LOGIN PAGE] Destination:",
        destination
      );

      console.log(
        "[LOGIN PAGE] Navigating to dashboard..."
      );

      navigate(destination, {
        replace: true,
      });

      console.log(
        "[LOGIN PAGE] navigate() called."
      );
    } catch (err) {
      console.error(
        "=================================================="
      );

      console.error(
        "[LOGIN PAGE] OTP VERIFICATION ERROR:",
        err
      );

      console.error(
        "[LOGIN PAGE] Error message:",
        err?.message
      );

      console.error(
        "[LOGIN PAGE] Error response:",
        err?.response
      );

      console.error(
        "[LOGIN PAGE] Error response data:",
        err?.response?.data
      );

      console.error(
        "=================================================="
      );

      if (err.response?.status === 401) {
        setError(
          err.response?.data?.message ||
            "Invalid or expired verification code."
        );
      } else if (
        err.response?.data?.message
      ) {
        setError(
          err.response.data.message
        );
      } else if (
        typeof err.response?.data === "string"
      ) {
        setError(
          err.response.data
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Unable to verify the code. Please try again."
        );
      }
    } finally {
      console.log(
        "[LOGIN PAGE] Verification loading finished."
      );

      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log(
      "[LOGIN PAGE] Returning to login screen."
    );

    setStep("login");
    setOtp("");
    setError("");
    setSuccess("");
  };
  useEffect(() => {
    if (step === "otp") {
      console.log(
        "[LOGIN PAGE] OTP screen mounted."
      );

      const timer = setTimeout(() => {
        otpInputRef.current?.focus();

        console.log(
          "[LOGIN PAGE] OTP input focused."
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [step]);


  return (
    <div className="min-h-dvh bg-slate-100 px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">

      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:min-h-[calc(100dvh-2.5rem)] lg:min-h-[calc(100dvh-4rem)]">


        <div className="relative hidden w-[42%] shrink-0 overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">

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

              {step === "login"
                ? "Welcome back"
                : "Secure verification"}

            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">

              {step === "login" ? (
                <>
                  Your workforce.

                  <span className="block text-slate-400">
                    One organized workspace.
                  </span>
                </>
              ) : (
                <>
                  One more step.

                  <span className="block text-slate-400">
                    Verify your identity.
                  </span>
                </>
              )}

            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">

              {step === "login"
                ? "Manage employees, attendance, advances and monthly closing from one centralized workspace."
                : "We have sent a one-time verification code to your registered email address to securely complete your sign in."}

            </p>

          </div>

          <div className="relative z-10 text-xs text-slate-500">

            © {new Date().getFullYear()} Saitring Employee Manager.
            All rights reserved.

          </div>

        </div>

        <div className="flex flex-1 items-start justify-center bg-slate-50/80 px-4 py-4 sm:items-center sm:px-8 sm:py-10 lg:px-10 xl:px-16">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}

            <div className="mb-5 lg:hidden">

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

            {step === "login" && (
              <>

                <div className="mb-6">

                  <p className="mb-1.5 text-sm font-medium text-slate-500">
                    Owner portal
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Welcome back
                  </h1>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Sign in to access your organization dashboard.
                  </p>

                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >

                    {/* USERNAME */}

                    <div>

                      <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Username
                      </label>

                      <div className="relative">

                        <User
                          size={18}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={form.username}
                          onChange={handleChange}
                          autoComplete="username"
                          autoFocus
                          placeholder="Enter your username"
                          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />

                      </div>

                    </div>

                    {/* PASSWORD */}

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
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev
                            )
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

                    </div>

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Sending verification code..."
                        : "Continue"}
                    </button>

                  </form>

                  {/* DIVIDER */}

                  <div className="my-6 flex items-center gap-3">

                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-xs text-slate-400">
                      New organization?
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />

                  </div>

                  {/* REGISTER */}

                  <Link
                    to="/register"
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Create an owner account
                  </Link>

                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  © {new Date().getFullYear()} Saitring Employee Manager
                </p>

              </>
            )}


            {step === "otp" && (
              <>

                <div className="mb-6">

                  <p className="mb-1.5 text-sm font-medium text-slate-500">
                    Secure verification
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Verify your email
                  </h1>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Enter the 6-digit verification code sent to
                    your registered email address.
                  </p>

                </div>

                {/* SUCCESS */}

                {success && (
                  <div
                    role="status"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  >

                    <MailCheck
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="leading-5">
                      {success}
                    </p>

                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-6"
                  >

                    {/* ICON */}

                    <div className="flex justify-center">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <KeyRound size={28} />
                      </div>

                    </div>

                    {/* USERNAME */}

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">

                      <p className="text-xs text-slate-400">
                        Verification requested for
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                        {form.username}
                      </p>

                    </div>

                    {/* OTP */}

                    <div>

                      <label
                        htmlFor="otp"
                        className="mb-2 block text-center text-sm font-medium text-slate-700"
                      >
                        Verification code
                      </label>

                      <input
                        ref={otpInputRef}
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className="h-14 w-full rounded-xl border border-slate-300 bg-white text-center text-2xl font-bold tracking-[0.5em] text-slate-900 outline-none transition placeholder:font-normal placeholder:tracking-[0.5em] placeholder:text-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      />

                      <p className="mt-2 text-center text-xs text-slate-400">
                        Enter exactly 6 digits
                      </p>

                    </div>

                    {/* VERIFY */}

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        otp.length !== 6
                      }
                      className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Verifying..."
                        : "Verify and sign in"}
                    </button>

                  </form>

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                    Use a different account
                  </button>

                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Your verification code expires after the configured
                  validity period.
                </p>

              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}