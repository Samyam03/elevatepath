import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  StarsIcon,
  FileText,
  PenBox,
} from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md dark:bg-gray-900">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/elevatepath.png"
            alt="ElevatePath Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            ElevatePath
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Signed-in UI */}
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="w-4 h-4" />
                  <span className="hidden md:block">Growth Tools</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cover-letter" className="flex items-center gap-2">
                    <PenBox className="w-4 h-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/career-paths" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Career Paths
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Button */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopover: {
                    width: "auto",
                    maxWidth: "300px",
                  },
                  userButtonAvatarBox: {
                    width: "36px",
                    height: "36px",
                  },
                  userButtonAvatar: {
                    width: "36px",
                    height: "36px",
                  },
                },
              }}
            />
          </SignedIn>

          {/* Signed-out UI */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
