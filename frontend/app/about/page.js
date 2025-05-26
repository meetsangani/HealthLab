import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
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

      {/* Rest of the component */}
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

      {/* Our Team, Values, Accreditations, and CTA sections follow the same pattern */}
      {/* These sections are omitted for brevity but would include the same content as in the original component */}
    </div>
  );
}
