import bcrypt from "bcryptjs";
import { type ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

interface AdminUser {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<{ id: string } | null> {
  const db = await getDb();
  const admin = await db
    .collection<AdminUser>("admins")
    .findOne({ email: email.toLowerCase().trim() });

  if (!admin) return null;

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return null;

  return { id: admin._id.toHexString() };
}
