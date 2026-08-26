import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  createdAt: string | null;
}

export interface DashboardRental {
  id: string;
  title: string;
  author: string;
  userId: string;
  price: number;
  rentedAt: string | null;
  returnDate: string | null;
  status: string;
}

export interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  availableBooks: number;
  rentedBooks: number;
  totalRentals: number;
  activeRentals: number;
  overdueRentals: number;
  unreadNotifications: number;

  recentUsers: DashboardUser[];
  recentRentals: DashboardRental[];
}

function toDateString(
  value: any
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return null;
}

function isActive(
  status: string
) {
  return (
    status === "active" ||
    status === "rented"
  );
}

function isOverdue(
  status: string,
  returnDate: string | null
) {
  if (!isActive(status)) {
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

export async function getDashboardData(): Promise<DashboardData> {
  const [
    usersSnapshot,
    booksSnapshot,
    rentalsSnapshot,
    notificationsSnapshot,
  ] = await Promise.all([
    getDocs(
      collection(db, "users")
    ),

    getDocs(
      collection(db, "books")
    ),

    getDocs(
      collection(db, "rentals")
    ),

    getDocs(
      collection(db, "notifications")
    ),
  ]);

  const users =
    usersSnapshot.docs
      .map((document) => {
        const data =
          document.data();

        return {
          id: document.id,
          name:
            data.name ??
            "Unknown User",
          email:
            data.email ?? "—",
          photoURL:
            data.photoURL ??
            null,
          createdAt:
            toDateString(
              data.createdAt
            ),
        };
      })
      .sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(
              a.createdAt
            ).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(
              b.createdAt
            ).getTime()
          : 0;

        return dateB - dateA;
      });

  const books =
    booksSnapshot.docs.map(
      (document) =>
        document.data()
    );

  const rentals =
    rentalsSnapshot.docs
      .map((document) => {
        const data =
          document.data();

        return {
          id: document.id,

          title:
            data.title ??
            "Unknown Book",

          author:
            data.author ??
            "Unknown Author",

          userId:
            data.userId ?? "",

          price:
            Number(
              data.price ?? 0
            ),

          rentedAt:
            toDateString(
              data.rentedAt
            ),

          returnDate:
            toDateString(
              data.returnDate
            ),

          status:
            data.status ??
            "unknown",
        };
      })
      .sort((a, b) => {
        const dateA = a.rentedAt
          ? new Date(
              a.rentedAt
            ).getTime()
          : 0;

        const dateB = b.rentedAt
          ? new Date(
              b.rentedAt
            ).getTime()
          : 0;

        return dateB - dateA;
      });

  const notifications =
    notificationsSnapshot.docs.map(
      (document) =>
        document.data()
    );

  const availableBooks =
    books.filter(
      (book) =>
        book.isAvailable === true
    ).length;

  const rentedBooks =
    books.filter(
      (book) =>
        book.isAvailable !== true
    ).length;

  const activeRentals =
    rentals.filter(
      (rental) =>
        isActive(
          rental.status
        )
    ).length;

  const overdueRentals =
    rentals.filter(
      (rental) =>
        isOverdue(
          rental.status,
          rental.returnDate
        )
    ).length;

  return {
    totalUsers:
      usersSnapshot.size,

    totalBooks:
      booksSnapshot.size,

    availableBooks,

    rentedBooks,

    totalRentals:
      rentalsSnapshot.size,

    activeRentals,

    overdueRentals,

    unreadNotifications:
      notifications.filter(
        (notification) =>
          notification.read !== true
      ).length,

    recentUsers:
      users.slice(0, 5),

    recentRentals:
      rentals.slice(0, 5),
  };
}