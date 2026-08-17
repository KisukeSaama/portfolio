"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiRequestError, apiMutation, resetCsrf } from "~/lib/api";
import type { Session } from "~/types/api";

const schema = z.object({
  email: z.email("Saisissez une adresse e-mail valide."),
  password: z.string().min(1, "Le mot de passe est obligatoire.").max(200),
});
type Values = z.infer<typeof schema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function submit(values: Values) {
    setServerError("");
    try {
      resetCsrf();
      await apiMutation<Session>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof ApiRequestError
          ? error.payload.message
          : "Connexion impossible. Réessayez.",
      );
    }
  }

  return (
    <form
      className="login-form"
      onSubmit={(event) => void handleSubmit(submit)(event)}
      noValidate
    >
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}
      <div className="field">
        <label htmlFor="email">Adresse e-mail</label>
        <input
          className="input"
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <span id="email-error" className="field-error">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input
          className="input"
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <span id="password-error" className="field-error">
            {errors.password.message}
          </span>
        )}
      </div>
      <button className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          "Connexion…"
        ) : (
          <>
            <LockKeyhole size={17} aria-hidden />
            Se connecter
          </>
        )}
      </button>
    </form>
  );
}
