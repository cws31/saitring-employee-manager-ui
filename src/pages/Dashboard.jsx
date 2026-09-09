import { useEffect, useState } from "react";
import dashboardService from "../api/dashboardService";

const Dashboard = () => {

    const today = new Date();

    const [year, setYear] = useState(
        today.getFullYear()
    );

    const [month, setMonth] = useState(
        today.getMonth() + 1
    );

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {
        loadDashboard();
    }, [year, month]);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await dashboardService.getDashboard(
                    year,
                    month
                );

            setDashboard(data);

        } catch (err) {

            console.error(
                "Dashboard loading failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    };

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        ).format(Number(value) || 0);
    };

    const monthName =
        new Date(
            year,
            month - 1
        ).toLocaleString(
            "en-IN",
            {
                month: "long",
            }
        );

    const years = Array.from(
        {
            length: 5,
        },
        (_, index) =>
            today.getFullYear() - index
    );

    if (loading) {

        return (

            <div className="min-h-[calc(100vh-64px)] bg-gray-50">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* Header */}

                    <div className="bg-white border border-gray-200 rounded-md">

                        <div className="px-6 py-5 border-b border-gray-200">

                            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />

                            <div className="h-3 w-56 bg-gray-100 rounded mt-3 animate-pulse" />

                        </div>


                        {/* Summary */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

                            {[1, 2, 3, 4].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="px-6 py-6"
                                    >

                                        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />

                                        <div className="h-6 w-32 bg-gray-100 rounded mt-4 animate-pulse" />

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* Table */}

                    <div className="mt-6 bg-white border border-gray-200 rounded-md">

                        <div className="px-6 py-5 border-b border-gray-200">

                            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />

                        </div>


                        <div className="p-6 space-y-4">

                            {[1, 2, 3, 4, 5].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="h-10 bg-gray-50 rounded animate-pulse"
                                    />

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }



    if (error) {

        return (

            <div className="min-h-[calc(100vh-64px)] bg-gray-50">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="bg-white border border-gray-200 rounded-md">

                        <div className="px-6 py-5 border-b border-gray-200">

                            <h1 className="text-lg font-medium text-gray-900">
                                Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Unable to retrieve dashboard data.
                            </p>

                        </div>


                        <div className="px-6 py-8">

                            <p className="text-sm text-gray-600">
                                {error}
                            </p>


                            <button
                                onClick={loadDashboard}
                                className="mt-5 px-4 py-2 text-sm text-white bg-gray-900 rounded hover:bg-gray-800 transition"
                            >
                                Try again
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    if (!dashboard) {
        return null;
    }


    const employees =
        dashboard.employees || [];



    return (

        <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

                <div className="bg-white border border-gray-200 rounded-md">

                    <div className="px-5 sm:px-6 py-5">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">


                            {/* Title */}

                            <div>

                                <h1 className="text-lg font-medium text-gray-900">
                                    Dashboard
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Employee payment overview
                                </p>

                            </div>


                            {/* Period */}

                            <div className="flex items-center gap-2">

                                <select
                                    value={month}
                                    onChange={(e) =>
                                        setMonth(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="h-9 px-3 border border-gray-300 rounded text-sm text-gray-700 bg-white outline-none focus:border-gray-500"
                                >

                                    {Array.from(
                                        {
                                            length: 12,
                                        },
                                        (_, index) => {

                                            const value =
                                                index + 1;

                                            const name =
                                                new Date(
                                                    2000,
                                                    index
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        month: "long",
                                                    }
                                                );

                                            return (

                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {name}
                                                </option>

                                            );
                                        }
                                    )}

                                </select>


                                <select
                                    value={year}
                                    onChange={(e) =>
                                        setYear(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="h-9 px-3 border border-gray-300 rounded text-sm text-gray-700 bg-white outline-none focus:border-gray-500"
                                >

                                    {years.map(
                                        (item) => (

                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-5 bg-white border border-gray-200 rounded-md">


                    <div className="px-5 sm:px-6 py-4 border-b border-gray-200">

                        <h2 className="text-sm font-medium text-gray-900">
                            Financial summary
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {monthName} {year}
                        </p>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

                        <div className="px-5 sm:px-6 py-5">

                            <p className="text-xs text-gray-500">
                                Total employees
                            </p>

                            <p className="mt-2 text-xl font-medium text-gray-900">
                                {dashboard.totalEmployees}
                            </p>

                        </div>
                        <div className="px-5 sm:px-6 py-5">

                            <p className="text-xs text-gray-500">
                                Total payable
                            </p>

                            <p className="mt-2 text-xl font-medium text-green-600">
                                {formatCurrency(
                                    dashboard.totalPayable
                                )}
                            </p>

                        </div>

                        <div className="px-5 sm:px-6 py-5">

                            <p className="text-xs text-gray-500">
                                Total advance
                            </p>

                            <p className="mt-2 text-xl font-medium text-gray-900">
                                {formatCurrency(
                                    dashboard.totalAdvance
                                )}
                            </p>

                        </div>

                        <div className="px-5 sm:px-6 py-5">

                            <p className="text-xs text-gray-500">
                                Total over-advance
                            </p>

                            <p className="mt-2 text-xl font-medium text-red-600">
                                {formatCurrency(
                                    dashboard.totalOverAdvance
                                )}
                            </p>

                        </div>

                    </div>

                </div>

                <div className="mt-5 bg-white border border-gray-200 rounded-md">


                    {/* Table Header */}

                    <div className="px-5 sm:px-6 py-4 border-b border-gray-200">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                            <div>

                                <h2 className="text-sm font-medium text-gray-900">
                                    Employee payments
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Payable and outstanding amounts
                                </p>

                            </div>


                            <p className="text-xs text-gray-500">
                                {employees.length} employees
                            </p>

                        </div>

                    </div>


                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50 border-b border-gray-200">

                                    <th className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Employee
                                    </th>

                                    <th className="px-5 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Payable
                                    </th>

                                    <th className="px-5 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Due
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {employees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="px-6 py-12 text-center"
                                        >

                                            <p className="text-sm text-gray-500">
                                                No employee records available.
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    employees.map(
                                        (employee) => {

                                            const due =
                                                Number(
                                                    employee.dueAmount || 0
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        employee.employeeId
                                                    }
                                                    className="hover:bg-gray-50 transition-colors"
                                                >


                                                    {/* Employee */}

                                                    <td className="px-5 sm:px-6 py-4">

                                                        <p className="text-sm text-gray-900">
                                                            {
                                                                employee.employeeName
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* Payable */}

                                                    <td className="px-5 sm:px-6 py-4 text-right">

                                                        <span className="text-sm text-gray-700">

                                                            {
                                                                formatCurrency(
                                                                    employee.payableAmount
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* Due */}

                                                    <td className="px-5 sm:px-6 py-4 text-right">

                                                        {due > 0 ? (

                                                            <span className="text-sm font-medium text-green-600">

                                                                +
                                                                {
                                                                    formatCurrency(
                                                                        due
                                                                    )
                                                                }

                                                            </span>

                                                        ) : due < 0 ? (

                                                            <span className="text-sm font-medium text-red-600">

                                                                {
                                                                    formatCurrency(
                                                                        due
                                                                    )
                                                                }

                                                            </span>

                                                        ) : (

                                                            <span className="text-sm text-gray-500">

                                                                {
                                                                    formatCurrency(
                                                                        0
                                                                    )
                                                                }

                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="mt-4 px-1">

                    <p className="text-xs text-gray-400">

                        Financial information for{" "}

                        {monthName} {year}

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;