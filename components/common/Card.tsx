
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'indigo' | 'red';
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        <span className="w-8 h-8 block">{icon}</span>
      </div>
      <div className="mx-4">
        <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Card;
