import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  mobile: "",
  initialRate: "",
};

export default function EmployeeModal({
  open,
  employee,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(employee);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        mobile: employee.mobile || "",
        initialRate:
          employee.initialRate ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [employee, open]);

  if (!open) {
    return null;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!form.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    const mobileRegex = /^\+?[0-9]{10,15}$/;

    if (!mobileRegex.test(form.mobile.trim())) {
      setError(
        "Enter a valid mobile number."
      );
      return;
    }

    if (
      form.initialRate === "" ||
      Number(form.initialRate) < 0
    ) {
      setError(
        "Initial rate must be a valid amount."
      );
      return;
    }

    onSubmit({
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      initialRate: Number(form.initialRate),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {isEditing
                ? "Update employee information"
                : "Add a new employee to your organization"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Employee Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>

            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Initial Rate
            </label>

            <input
              type="number"
              name="initialRate"
              value={form.initialRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter rate"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Employee"
                : "Add Employee"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}