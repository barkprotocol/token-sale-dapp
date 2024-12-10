'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <div className="mt-12"> {/* Add margin-top here for extra space above the footer */}
      <footer className="bg-gray-900 text-white shadow-lg mt-auto py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">Connect With Us</h3>
            <div className="flex space-x-6">
              <a href="https://t.me/bark-protocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.745-3.734 15.714-3.734 15.714s-.237.588-.88.306c-.462-.203-2.071-1.533-2.803-2.239-.539-.523-.028-.809.378-1.28.115-.134 2.115-1.98 4.283-4.063.296-.286.152-.536-.176-.355-1.917 1.058-5.058 2.791-5.758 3.177-.601.331-1.108.352-1.589.091-.737-.402-1.452-.788-1.816-.985-.835-.453-.861-.932-.043-1.411l11.638-6.955c.532-.321 1.02-.12.84.625z"/>
                </svg>
                <span className="sr-only">Telegram</span>
              </a>
              <a href="https://medium.com/@barkprotocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 0 0 .233.707l1.694 2.054v.271H3.815v-.27L5.51 15.86a.82.82 0 0 0 .218-.707V8.027a.624.624 0 0 0-.203-.527L4.019 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456v.271z"/>
                </svg>
                <span className="sr-only">Medium</span>
              </a>
              <a href="https://x.com/bark_protocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e1d8c7] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="sr-only">X</span>
              </a>
            </div>
            <nav className="space-x-6 mt-4">
              <Link href="/terms-of-sale" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">Terms of Sale</Link>
              <Link href="/privacy-policy" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            </nav>
            <p className="text-sm text-gray-500 mt-4">© {new Date().getFullYear()} BARK Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
