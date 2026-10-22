import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const NavBar = () => {
  // const {data: authUser} = useGetAuthQuery();
  const router = useRouter();
  const pathname = usePathname();

  const isDashBoard =
    pathname.includes("/managers") || pathname.includes("/tenants");

  // const handleSignOut = async () => {
  //   await signOut();
  //   windown.location.href = "/";
  // }

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="bg-background flex w-full items-center justify-between px-8 py-3 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="hover:text-primary-300! cursor-pointer"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="text-xl font-bold text-black">
                HOME
                <span className="text-secondary-700 hover:text-primary-300! font-light">
                  LY
                </span>
              </div>
            </div>
          </Link>
          {isDashBoard && authUser && (
            <Button
              variant="secondary"
              className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 md:ml-4"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search",
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="ml-2 hidden md:block">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="ml-2 hidden md:block">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashBoardPage && (
          <p className="hidden text-black md:block">
            Discover your perfect rental apartment with our advanced search
          </p>
        )}
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="text-primary-200 hover:text-primary-400 h-6 w-6 cursor-pointer" />
                <span className="bg-secondary-700 rounder-full absolute top-0 right-0 h-2 w-2" />
              </div>

              <div className="relative hidden md:block">
                <Bell className="text-primary-200 hover:text-primary-400 h-6 w-6 cursor-pointer" />
                <span className="bg-secondary-700 rounder-full absolute top-0 right-0 h-2 w-2" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-primary-600">
                      {/* {authUser.userRole?[0].toUpperCase()} */}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary-200 hidden md:block">
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-primary-700 bg-white">
                  <DropdownMenuItem
                    className="hover:bg-primary-700! hover:text-primary-100! cursor-pointer font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false },
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-primary-200" />
                  <DropdownMenuItem
                    className="hover:bg-primary-700! hover:text-primary-100! cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false },
                      )
                    }
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-primary-700! hover:text-primary-100! cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="hover:text-primary-700 rounded-lg bg-black text-white hover:bg-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="bg-secondary-600 hover:text-primary-700 rounderd-lg text-white hover:bg-white"
                >
                  Sign Up
                </Button>
              </Link>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
