import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface AnalyticsData {
  totalUsers: number;
  totalBooks: number;
  availableBooks: number;
  rentedBooks: number;
  totalRentals: number;
  activeRentals: number;
  returnedRentals: number;
  overdueRentals: number;
  unreadNotifications: number;
  totalNotifications: number;
}

function isActiveRental(
  status: string
) {
  return (
    status === "active" ||
    status === "rented"
  );
}

function isOverdue(
  status: string,
  returnDate: unknown
) {
  if (!isActiveRental(status)) {
    return false;
  }

  if (typeof returnDate !== "string") {
    return false;
  }

  const date = new Date(returnDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date < new Date();
}

export async function getAnalytics(): Promise<AnalyticsData> {
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

  const books =
    booksSnapshot.docs.map(
      (document) => document.data()
    );

  const rentals =
    rentalsSnapshot.docs.map(
      (document) => document.data()
    );

  const notifications =
    notificationsSnapshot.docs.map(
      (document) => document.data()
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
        isActiveRental(
          rental.status ?? ""
        )
    ).length;

  const returnedRentals =
    rentals.filter(
      (rental) =>
        rental.status === "returned"
    ).length;

  const overdueRentals =
    rentals.filter(
      (rental) =>
        isOverdue(
          rental.status ?? "",
          rental.returnDate
        )
    ).length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        notification.read !== true
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

    returnedRentals,

    overdueRentals,

    unreadNotifications,

    totalNotifications:
      notificationsSnapshot.size,
  };
}