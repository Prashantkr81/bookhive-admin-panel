import {
  ClipboardList,
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
  getAllRentals,
  type Rental,
} from "../../services/rentalServices";

import StatusBadge from "../../components/common/StatusBadge";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(rental: Rental) {
  if (
    rental.status !== "active" &&
    rental.status !== "rented"
  ) {
    return false;
  }

  if (!rental.returnDate) {
    return false;
  }

  const returnDate = new Date(
    rental.returnDate
  );

  return (
    !Number.isNaN(returnDate.getTime()) &&
    returnDate < new Date()
  );
}

export default function RentalsPage() {
  const navigate = useNavigate();

  const [rentals, setRentals] =
    useState<Rental[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadRentals() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllRentals();

      setRentals(data);
    } catch (error) {
      console.error(
        "Failed to load rentals:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load rentals."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRentals();
  }, []);

  const filteredRentals = useMemo(() => {
    const value =
      search.toLowerCase().trim();

    return rentals.filter((rental) => {
      const matchesSearch =
        !value ||
        rental.title
          .toLowerCase()
          .includes(value) ||
        rental.author
          .toLowerCase()
          .includes(value) ||
        rental.userId
          .toLowerCase()
          .includes(value) ||
        rental.ownerId
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        status === "all" ||
        (status === "overdue" &&
          isOverdue(rental)) ||
        status === rental.status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [rentals, search, status]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading rentals...
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
            Rentals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage BookHive rentals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
          <ClipboardList
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm font-medium text-slate-700">
            {rentals.length.toLocaleString()} Rentals
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
            onClick={loadRentals}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
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
              placeholder="Search by book, author, user ID..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />

          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="all">
              All Rentals
            </option>

            <option value="active">
              Active
            </option>

            <option value="rented">
              Rented
            </option>

            <option value="returned">
              Returned
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="overdue">
              Overdue
            </option>
          </select>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>

                <th className="px-5 py-4">
                  Book
                </th>

                <th className="px-5 py-4">
                  Renter
                </th>

                <th className="px-5 py-4">
                  Rented
                </th>

                <th className="px-5 py-4">
                  Return Date
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <ClipboardList
                        size={32}
                        className="text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-600">
                        No rentals found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredRentals.map(
                  (rental) => {
                    const overdue =
                      isOverdue(rental);

                    return (
                      <tr
                        key={rental.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >

                        {/* Book */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            {rental.image ? (
                              <img
                                src={rental.image}
                                alt={rental.title}
                                className="h-12 w-9 rounded object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-9 items-center justify-center rounded bg-slate-100">
                                <ClipboardList
                                  size={16}
                                  className="text-slate-400"
                                />
                              </div>
                            )}

                            <div>
                              <p className="max-w-[180px] truncate font-medium text-slate-800">
                                {rental.title}
                              </p>

                              <p className="text-xs text-slate-400">
                                {rental.author}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Renter */}
                        <td className="max-w-[170px] px-5 py-4">
                          <p className="truncate font-mono text-xs text-slate-500">
                            {rental.userId}
                          </p>
                        </td>

                        {/* Rented */}
                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(
                            rental.rentedAt
                          )}
                        </td>

                        {/* Return */}
                        <td className="px-5 py-4">

                          <p
                            className={
                              overdue
                                ? "font-medium text-red-600"
                                : "text-slate-500"
                            }
                          >
                            {formatDate(
                              rental.returnDate
                            )}
                          </p>

                          {overdue && (
                            <p className="mt-1 text-xs text-red-500">
                              Overdue
                            </p>
                          )}

                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              overdue
                                ? "Overdue"
                                : rental.status
                            }
                          />
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-medium text-slate-700">
                          ₹{rental.price}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/rentals/${rental.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            <Eye size={16} />
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        {filteredRentals.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing{" "}

              <span className="font-medium text-slate-700">
                {filteredRentals.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-slate-700">
                {rentals.length}
              </span>{" "}

              rentals
            </p>
          </div>
        )}

      </div>

    </div>
  );
}