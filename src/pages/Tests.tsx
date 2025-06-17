import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, IndianRupee, FlaskConical, Heart, Droplets, Activity, Microscope, Shield } from 'lucide-react';
import { supabase, type Test, type TestCategory } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');

  useEffect(() => {
    fetchTestsAndCategories();
  }, []);

  const fetchTestsAndCategories = async () => {
    try {
      const [testsResponse, categoriesResponse] = await Promise.all([
        supabase.from('tests').select('*, category:categories(*)'),
        supabase.from('categories').select('*')
      ]);

      if (testsResponse.error) throw testsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setTests(testsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error: any) {
      toast.error('Error loading tests');
      console.error('Error:', error);
      // Set mock data for demonstration
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockCategories: TestCategory[] = [
      { id: '1', name: 'Blood Tests', description: 'Comprehensive blood analysis', icon: 'Droplets', created_at: '' },
      { id: '2', name: 'Urine Tests', description: 'Urinalysis and related tests', icon: 'FlaskConical', created_at: '' },
      { id: '3', name: 'Cardiac Tests', description: 'Heart health monitoring', icon: 'Heart', created_at: '' },
      { id: '4', name: 'Hormonal Tests', description: 'Hormone level analysis', icon: 'Activity', created_at: '' },
      { id: '5', name: 'Full Body Checkup', description: 'Comprehensive health screening', icon: 'Shield', created_at: '' },
      { id: '6', name: 'COVID-19 Tests', description: 'COVID-19 screening tests', icon: 'Microscope', created_at: '' },
    ];

    const mockTests: Test[] = [
      {
        id: '1',
        name: 'Complete Blood Count (CBC)',
        description: 'Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels',
        price: 300,
        category_id: '1',
        category: mockCategories[0],
        turnaround_time: '24 hours',
        preparation_instructions: 'No special preparation required',
        created_at: '',
      },
      {
        id: '2',
        name: 'Lipid Profile',
        description: 'Cholesterol and triglyceride levels to assess cardiovascular risk',
        price: 450,
        category_id: '1',
        category: mockCategories[0],
        turnaround_time: '24 hours',
        preparation_instructions: '12 hours fasting required',
        created_at: '',
      },
      {
        id: '3',
        name: 'Thyroid Function Test (TSH, T3, T4)',
        description: 'Complete thyroid hormone analysis',
        price: 600,
        category_id: '4',
        category: mockCategories[3],
        turnaround_time: '48 hours',
        preparation_instructions: 'No special preparation required',
        created_at: '',
      },
      {
        id: '4',
        name: 'HbA1c (Diabetes Test)',
        description: 'Average blood sugar levels over the past 2-3 months',
        price: 350,
        category_id: '1',
        category: mockCategories[0],
        turnaround_time: '24 hours',
        preparation_instructions: 'No fasting required',
        created_at: '',
      },
      {
        id: '5',
        name: 'Urine Routine & Microscopy',
        description: 'Complete urine analysis for infections and kidney function',
        price: 200,
        category_id: '2',
        category: mockCategories[1],
        turnaround_time: '24 hours',
        preparation_instructions: 'First morning sample preferred',
        created_at: '',
      },
      {
        id: '6',
        name: 'RT-PCR COVID-19 Test',
        description: 'Real-time PCR test for COVID-19 detection',
        price: 800,
        category_id: '6',
        category: mockCategories[5],
        turnaround_time: '24 hours',
        preparation_instructions: 'No eating/drinking 30 minutes before test',
        created_at: '',
      },
      {
        id: '7',
        name: 'Full Body Checkup Premium',
        description: 'Comprehensive health screening with 50+ parameters',
        price: 2500,
        category_id: '5',
        category: mockCategories[4],
        turnaround_time: '48 hours',
        preparation_instructions: '12 hours fasting required',
        created_at: '',
      },
      {
        id: '8',
        name: 'Cardiac Risk Assessment',
        description: 'Complete cardiac panel including ECG, stress test, and biomarkers',
        price: 1200,
        category_id: '3',
        category: mockCategories[2],
        turnaround_time: '48 hours',
        preparation_instructions: 'No caffeine 4 hours before test',
        created_at: '',
      },
    ];

    setCategories(mockCategories);
    setTests(mockTests);
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Droplets,
      FlaskConical,
      Heart,
      Activity,
      Shield,
      Microscope,
    };
    return icons[iconName as keyof typeof icons] || FlaskConical;
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || test.category_id === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange) {
      const price = test.price;
      switch (priceRange) {
        case 'under-500':
          matchesPrice = price < 500;
          break;
        case '500-1000':
          matchesPrice = price >= 500 && price <= 1000;
          break;
        case '1000-2000':
          matchesPrice = price >= 1000 && price <= 2000;
          break;
        case 'over-2000':
          matchesPrice = price > 2000;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Tests</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of medical tests and diagnostics. 
            Book online and get accurate results delivered to your dashboard.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <IconComponent className={`h-8 w-8 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div className={`text-sm font-medium ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="under-500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1,000</option>
              <option value="1000-2000">₹1,000 - ₹2,000</option>
              <option value="over-2000">Over ₹2,000</option>
            </select>
          </div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{test.turnaround_time}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 mb-4">
                    <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium">
                      {test.category?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-2xl font-bold text-gray-900">
                  <IndianRupee className="h-5 w-5" />
                  <span>{test.price}</span>
                </div>
                <Link
                  to={`/book-test?testId=${test.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tests found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}