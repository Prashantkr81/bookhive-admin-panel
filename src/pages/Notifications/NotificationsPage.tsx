import {
  Bell,
  Eye,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getAllNotifications,
  type Notification,
} from "../../services/notificationService";

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

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllNotifications();

      setNotifications(data);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications =
    useMemo(() => {
      const value =
        search.toLowerCase().trim();

      return notifications.filter(
        (notification) => {
          const matchesSearch =
            !value ||
            notification.message
              .toLowerCase()
              .includes(value) ||
            notification.userId
              .toLowerCase()
              .includes(value) ||
            (
              notification.type ?? ""
            )
              .toLowerCase()
              .includes(value);

          const matchesFilter =
            filter === "all" ||
            (filter === "read" &&
              notification.read) ||
            (filter === "unread" &&
              !notification.read);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor notifications sent to BookHive users.
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
            <Bell
              size={18}
              className="text-slate-500"
            />

            <span className="text-sm font-medium text-slate-700">
              {notifications.length} Total
            </span>
          </div>

          <div className="rounded-lg bg-yellow-50 px-4 py-2 ring-1 ring-yellow-200">
            <span className="text-sm font-medium text-yellow-700">
              {unreadCount} Unread
            </span>
          </div>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={loadNotifications}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative max-w-lg flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search message, user ID or type..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="all">
              All Notifications
            </option>

            <option value="unread">
              Unread
            </option>

            <option value="read">
              Read
            </option>
          </select>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

              <tr>

                <th className="px-5 py-4">
                  Message
                </th>

                <th className="px-5 py-4">
                  User
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Timestamp
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredNotifications.length === 0 ? (
                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <Bell
                        size={32}
                        className="text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-600">
                        No notifications found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters.
                      </p>

                    </div>

                  </td>

                </tr>
              ) : (
                filteredNotifications.map(
                  (notification) => (
                    <tr
                      key={notification.id}
                      className={`border-t border-slate-100 transition hover:bg-slate-50 ${
                        !notification.read
                          ? "bg-blue-50/30"
                          : ""
                      }`}
                    >

                      {/* Message */}
                      <td className="max-w-[320px] px-5 py-4">

                        <div className="flex items-start gap-3">

                          {!notification.read && (
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          )}

                          <p className="line-clamp-2 text-slate-700">
                            {notification.message}
                          </p>

                        </div>

                      </td>

                      {/* User */}
                      <td className="max-w-[180px] px-5 py-4">

                        <p className="truncate font-mono text-xs text-slate-500">
                          {notification.userId}
                        </p>

                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                          {notification.type ||
                            "General"}
                        </span>

                      </td>

                      {/* Read */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            notification.read
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {notification.read
                            ? "Read"
                            : "Unread"}
                        </span>

                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(
                          notification.timestamp
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/notifications/${notification.id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3">

            <p className="text-xs text-slate-500">
              Showing{" "}

              <span className="font-medium text-slate-700">
                {filteredNotifications.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-slate-700">
                {notifications.length}
              </span>{" "}

              notifications
            </p>

          </div>
        )}

      </div>

    </div>
  );
}