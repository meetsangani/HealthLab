import React from 'react';
import { Shield, Award, Users, Clock, Heart, Microscope } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'NABL Accredited',
      description: 'Our laboratory is accredited by NABL, ensuring the highest standards of quality and accuracy.',
    },
    {
      icon: Award,
      title: '15+ Years Experience',
      description: 'Over a decade of excellence in diagnostic services with thousands of satisfied patients.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Qualified pathologists, microbiologists, and technicians with extensive experience.',
    },
    {
      icon: Clock,
      title: 'Quick Results',
      description: 'Most test results available within 24-48 hours with emergency services available.',
    },
    {
      icon: Heart,
      title: 'Patient Care',
      description: 'Compassionate care with a focus on patient comfort and convenience.',
    },
    {
      icon: Microscope,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment and latest diagnostic technologies for accurate results.',
    },
  ];

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Pathologist',
      qualification: 'MD Pathology, 20+ years experience',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Senior Microbiologist',
      qualification: 'PhD Microbiology, 15+ years experience',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Clinical Biochemist',
      qualification: 'MD Biochemistry, 12+ years experience',
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About HealthLab
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in healthcare diagnostics since 2009. We are committed to providing 
              accurate, reliable, and timely diagnostic services to help you make informed health decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                To provide world-class diagnostic services that are accessible, affordable, and accurate. 
                We strive to be the most trusted name in pathology services by maintaining the highest 
                standards of quality and patient care.
              </p>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600">
                To revolutionize healthcare diagnostics through innovation, technology, and compassionate 
                care, making quality healthcare accessible to everyone in our community and beyond.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg"
                alt="Laboratory"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of qualified professionals brings decades of combined experience 
              in pathology and laboratory medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Tests Conducted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24hrs</div>
              <div className="text-blue-100">Average Turnaround</div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accreditations & Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain the highest standards of quality and are recognized by leading healthcare organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">NABL Accredited</h3>
              <p className="text-gray-600">
                Accredited by National Accreditation Board for Testing and Calibration Laboratories
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ISO 15189 Certified</h3>
              <p className="text-gray-600">
                International standard for quality and competence in medical laboratories
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CAP Approved</h3>
              <p className="text-gray-600">
                College of American Pathologists laboratory accreditation program
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}