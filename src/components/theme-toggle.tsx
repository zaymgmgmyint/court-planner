"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground/80 hover:text-foreground backdrop-blur-sm transition-all border border-border sm:p-2"
                aria-label="Toggle theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                    <div className="py-1">
                        <button
                            onClick={() => { setTheme("light"); setIsOpen(false) }}
                            className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-muted'}`}
                        >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                        </button>
                        <button
                            onClick={() => { setTheme("dark"); setIsOpen(false) }}
                            className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-muted'}`}
                        >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                        </button>
                        <button
                            onClick={() => { setTheme("system"); setIsOpen(false) }}
                            className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'system' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-muted'}`}
                        >
                            <Laptop className="mr-2 h-4 w-4" />
                            System
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
