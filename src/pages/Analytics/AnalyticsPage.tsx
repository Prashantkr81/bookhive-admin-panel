import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getAnalytics,
  type AnalyticsData,
} from "../../services/analyticsService";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function MetricCard({
  title,
  value,
  icon,
  description,
}: MetricCardProps) {
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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAnalytics();

      setAnalytics(data);
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl font-bold text-slate-900">
          Analytics
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {error ||
              "Unable to load analytics."}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>

      </div>
    );
  }

  const utilizationRate =
    analytics.totalBooks > 0
      ? Math.round(
          (analytics.rentedBooks /
            analytics.totalBooks) *
            100
        )
      : 0;

  const returnRate =
    analytics.totalRentals > 0
      ? Math.round(
          (analytics.returnedRentals /
            analytics.totalRentals) *
            100
        )
      : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of BookHive platform activity.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
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

      {/* Platform Metrics */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Platform Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            title="Total Users"
            value={analytics.totalUsers}
            icon={<Users size={20} />}
            description="Registered users"
          />

          <MetricCard
            title="Total Books"
            value={analytics.totalBooks}
            icon={<BookOpen size={20} />}
            description="Books listed"
          />

          <MetricCard
            title="Total Rentals"
            value={analytics.totalRentals}
            icon={<ClipboardList size={20} />}
            description="All rental records"
          />

          <MetricCard
            title="Notifications"
            value={analytics.totalNotifications}
            icon={<Bell size={20} />}
            description="Total notifications"
          />

        </div>
      </div>

      {/* Rental Metrics */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Rental Activity
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            title="Active Rentals"
            value={analytics.activeRentals}
            icon={
              <TrendingUp size={20} />
            }
            description="Currently rented"
          />

          <MetricCard
            title="Returned"
            value={analytics.returnedRentals}
            icon={
              <CheckCircle2 size={20} />
            }
            description="Completed rentals"
          />

          <MetricCard
            title="Overdue"
            value={analytics.overdueRentals}
            icon={
              <AlertTriangle size={20} />
            }
            description="Past expected return"
          />

          <MetricCard
            title="Unread Notifications"
            value={
              analytics.unreadNotifications
            }
            icon={
              <Bell size={20} />
            }
            description="Awaiting user attention"
          />

        </div>
      </div>

      {/* Books Overview */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Availability */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Book Availability
          </h2>

          <div className="mt-6">

            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.availableBooks}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Available books
                </p>
              </div>

              <p className="text-sm text-slate-400">
                {analytics.rentedBooks} rented
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-slate-700 transition-all"
                style={{
                  width:
                    analytics.totalBooks > 0
                      ? `${utilizationRate}%`
                      : "0%",
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-400">

              <span>
                {analytics.availableBooks} available
              </span>

              <span>
                {utilizationRate}% rented
              </span>

            </div>

          </div>
        </div>

        {/* Rental Completion */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Rental Completion
          </h2>

          <div className="mt-6">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {returnRate}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Rentals returned
                </p>
              </div>

              <p className="text-sm text-slate-400">
                {analytics.returnedRentals} completed
              </p>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-slate-700 transition-all"
                style={{
                  width: `${returnRate}%`,
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-400">

              <span>
                {analytics.returnedRentals} returned
              </span>

              <span>
                {analytics.activeRentals} active
              </span>

            </div>

          </div>
        </div>

      </div>

      {/* Operational Alerts */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-semibold text-slate-900">
          Operational Overview
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Available Inventory
            </p>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {analytics.availableBooks}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Active Rentals
            </p>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {analytics.activeRentals}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Overdue Rentals
            </p>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {analytics.overdueRentals}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}