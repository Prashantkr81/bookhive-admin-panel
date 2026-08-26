import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  ClipboardList,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getDashboardData,
  type DashboardData,
} from "../../services/dashboardService";

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function isOverdue(
  status: string,
  returnDate: string | null
) {
  if (
    status !== "active" &&
    status !== "rented"
  ) {
    return false;
  }

  if (!returnDate) {
    return false;
  }

  const date =
    new Date(returnDate);

  return (
    !Number.isNaN(date.getTime()) &&
    date < new Date()
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getDashboardData();

      setData(result);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="font-medium text-red-700">
            {error ||
              "Unable to load dashboard."}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back. Here's what's happening on BookHive.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Users"
          value={data.totalUsers}
          description="Registered users"
          icon={<Users size={20} />}
        />

        <StatCard
          title="Total Books"
          value={data.totalBooks}
          description={`${data.availableBooks} currently available`}
          icon={<BookOpen size={20} />}
        />

        <StatCard
          title="Total Rentals"
          value={data.totalRentals}
          description={`${data.activeRentals} currently active`}
          icon={
            <ClipboardList size={20} />
          }
        />

        <StatCard
          title="Overdue Rentals"
          value={data.overdueRentals}
          description="Require attention"
          icon={
            <AlertTriangle size={20} />
          }
        />

      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent Users */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Users
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest registered users
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="divide-y divide-slate-100">

            {data.recentUsers.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No users found.
              </div>
            ) : (
              data.recentUsers.map(
                (user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-xs text-slate-400">
                        Joined
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-600">
                        {formatDate(
                          user.createdAt
                        )}
                      </p>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

        {/* Quick Stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Quick Overview
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Available Books
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Ready for rental
                </p>
              </div>

              <p className="text-xl font-bold text-slate-900">
                {data.availableBooks}
              </p>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Active Rentals
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Currently rented
                </p>
              </div>

              <p className="text-xl font-bold text-slate-900">
                {data.activeRentals}
              </p>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">

              <div>
                <p className="text-sm font-medium text-red-700">
                  Overdue
                </p>

                <p className="mt-1 text-xs text-red-400">
                  Need attention
                </p>
              </div>

              <p className="text-xl font-bold text-red-700">
                {data.overdueRentals}
              </p>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">

              <div>
                <p className="text-sm font-medium text-yellow-700">
                  Unread Notifications
                </p>

                <p className="mt-1 text-xs text-yellow-500">
                  User notifications
                </p>
              </div>

              <p className="text-xl font-bold text-yellow-700">
                {data.unreadNotifications}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Recent Rentals */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Rentals
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest rental activity
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/rentals")
            }
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all
            <ArrowRight size={15} />
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

              <tr>

                <th className="px-5 py-3">
                  Book
                </th>

                <th className="px-5 py-3">
                  User
                </th>

                <th className="px-5 py-3">
                  Rented
                </th>

                <th className="px-5 py-3">
                  Return
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {data.recentRentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No rentals found.
                  </td>
                </tr>
              ) : (
                data.recentRentals.map(
                  (rental) => {
                    const overdue =
                      isOverdue(
                        rental.status,
                        rental.returnDate
                      );

                    return (
                      <tr
                        key={rental.id}
                        onClick={() =>
                          navigate(
                            `/admin/rentals/${rental.id}`
                          )
                        }
                        className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-800">
                            {rental.title}
                          </p>

                          <p className="text-xs text-slate-400">
                            {rental.author}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <p className="max-w-[180px] truncate font-mono text-xs text-slate-500">
                            {rental.userId}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(
                            rental.rentedAt
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={
                              overdue
                                ? "font-medium text-red-600"
                                : "text-slate-500"
                            }
                          >
                            {formatDate(
                              rental.returnDate
                            )}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              overdue
                                ? "bg-red-50 text-red-700"
                                : rental.status ===
                                    "returned"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {overdue
                              ? "Overdue"
                              : rental.status}
                          </span>

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

      {/* Quick Navigation */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-slate-900">
          Quick Navigation
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <button
            onClick={() =>
              navigate("/admin/users")
            }
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <Users
              size={19}
              className="text-slate-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Manage Users
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/admin/books")
            }
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <BookOpen
              size={19}
              className="text-slate-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Manage Books
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/admin/rentals")
            }
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <ClipboardList
              size={19}
              className="text-slate-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Manage Rentals
            </span>
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/notifications"
              )
            }
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <Bell
              size={19}
              className="text-slate-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Notifications
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}