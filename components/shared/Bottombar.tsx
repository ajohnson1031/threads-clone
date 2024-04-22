"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Bottombar = () => {
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(({ imgURL, route, label }) => {
          const isActive = (pathname.includes(route) && route.length > 1) || pathname === route;
          return (
            <Link href={route} key={label} className={cn("bottombar_link", { "bg-primary-500": isActive })}>
              <Image src={imgURL} alt={label} width={24} height={24} />

              <p className="text-subtle-hidden text-light-1 max-sm:hidden">{label.split(/\s+./)[0]}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
