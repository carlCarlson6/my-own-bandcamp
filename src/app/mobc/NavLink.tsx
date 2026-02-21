"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  text: string;
};

export default function NavLink({ href, text }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        "rounded-md px-3 py-2 text-left transition-colors " +
        (isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5")
      }
      prefetch={false}
    >
      <span>{text}</span>
    </Link>
  );
}
