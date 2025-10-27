"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Car } from "lucide-react"
import { Button } from "../button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-900" />
            <span className="text-xl font-bold text-blue-900">AutoMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-900 font-medium">
              Home
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 bg-transparent">
                Login / Register
              </Button>
            </Link>
            <Link to="/sell">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Sell Your Vehicle</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
              <Link
                to="/sell"
                className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell Your Vehicle
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
