import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./primitives.module.css";

export type ContainerProps = Readonly<Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  width?: "page" | "reading";
}>;

export function Container({ children, width = "page", className, ...props }: ContainerProps) {
  return (
    <div {...props} className={[width === "reading" ? "reading-container" : "page-container", styles.container, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
