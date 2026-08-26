import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export type AdminRole = "admin" | "super_admin";

export interface Admin {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  status: "active" | "disabled";
}

export async function getAdminByUid(
  uid: string
): Promise<Admin | null> {
  const adminRef = doc(db, "admins", uid);

  const snapshot = await getDoc(adminRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Admin;
}