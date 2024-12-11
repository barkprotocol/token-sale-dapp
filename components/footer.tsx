'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-100">Connect With Us</h3>
          <div className="flex space-x-8">
            <a href="https://t.me/bark-protocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="sr-only">Telegram</span>
            </a>
            <a href="https://medium.com/@barkprotocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              <span className="sr-only">Medium</span>
            </a>
            <a href="https://x.com/bark_protocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
              <span className="sr-only">X (Twitter)</span>
            </a>
          </div>
          <nav className="flex flex-wrap justify-center space-x-6">
            <Link href="/terms-of-sale" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
              Terms of Sale
            </Link>
            <Link href="/privacy-policy" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
          </nav>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BARK Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

