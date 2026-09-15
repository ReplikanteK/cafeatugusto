"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";

export function GuideCtaLink({
  slug,
  position,
  destination = "/recomendador",
  className,
  children,
}: {
  slug: string;
  position: string;
  destination?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const href = `${destination}?src=guide_${slug}`;
  const handleClick = () => {
    track("guide_cta_click", {
      slug,
      destination,
      cta_position: position,
    });
  };
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
