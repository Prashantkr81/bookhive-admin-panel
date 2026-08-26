import {
  ArrowLeft,
  Bell,
  BookOpen,
  ExternalLink,
  User,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getNotificationById,
  type Notification,
} from "../../services/notificationService";

import {
  getUserById,
  type User as BookHiveUser,
} from "../../services/userService";

import {
  getBookById,
  type Book,
} from "../../services/bookService";

function formatDate(value: string | null) {
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

export default function NotificationDetailsPage() {
  const { notificationId } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] =
    useState<Notification | null>(null);

  const [user, setUser] =
    useState<BookHiveUser | null>(null);

  const [book, setBook] =
    useState<Book | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadNotification() {
    if (!notificationId) {
      setError("Invalid notification ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const notificationData =
        await getNotificationById(
          notificationId
        );

      if (!notificationData) {
        setError("Notification not found.");
        return;
      }

      setNotification(notificationData);

      const userId =
        notificationData.relatedUserId ||
        notificationData.userId;

      const userPromise = userId
        ? getUserById(userId)
        : Promise.resolve(null);

      const bookPromise =
        notificationData.relatedBookId
          ? getBookById(
              notificationData.relatedBookId
            )
          : Promise.resolve(null);

      const [userData, bookData] =
        await Promise.all([
          userPromise,
          bookPromise,
        ]);

      setUser(userData);
      setBook(bookData);
    } catch (error) {
      console.error(
        "Failed to load notification:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load notification."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotification();
  }, [notificationId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading notification...
        </p>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <button
          onClick={() =>
            navigate("/admin/notifications")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Notifications
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error || "Notification not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Back */}
      <button
        onClick={() =>
          navigate("/admin/notifications")
        }
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back to Notifications
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Notification #{notification.id}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Notification Details
          </h1>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
            notification.read
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {notification.read
            ? "Read"
            : "Unread"}
        </span>
      </div>

      {/* Message */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Bell
              size={21}
              className="text-slate-600"
            />
          </div>

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-900">
                Message
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                {notification.type ||
                  "General"}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {notification.message}
            </p>

            <p className="mt-4 text-xs text-slate-400">
              {formatDate(
                notification.timestamp
              )}
            </p>

          </div>

        </div>

      </div>

      {/* Related User */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-2">
          <User
            size={18}
            className="text-slate-500"
          />

          <h2 className="font-semibold text-slate-900">
            Related User
          </h2>
        </div>

        {user ? (
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                  {user.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-medium text-slate-800">
                  {user.name}
                </p>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/admin/users/${user.id}`
                )
              }
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              View User
              <ExternalLink size={15} />
            </button>

          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-400">
              User information unavailable.
            </p>

            <p className="mt-2 break-all font-mono text-xs text-slate-400">
              {notification.userId || "No user ID"}
            </p>
          </div>
        )}

      </div>

      {/* Related Book */}
      {notification.relatedBookId && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">
            <BookOpen
              size={18}
              className="text-slate-500"
            />

            <h2 className="font-semibold text-slate-900">
              Related Book
            </h2>
          </div>

          {book ? (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-16 w-11 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-11 items-center justify-center rounded bg-slate-100">
                    <BookOpen
                      size={18}
                      className="text-slate-400"
                    />
                  </div>
                )}

                <div>
                  <p className="font-medium text-slate-800">
                    {book.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {book.author}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    ₹{book.price}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    `/admin/books/${book.id}`
                  )
                }
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                View Book
                <ExternalLink size={15} />
              </button>

            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-400">
                Book information unavailable.
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-400">
                {notification.relatedBookId}
              </p>
            </div>
          )}

        </div>
      )}

      {/* Technical Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-semibold text-slate-900">
          Notification Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Notification ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {notification.id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              User ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {notification.userId || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Type
            </p>

            <p className="mt-1 capitalize text-sm text-slate-700">
              {notification.type ||
                "General"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Read Status
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {notification.read
                ? "Read"
                : "Unread"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Related User ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {notification.relatedUserId ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Related Book ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {notification.relatedBookId ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Action URL
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {notification.actionUrl ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Timestamp
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(
                notification.timestamp
              )}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}