"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scale, Menu, X, User as UserIcon, LogOut, Shield, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">LegalConnect</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/lawyers" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Find Lawyers
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="px-5">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-colors hover:bg-primary/10">
                    <Avatar className="h-9 w-9 border border-border shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {user ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background transition-all duration-200 ease-in-out md:hidden">
          <div className="space-y-1 px-4 py-6">
            <Link
              href="/"
              className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/lawyers"
              className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Find Lawyers
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="mt-4 border-t border-border pt-4">
              {!isAuthenticated ? (
                <div className="grid gap-2">
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-3">
                    <Avatar className="h-10 w-10 border border-border shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                        {user ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
