import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string | null;
  read: boolean;
  type: string | null;
  relatedBookId: string | null;
  relatedUserId: string | null;
  actionUrl: string | null;
}

function mapNotification(
  document: any
): Notification {
  const data = document.data();

  let timestamp: string | null = null;

  if (typeof data.timestamp === "string") {
    timestamp = data.timestamp;
  } else if (
    data.timestamp &&
    typeof data.timestamp.toDate === "function"
  ) {
    timestamp = data.timestamp
      .toDate()
      .toISOString();
  }

  return {
    id: document.id,
    userId: data.userId ?? "",
    message: data.message ?? "",
    timestamp,
    read: data.read === true,
    type: data.type ?? null,
    relatedBookId:
      data.relatedBookId ?? null,
    relatedUserId:
      data.relatedUserId ?? null,
    actionUrl:
      data.actionUrl ?? null,
  };
}

export async function getAllNotifications(): Promise<
  Notification[]
> {
  const snapshot = await getDocs(
    collection(db, "notifications")
  );

  return snapshot.docs
    .map(mapNotification)
    .sort((a, b) => {
      const dateA = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0;

      const dateB = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0;

      return dateB - dateA;
    });
}

export async function getNotificationById(
  notificationId: string
): Promise<Notification | null> {
  const snapshot = await getDoc(
    doc(
      db,
      "notifications",
      notificationId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapNotification(snapshot);
}