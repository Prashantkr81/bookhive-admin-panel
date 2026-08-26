import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export interface Rental {
  id: string;

  userId: string;
  ownerId: string;
  bookId: string;

  title: string;
  author: string;
  image: string | null;

  price: number;

  rentedAt: string | null;
  returnDate: string | null;
  actualReturnDate: string | null;

  address: string;
  paymentMethod: string;

  status: string;

  notes: string | null;
  rating: number | null;
}

function mapRental(
  document: any
): Rental {
  const data = document.data();

  return {
    id: document.id,

    userId: data.userId ?? "",
    ownerId: data.ownerId ?? "",
    bookId: data.bookId ?? "",

    title: data.title ?? "Unknown Book",
    author:
      data.author ?? "Unknown Author",

    image: data.image ?? null,

    price: Number(data.price ?? 0),

    rentedAt:
      typeof data.rentedAt === "string"
        ? data.rentedAt
        : null,

    returnDate:
      typeof data.returnDate === "string"
        ? data.returnDate
        : null,

    actualReturnDate:
      typeof data.actualReturnDate ===
      "string"
        ? data.actualReturnDate
        : null,

    address:
      data.address ?? "—",

    paymentMethod:
      data.paymentMethod ?? "—",

    status:
      data.status ?? "unknown",

    notes:
      data.notes ?? null,

    rating:
      typeof data.rating === "number"
        ? data.rating
        : null,
  };
}

export async function getAllRentals(): Promise<
  Rental[]
> {
  const snapshot = await getDocs(
    collection(db, "rentals")
  );

  return snapshot.docs
    .map(mapRental)
    .sort((a, b) => {
      const dateA = a.rentedAt
        ? new Date(a.rentedAt).getTime()
        : 0;

      const dateB = b.rentedAt
        ? new Date(b.rentedAt).getTime()
        : 0;

      return dateB - dateA;
    });
}

export async function getRentalById(
  rentalId: string
): Promise<Rental | null> {
  const snapshot = await getDoc(
    doc(db, "rentals", rentalId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapRental(snapshot);
}