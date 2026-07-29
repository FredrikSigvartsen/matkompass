"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navigation = [
  { href: "/prinsipper", label: "Prinsipper" },
  { href: "/mat-vi-spiser", label: "Mat vi spiser" },
  { href: "/oppskrifter", label: "Oppskrifter" },
  { href: "/middagsplan", label: "Middagsplan" },
  { href: "/fredriks-ukeplan", label: "Fredriks ukeplan" },
  { href: "/handleliste", label: "Handleliste" },
];

const Header = () => {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="wordmark" aria-label="Matkompass, forside">
          <span className="wordmark__mark" aria-hidden="true">M</span>
          <span>Matkompass</span>
        </Link>
        <nav aria-label="Hovedmeny">
          <ul className="main-nav">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  ref={pathname.startsWith(item.href) ? activeLinkRef : undefined}
                  className={pathname.startsWith(item.href) ? "is-active" : undefined}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
