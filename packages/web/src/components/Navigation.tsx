import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MenuIcon, CloseIcon } from "@/components/icons";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Auth-N-Tik
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="animate-pulse">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 truncate max-w-40">
                  Welcome, {session.user?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <MenuIcon className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
              {/* Close icon */}
              <CloseIcon className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {status === "loading" ? (
              <div className="animate-pulse p-2 text-center">Loading...</div>
            ) : session ? (
              <div className="space-y-3">
                <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-100">
                  Welcome, {session.user?.name}
                </div>
                <div className="px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
