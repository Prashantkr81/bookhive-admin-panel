import {
  Eye,
  Search,
  Users as UsersIcon,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllUsers,
  type User,
} from "../../services/userService";

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

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllUsers();

      setUsers(data);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {
      const value =
        search.toLowerCase().trim();

      if (!value) {
        return users;
      }

      return users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(value) ||
          user.email
            .toLowerCase()
            .includes(value)
      );
    }, [users, search]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading users...
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
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage BookHive users and their accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
          <UsersIcon
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm font-medium text-slate-700">
            {users.length.toLocaleString()} Users
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={loadUsers}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
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
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  User
                </th>

                <th className="px-5 py-4">
                  Email
                </th>

                <th className="px-5 py-4">
                  Joined
                </th>

                <th className="px-5 py-4">
                  User ID
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <UsersIcon
                        size={32}
                        className="text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-600">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-slate-800">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              User
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-slate-600">
                        {user.email}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* UID */}
                      <td className="max-w-[180px] px-5 py-4">
                        <p className="truncate font-mono text-xs text-slate-400">
                          {user.id}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          onClick={() =>
                            navigate(
                              `/admin/users/${user.id}`
                            )
                          }
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
        {filteredUsers.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing{" "}

              <span className="font-medium text-slate-700">
                {filteredUsers.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-slate-700">
                {users.length}
              </span>{" "}

              users
            </p>
          </div>
        )}
      </div>

    </div>
  );
}