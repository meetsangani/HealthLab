import React from 'react';
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Dr. Anand Sharma",
      role: "Chief Medical Officer",
      image: "/team/doctor1.jpg",
      bio: "Dr. Sharma brings over 15 years of experience in laboratory medicine and diagnostics, specializing in molecular pathology."
    },
    {
      name: "Dr. Priya Mehta",
      role: "Laboratory Director",
      image: "/team/doctor2.jpg",
      bio: "With a PhD in Clinical Biochemistry, Dr. Mehta oversees all laboratory operations and quality control protocols."
    },
    {
      name: "Rajiv Verma",
      role: "Operations Manager",
      image: "/team/manager1.jpg",
      bio: "Rajiv has transformed our operational efficiency, ensuring timely sample processing and report delivery."
    },
    {
      name: "Sunita Patel",
      role: "Patient Services Head",
      image: "/team/manager2.jpg",
      bio: "Dedicated to creating a seamless experience for patients from appointment to report delivery."
    }
  ];

  const values = [
    {
      title: "Accuracy",
      description: "We maintain the highest standards of precision in our testing procedures and reporting."
    },
    {
      title: "Timeliness",
      description: "We understand the importance of quick results and strive to deliver reports promptly."
    },
    {
      title: "Compassion",
      description: "We treat every patient with dignity, respect, and understanding during their healthcare journey."
    },
    {
      title: "Innovation",
      description: "We continuously adopt the latest technologies and methodologies in diagnostic medicine."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About HealthLab</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Delivering excellence in diagnostic services since 2005. We're committed to improving healthcare through accurate and accessible testing.
        </p>
      </div>

      {/* Vision and Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
          <p className="text-gray-700">
            To be the most trusted diagnostic partner for patients and healthcare providers, setting new standards in accuracy, accessibility, and patient experience.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-gray-700">
            To provide high-quality, affordable diagnostic services that empower individuals to make informed health decisions and enable healthcare providers to deliver optimal care.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="bg-gray-50 p-8 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 mb-4">
              Founded in 2005 by a team of pathologists and healthcare administrators, HealthLab began as a small laboratory with a vision to make diagnostic testing more accessible and convenient for patients.
            </p>
            <p className="text-gray-700 mb-4">
              Over the years, we've grown from a single facility to a network of diagnostic centers across the region, all while maintaining our commitment to quality and patient care. We've continuously invested in the latest technologies and trained our staff to stay at the forefront of diagnostic medicine.
            </p>
            <p className="text-gray-700">
              Today, HealthLab serves thousands of patients monthly and partners with hundreds of healthcare providers. We've expanded our services to include home collection, digital reports, and specialized testing, making healthcare more accessible than ever before.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]">
              <div className="h-64 bg-gray-200">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x400?text=Team+Member";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className="flex p-6 bg-white rounded-xl shadow-md">
              <div className="mr-4 mt-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditations */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Accreditations</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center p-4">
              <img 
                src="/accreditations/nabl.png" 
                alt="NABL Accreditation"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=NABL";
                }}
                className="max-w-full max-h-full"
              />
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center p-4">
              <img 
                src="/accreditations/iso.png" 
                alt="ISO Certification"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=ISO";
                }}
                className="max-w-full max-h-full"
              />
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center p-4">
              <img 
                src="/accreditations/cap.png" 
                alt="CAP Accreditation"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=CAP";
                }}
                className="max-w-full max-h-full"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600">
            Our laboratory facilities are accredited by national and international bodies, ensuring that we meet the highest standards of quality and reliability in all our diagnostic services.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary rounded-xl text-white p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Experience the HealthLab Difference</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Book a test today and see why thousands of patients and healthcare providers trust us with their diagnostic needs.
        </p>
        <button className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors btn-enhanced btn-shine">
          Book a Test
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
