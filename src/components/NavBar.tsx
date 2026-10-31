"use client";

import Image from "next/image";
import Link from "next/link";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { roleHome, type SessionUser } from "@/lib/auth";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { LogoutButton } from "./logout-button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const menuItemClassName =
  "cursor-pointer rounded-sm px-2 py-1.5 hover:bg-primary-700 hover:text-primary-100 focus:bg-primary-700 focus:text-primary-100 data-highlighted:bg-primary-700 data-highlighted:text-primary-100";

export default function NavBar({
  user,
  isDashboard = false,
  variant = "default",
}: {
  user: SessionUser | null;
  isDashboard?: boolean;
  variant?: "default" | "landing";
}) {
  const isLanding = variant === "landing";
  return (
    <header
      className={
        isLanding
          ? "relative z-20 w-full px-5 py-6 text-white sm:px-10 lg:px-14"
          : "bg-background fixed top-0 left-0 z-50 w-full border-b shadow-sm"
      }
      style={isLanding ? undefined : { height: NAVBAR_HEIGHT }}
    >
      <nav
        className={
          isLanding
            ? "flex flex-wrap items-center justify-between gap-5"
            : "flex h-full items-center justify-between gap-4 px-6"
        }
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3">
          {isDashboard && <SidebarTrigger className="md:hidden" />}
          <Link
            href="/"
            className={
              "flex items-center gap-2 font-bold " +
              (isLanding ? "tracking-[0.15em] text-white" : "text-black")
            }
          >
            <Image
              src="/logo.svg"
              alt=""
              width={24}
              height={24}
              className={isLanding ? "brightness-0 invert" : undefined}
            />
            <span>HOMELY</span>
          </Link>
        </div>
        {isLanding && (
          <div className="order-3 flex w-full justify-center gap-1 rounded-full border border-white/30 bg-black/30 p-1 text-sm backdrop-blur-md sm:order-none sm:w-auto">
            <a
              href="#home"
              className="rounded-full bg-white px-4 py-2 text-black"
            >
              Home
            </a>
            <a
              href="#inspiration"
              className="rounded-full px-4 py-2 hover:bg-white/20"
            >
              Inspiration
            </a>
            <a
              href="#about"
              className="rounded-full px-4 py-2 hover:bg-white/20"
            >
              About
            </a>
          </div>
        )}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`User menu: ${user.email} (${user.role})`}
            >
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary-600 text-white">
                  {user.role[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-primary-200 text-primary-700 w-auto min-w-32 rounded-md border bg-white ring-0"
            >
              <DropdownMenuItem
                className={`${menuItemClassName} font-bold`}
                render={<Link href={roleHome[user.role]} scroll={false} />}
              >
                Go to Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary-200" />
              {/* Settings has no implemented destination in Homely yet. */}
              <DropdownMenuItem
                className={menuItemClassName}
                disabled
                title="Settings are not available yet"
              >
                Settings
              </DropdownMenuItem>
              <LogoutButton asMenuItem className={menuItemClassName} />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : isLanding ? (
          <Link
            href="/login"
            className="rounded-full bg-[#c8f28b] px-6 py-3 text-sm font-medium text-[#17200f] hover:bg-[#b8e577]"
          >
            Log in
          </Link>
        ) : (
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
