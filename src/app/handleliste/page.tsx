import { GroceryListClient } from "./grocery-list-client";
import styles from "./grocery-list.module.css";
import {
  getWeeklyGroceryList,
  type GroceryWeekSelection,
} from "@/lib/grocery-list";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Handleliste",
  description:
    "Ukens handleliste for Fredriks måltider og familiens middager, sortert etter butikk.",
};

interface GroceryListPageProps {
  searchParams: Promise<{ uke?: string | string[] }>;
}

export default async function GroceryListPage({ searchParams }: GroceryListPageProps) {
  await connection();
  const params = await searchParams;
  const selection: GroceryWeekSelection = params.uke === "neste" ? "next" : "current";
  const [currentList, nextList] = [
    getWeeklyGroceryList("current"),
    getWeeklyGroceryList("next"),
  ];
  const list = selection === "current" ? currentList : nextList;

  return (
    <main className={`content-page ${styles.page}`}>
      <header className={`page-intro ${styles.intro}`}>
        <p className="eyebrow">Uke {list.week.weekNumber} · Plan {list.week.type}</p>
        <h1>Handleliste</h1>
        <p className="page-intro__description">
          Fredriks to første måltider hver dag og familiens middag, samlet uten å
          telle Fredriks middagsandel to ganger. Valgfritt treningsdrivstoff er
          ikke med.
        </p>
        <p className={styles.dateRange}>{list.week.dateRange}</p>
      </header>

      <nav className={styles.weekNav} aria-label="Velg handleuke">
        <Link
          aria-current={selection === "current" ? "page" : undefined}
          className={selection === "current" ? styles.activeWeek : undefined}
          href="/handleliste"
        >
          Denne uken · {currentList.week.weekNumber}
        </Link>
        <Link
          aria-current={selection === "next" ? "page" : undefined}
          className={selection === "next" ? styles.activeWeek : undefined}
          href="/handleliste?uke=neste"
        >
          Neste uke · {nextList.week.weekNumber}
        </Link>
      </nav>

      <section className={styles.explainer} aria-labelledby="slik-leses-listen">
        <div>
          <p className="eyebrow">To mengder</p>
          <h2 id="slik-leses-listen">Behov først, praktisk kjøpsmengde etterpå.</h2>
        </div>
        <p>
          Kokt ris, quinoa og potet er omregnet til mengden som kjøpes. Butikklenkene
          åpner et søk hos valgt butikk; pris og lagerstatus kontrolleres der.
        </p>
      </section>

      <GroceryListClient list={list} />
    </main>
  );
}
