"use client";

import { useEffect, useState } from "react";
import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const me = await getMe();

      if (!me) {
        router.push("/sign-in");
        return;
      }

      setUser(me);

      setUserName(me.username ?? "");
      setEmail(me.email ?? "");
    })();
  }, [router, setUser]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedUser = await updateMe({ username });
    setUser(updatedUser);

    router.push("/profile");
    router.refresh();
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || "/images/default-avatar.svg"}
          alt={`${user.username} avatar`}
          width={120}
          height={120}
          className={css.avatar}
          priority
        />

        <form onSubmit={handleSaveUser} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              onChange={handleChange}
              id="username"
              type="text"
              className={css.input}
              value={username}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>

            <button
              onClick={() => router.push("/profile")}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
