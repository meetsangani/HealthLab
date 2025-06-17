import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">HealthLab</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in healthcare diagnostics. We provide accurate and reliable test results with quick turnaround times.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Mon-Sat: 6:00 AM - 10:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-gray-400 hover:text-white transition-colors">
                  Tests
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Blood Tests</span>
              </li>
              <li>
                <span className="text-gray-400">Urine Tests</span>
              </li>
              <li>
                <span className="text-gray-400">Full Body Checkup</span>
              </li>
              <li>
                <span className="text-gray-400">Hormonal Tests</span>
              </li>
              <li>
                <span className="text-gray-400">COVID-19 Testing</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">info@healthlab.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                <span className="text-gray-400">
                  123 Medical Street,<br />
                  Healthcare District,<br />
                  Mumbai - 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 HealthLab. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}