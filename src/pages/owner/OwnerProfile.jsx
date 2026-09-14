import { useEffect, useRef, useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";

import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function OwnerProfile() {
  const {
    owner,
    updateOwner,
  } = useAuth();

  const fileInputRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingLogo, setDeletingLogo] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [logoFile, setLogoFile] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState(null);

  const [form, setForm] = useState({
    ownerName: "",
    organizationName: "",
    email: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    website: "",
  });

  useEffect(() => {
    loadProfile();

    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await authApi.getProfile();

      setForm({
        ownerName:
          data.ownerName || "",

        organizationName:
          data.organizationName || "",

        email:
          data.email || "",

        mobileNumber:
          data.mobileNumber || "",

        addressLine1:
          data.addressLine1 || "",

        addressLine2:
          data.addressLine2 || "",

        city:
          data.city || "",

        state:
          data.state || "",

        country:
          data.country || "",

        postalCode:
          data.postalCode || "",

        website:
          data.website || "",
      });
    } catch (err) {
      console.error(
        "[PROFILE] Failed to load profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load owner profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGO SELECT
  // ==========================================

  const handleLogoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Only JPEG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Logo size must not exceed 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(
        logoPreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setLogoFile(file);
    setLogoPreview(preview);
  };

  const handleDeleteLogo = async () => {
    if (!owner?.ownerId) {
      return;
    }

    try {
      setDeletingLogo(true);
      setError("");
      setSuccess("");

      await authApi.deleteLogo();

      if (logoPreview) {
        URL.revokeObjectURL(
          logoPreview
        );
      }

      setLogoFile(null);
      setLogoPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await updateOwner({
        logoUrl: null,
      });

      setSuccess(
        "Logo removed successfully."
      );
    } catch (err) {
      console.error(
        "[PROFILE] Failed to delete logo:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to remove logo."
      );
    } finally {
      setDeletingLogo(false);
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await authApi.updateProfile(
          form,
          logoFile
        );

      await updateOwner({
        ownerId: response.id,
        ownerName:
          response.ownerName,

        organizationName:
          response.organizationName,

        email:
          response.email,

        mobileNumber:
          response.mobileNumber,
      });

      setLogoFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (logoPreview) {
        URL.revokeObjectURL(
          logoPreview
        );

        setLogoPreview(null);
      }

      setSuccess(
        "Profile updated successfully."
      );

      // Reload actual logo from backend
      if (response.logoExists) {
        window.location.reload();
      }
    } catch (err) {
      console.error(
        "[PROFILE] Failed to update profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-slate-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Owner Profile
        </h1>

        <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
          Manage your organization and
          account information.
        </p>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* PROFILE / LOGO */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your account and organization
              identity.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-slate-50">
              {logoPreview ||
              owner?.logoUrl ? (
                <img
                  src={
                    logoPreview ||
                    owner.logoUrl
                  }
                  alt="Organization logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2
                  size={40}
                  strokeWidth={1.5}
                  className="text-slate-400"
                />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Organization Logo
              </p>

              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG or WebP. Maximum
                size 5 MB.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Upload size={16} />
                  Choose Logo
                </button>

                {(owner?.logoUrl ||
                  logoPreview) && (
                  <button
                    type="button"
                    disabled={
                      deletingLogo
                    }
                    onClick={
                      handleDeleteLogo
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingLogo ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    Remove
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleLogoChange
                }
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* BASIC INFORMATION */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal and
              organization details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <InputField
              label="Owner Name"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              icon={User}
              required
            />

            <InputField
              label="Organization Name"
              name="organizationName"
              value={
                form.organizationName
              }
              onChange={handleChange}
              icon={Building2}
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <InputField
              label="Mobile Number"
              name="mobileNumber"
              value={
                form.mobileNumber
              }
              onChange={handleChange}
              icon={Phone}
              required
            />

            <InputField
              label="Website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              icon={Globe}
              placeholder="https://example.com"
            />
          </div>
        </section>

        {/* ADDRESS */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Address
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add your organization's
              business address.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <InputField
              label="Address Line 1"
              name="addressLine1"
              value={
                form.addressLine1
              }
              onChange={handleChange}
              icon={MapPin}
            />

            <InputField
              label="Address Line 2"
              name="addressLine2"
              value={
                form.addressLine2
              }
              onChange={handleChange}
              icon={MapPin}
            />

            <InputField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <InputField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />

            <InputField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={
                form.postalCode
              }
              onChange={handleChange}
            />
          </div>
        </section>

        {/* SAVE */}

        <div className="flex justify-end pb-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 ${
            Icon
              ? "pl-10 pr-3"
              : "px-3"
          }`}
        />
      </div>
    </div>
  );
}