import type { ComponentPropsWithRef, ReactNode } from "react";
import styles from "./primitives.module.css";

export type ButtonProps = Readonly<Omit<ComponentPropsWithRef<"button">, "children"> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
}>;

/** Native actions only. Client callbacks belong to a client caller, not a server page. */
export function Button({ children, variant = "primary", type = "button", className, ...props }: ButtonProps) {
  return (
    <button {...props} type={type}
      className={["button-base", variant === "primary" ? "button-primary" : undefined, styles.button, className].filter(Boolean).join(" ")}>
      {children}
    </button>
  );
}
