import React from 'react';

interface HelloWorldProps {
  message?: string;
}

const HelloWorld: React.FC<HelloWorldProps> = ({ message = 'Hello, World!' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          {message}
        </h1>
        <p className="text-lg text-center text-gray-600">
          Welcome to my React + TypeScript + Tailwind CSS + Vite application!
        </p>
      </div>
    </div>
  );
};

export default HelloWorld;
