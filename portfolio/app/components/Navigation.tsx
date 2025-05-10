"use client";

import Link from 'next/link'
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          Portfolio
        </Link>
        
        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link href="/" className="navbar-link">
            Home
          </Link>
          <Link href="/about" className="navbar-link">
            About
          </Link>
          <Link href="/projects" className="navbar-link">
            Projects
          </Link>
          <Link href="/contact" className="navbar-link">
            Contact
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-button"
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            <Link 
              href="/" 
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/projects" 
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/contact" 
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
