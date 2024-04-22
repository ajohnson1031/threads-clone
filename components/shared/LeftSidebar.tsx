"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(({ imgURL, route, label }) => {
          const isActive = (pathname.includes(route) && route.length > 1) || pathname === route;
          return (
            <Link href={route} key={label} className={cn("leftsidebar_link", { "bg-primary-500": isActive })}>
              <Image src={imgURL} alt={label} width={24} height={24} />

              <p className="text-light-1 max-lg:hidden">{label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer">
              <Image src="./assets/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden gap-4 p-4">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
