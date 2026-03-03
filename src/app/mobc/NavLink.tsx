"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink(
  { href, text }: { href: string; text: string }
) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        "rounded-md px-3 py-2 text-left transition-colors " +
        (isActive
          ? "border border-cyber-cyan/50 bg-cyber-cyan/10 font-semibold text-cyber-cyan shadow-[0_0_8px_var(--color-cyber-cyan)]"
          : "text-cyber-muted hover:bg-cyber-cyan/5 hover:text-cyber-text")
      }
      prefetch={false}
    >
      <span>{text}</span>
    </Link>
  );
}
