"use client";
import { useEffect, useState } from "react";
import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function EditProfilePage() {
  const router = useRouter();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getMe();
      if (!user) {
        router.push("/sign-in");
        return;
      }

      setUserName(user.username ?? "");
      setEmail(user.email ?? "");
    })();
  }, [router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateMe({ username });
    router.push("/profile");
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src="https://www.reshot.com/preview-assets/icons/EM8NS2L5GW/user-profile-EM8NS2L5GW.svg"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
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

          <p>Email:{email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={() => {
                router.push("/profile");
              }}
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
