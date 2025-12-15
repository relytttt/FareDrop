import Link from 'next/link';
import { Plane, Mail, Github, Twitter } from 'lucide-react';
import EmailCapture from './EmailCapture';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <Plane className="text-primary-400" size={32} />
              <span>FareDrop</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Discover the best flight deals worldwide. We search thousands of flights daily to bring you unbeatable prices.
            </p>
            <EmailCapture variant="footer" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-primary-400 transition-colors">
                  All Deals
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Set Alerts
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@faredrop.com" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <Mail size={16} />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} FareDrop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
