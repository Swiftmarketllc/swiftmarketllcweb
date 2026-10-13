import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import styles from "./color-block.module.css";

export type ColorBlockProps = Readonly<{
  surface: "warm" | "cool";
  children: ReactNode;
  labelledBy: string;
  id?: string;
  spacing?: "standard" | "compact";
}>;

export function ColorBlock({ surface, children, labelledBy, id, spacing = "compact" }: ColorBlockProps) {
  if (surface !== "warm" && surface !== "cool") throw new Error("Unsupported storytelling surface.");
  return (
    <Section id={id} labelledBy={labelledBy} spacing={spacing}>
      <Container className={styles.blockContainer}>
        <div className={`${styles.block} ${styles[surface]}`}>
          <Container width="reading" className="stack">{children}</Container>
        </div>
      </Container>
    </Section>
  );
}
