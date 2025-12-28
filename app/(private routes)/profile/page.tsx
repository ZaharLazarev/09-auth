import { Metadata } from "next";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile page",
  description: "Page of your profile",
  openGraph: {
    title: "Profile page",
    description: "Page of your profile",
    url: `https://08-zustand-sigma-ashen.vercel.app`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};
export default async function ProfilePage() {
  const user = await getMe();

  if (!user) return null;
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/images/default-avatar.svg"}
            alt={`${user.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
