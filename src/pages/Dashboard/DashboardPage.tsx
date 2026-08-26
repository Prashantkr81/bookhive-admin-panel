import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getRecentRentals,
  getRecentUsers,
  type DashboardStats,
  type RecentRental,
  type RecentUser,
} from "../../services/dashboardService";

function formatDate(
  dateString: string | null
) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "rented":
      return "bg-blue-50 text-blue-700";

    case "returned":
      return "bg-green-50 text-green-700";

    case "overdue":
      return "bg-red-50 text-red-700";

    case "cancelled":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [users, setUsers] =
    useState<RecentUser[]>([]);

  const [rentals, setRentals] =
    useState<RecentRental[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        dashboardStats,
        recentUsers,
        recentRentals,
      ] = await Promise.all([
        getDashboardStats(),
        getRecentUsers(5),
        getRecentRentals(5),
      ]);

      setStats(dashboardStats);
      setUsers(recentUsers);
      setRentals(recentRentals);
    } catch (error) {
      console.error(
        "Dashboard loading failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard data."
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            Unable to load dashboard
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: CheckCircle,
    },
    {
      title: "Active Rentals",
      value: stats.activeRentals,
      icon: Clock,
    },
    {
      title: "Overdue Rentals",
      value: stats.overdueRentals,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your BookHive platform.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {card.value.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 p-3">
                  <Icon
                    size={21}
                    className="text-slate-600"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Rented Books
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.rentedBooks.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Book Availability
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.totalBooks > 0
              ? Math.round(
                  (stats.availableBooks /
                    stats.totalBooks) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Users */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Users
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Latest registered users
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">
                    User
                  </th>

                  <th className="px-5 py-3">
                    Email
                  </th>

                  <th className="px-5 py-3">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">
                          {user.name}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Rentals */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Recent Rentals
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Latest rental activity
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">
                    Book
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3">
                    Return
                  </th>
                </tr>
              </thead>

              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      No rentals found.
                    </td>
                  </tr>
                ) : (
                  rentals.map((rental) => (
                    <tr
                      key={rental.id}
                      className="border-t border-slate-100"
                    >
                      <td className="max-w-[180px] px-5 py-4">
                        <p className="truncate font-medium text-slate-800">
                          {rental.title}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {rental.author}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                            rental.status
                          )}`}
                        >
                          {rental.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(
                          rental.returnDate
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}