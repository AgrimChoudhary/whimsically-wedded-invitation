
import React from 'react';
import WelcomeForm from '@/components/WelcomeForm';

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Demo Preview</h1>
          <p className="text-gray-600">Experience our wedding invitation template</p>
        </div>
        <WelcomeForm />
      </div>
    </div>
  );
};

export default Demo;
