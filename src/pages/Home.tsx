import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star, ArrowRight, FlaskConical, Users, Award, Phone } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Accurate Results',
      description: 'State-of-the-art equipment ensures precise and reliable test results',
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Most test results available within 24-48 hours',
    },
    {
      icon: FlaskConical,
      title: 'Wide Range of Tests',
      description: 'Comprehensive catalog of blood, urine, and specialized tests',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Qualified pathologists and technicians with years of experience',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'General Physician',
      content: 'HealthLab provides consistently accurate results with excellent turnaround times. I trust them with all my patient referrals.',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      role: 'Patient',
      content: 'The online booking system is so convenient, and the staff is very professional. Got my reports on time as promised.',
      rating: 5,
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Cardiologist',
      content: 'Their cardiac panel tests are comprehensive and help me make better treatment decisions for my patients.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Tests Conducted' },
    { number: '15+', label: 'Years of Experience' },
    { number: '95%', label: 'Customer Satisfaction' },
    { number: '24hrs', label: 'Average Turnaround' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Health, Our
                <span className="text-blue-600"> Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get accurate diagnostic results with our state-of-the-art pathology lab. 
                Book tests online, track reports, and take control of your health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/tests"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Browse Tests
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="lg:flex lg:justify-center">
              <img
                src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg"
                alt="Medical professionals"
                className="rounded-lg shadow-xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthLab?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with expert medical professionals to deliver 
              the most accurate and reliable diagnostic services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by doctors and patients across the region
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the convenience of online booking with fast, accurate results 
            delivered directly to your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tests"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book a Test
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}