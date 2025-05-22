import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | LogocraftAI',
  description: 'Learn about LogocraftAI\'s story, mission, and how we use AI technology to help entrepreneurs and businesses create professional brand identities.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Logos for Every Brand
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LogocraftAI is dedicated to using cutting-edge AI technology to make professional-level logo design simple, accessible, and affordable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <div className="prose prose-lg">
              <p>
                LogocraftAI began with a simple observation: entrepreneurs and small business owners often struggle to obtain high-quality logo designs without paying hefty design fees or mastering complex design software.
              </p>
              <p>
                In 2023, our founding team decided to leverage the latest AI generation models to create an intuitive platform where anyone could easily design professional logos. Our goal was to democratize the logo design process while maintaining creativity and personalization.
              </p>
              <p>
                Today, LogocraftAI has helped thousands of entrepreneurs and businesses create unique and professional brand identities, and our mission continues to expand.
              </p>
            </div>
          </div>
          <div className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-8">
            <Image
              src="/images/logocraftai-logo.svg"
              alt="LogocraftAI Logo"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly push the boundaries of AI design, transforming the latest technology into intuitive, powerful design tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We believe every business, regardless of size, should have access to high-quality brand design resources.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                We uphold the highest standards of design excellence, ensuring our users receive professional, modern, and unique logos.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Technology
          </h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="prose prose-lg max-w-none">
              <p>
                LogocraftAI combines multiple advanced technologies to create a seamless logo creation experience:
              </p>
              <ul>
                <li>
                  <strong>AI Generation Models</strong>: We use Replicate API's Flux Pro 1.1 model, an advanced image generation system specifically fine-tuned to create commercial logos.
                </li>
                <li>
                  <strong>Responsive Design Tools</strong>: Our logos remain crisp and sharp across various devices and media, from mobile apps to large billboards.
                </li>
                <li>
                  <strong>Real-time Editing</strong>: Users can instantly adjust colors, styles, and layouts, seeing changes in real-time.
                </li>
                <li>
                  <strong>Cloud Storage</strong>: All designs are securely stored, allowing users to return and edit or download them at any time.
                </li>
              </ul>
              <p>
                Our development team continuously improves and optimizes these technologies, ensuring LogocraftAI always provides the most advanced logo design experience in the industry.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Ready to Create Your Logo?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of entrepreneurs and brand managers using LogocraftAI to create professional logo designs.
          </p>
          <a 
            href="/create" 
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Designing Now
          </a>
        </div>
      </div>
    </main>
  );
} 