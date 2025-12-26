"use client";
import css from "./SignUpPage.module.css";
import { register, RegisterParams } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export default function SignUpPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as RegisterParams;
      const res = await register(formValues);
      if (res) {
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Oops... some error"
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>
      </form>
      {error && <p className={css.error}>{error}</p>}
    </main>
  );
}
