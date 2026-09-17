import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
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
    identifier: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const otpInputRef = useRef(null);


  useEffect(() => {
    console.log("[LOGIN PAGE] Current step:", step);
  }, [step]);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("[LOGIN PAGE] Login form submitted");

    console.log(
      "[LOGIN PAGE] Identifier:",
      form.identifier
    );

    setError("");
    setSuccess("");

    if (!form.identifier.trim() || !form.password) {
      console.warn(
        "[LOGIN PAGE] Identifier/password missing"
      );

      setError(
        "Email or mobile number and password are required."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "[LOGIN PAGE] Calling AuthContext.login()..."
      );

      const response = await login(
        form.identifier.trim(),
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
            "A verification code has been sent to your registered contact."
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
          "Invalid email/mobile number or password."
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
    const value = e.target.value.replace(/\D/g, "");

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
      "[LOGIN PAGE] Identifier:",
      form.identifier
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
        form.identifier.trim(),
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

          {/* Register */}
          <Link
            to="/register"
            className="
              hidden
              items-center
              gap-2
              rounded-lg
              bg-slate-900
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-slate-800
              sm:inline-flex
            "
          >
            Create Account

            <ArrowRight size={16} />
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

              {step === "login"
                ? "Welcome back"
                : "Secure verification"}
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
              {step === "login"
                ? "Welcome back"
                : "Verify your identity"}
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
              {step === "login"
                ? "Sign in to access your organization dashboard."
                : "Enter the verification code sent to your registered contact."}
            </p>

          </div>

          {step === "login" && (
            <>

              {/* Error */}
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

              {/* Login Card */}
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
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Owner sign in
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Enter your account credentials.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Login Form */}
                <form
                  onSubmit={handleLogin}
                  className="space-y-5 p-5 sm:p-7"
                >

                  {/* Identifier */}
                  <div>

                    <label
                      htmlFor="identifier"
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Email or mobile number
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
                        id="identifier"
                        name="identifier"
                        type="text"
                        value={form.identifier}
                        onChange={handleChange}
                        autoComplete="username"
                        autoFocus
                        placeholder="Enter email or mobile number"
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

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                      Use your registered email or mobile number.
                    </p>

                  </div>

                  {/* Password */}
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
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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
                          setShowPassword(
                            (prev) => !prev
                          )
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

                  </div>

                  {/* Submit */}
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
                      "Sending verification code..."
                    ) : (
                      <>
                        Continue

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

                {/* Register */}
                <div
                  className="
                    border-t
                    border-slate-100
                    px-5
                    py-5
                    sm:px-7
                  "
                >

                  <p className="text-center text-xs text-slate-400">
                    Don't have an owner account?
                  </p>

                  <Link
                    to="/register"
                    className="
                      mt-2
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      hover:text-slate-900
                    "
                  >
                    Create an owner account
                  </Link>

                </div>

              </div>

            </>
          )}


          {step === "otp" && (
            <>

              {/* Success */}
              {success && (
                <div
                  role="status"
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                    text-sm
                    text-emerald-700
                  "
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

              {/* Error */}
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

              {/* OTP Card */}
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
                      <KeyRound size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Verification required
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Complete the final step to sign in.
                      </p>
                    </div>

                  </div>
                </div>

                {/* OTP Form */}
                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-6 p-5 sm:p-7"
                >

                  {/* Icon */}
                  <div className="flex justify-center">

                    <div
                      className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-100
                        text-slate-700
                      "
                    >
                      <KeyRound size={28} />
                    </div>

                  </div>

                  {/* Identifier */}
                  <div
                    className="
                      rounded-xl
                      bg-slate-50
                      px-4
                      py-3
                      text-center
                    "
                  >

                    <p className="text-xs text-slate-400">
                      Verification requested for
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                      {form.identifier}
                    </p>

                  </div>

                  {/* OTP */}
                  <div>

                    <label
                      htmlFor="otp"
                      className="
                        mb-2
                        block
                        text-center
                        text-sm
                        font-semibold
                        text-slate-700
                      "
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
                      className="
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        text-center
                        text-2xl
                        font-bold
                        tracking-[0.5em]
                        text-slate-900
                        outline-none
                        transition
                        placeholder:font-normal
                        placeholder:tracking-[0.5em]
                        placeholder:text-slate-300
                        focus:border-slate-700
                        focus:ring-4
                        focus:ring-slate-100
                      "
                    />

                    <p className="mt-2 text-center text-xs text-slate-400">
                      Enter exactly 6 digits
                    </p>

                  </div>

                  {/* Verify */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
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
                      "Verifying..."
                    ) : (
                      <>
                        Verify and sign in

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

                {/* Back */}
                <div
                  className="
                    border-t
                    border-slate-100
                    px-5
                    py-5
                    sm:px-7
                  "
                >

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={loading}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      text-sm
                      font-semibold
                      text-slate-500
                      transition
                      hover:text-slate-900
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <ArrowLeft size={16} />

                    Use a different account
                  </button>

                </div>

              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                Your verification code expires after the configured
                validity period.
              </p>

            </>
          )}

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