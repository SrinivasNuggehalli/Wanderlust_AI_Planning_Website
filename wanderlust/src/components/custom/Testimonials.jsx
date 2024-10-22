import React from 'react';
import { UserCircle2 } from 'lucide-react'; 

const testimonials = [
  {
    name: 'Sarvesh S.',
    review: 'Wanderlust AI helped me discover hidden gems. It was an incredible experience!',
  },
  {
    name: 'Alice A.',
    review: 'I love how easy it is to plan my trips. The itineraries are spot on!',
  },
  {
    name: 'Hemu C.',
    review: 'Thanks to Wanderlust AI, I had the best vacation ever. I’ll definitely use it again!',
  },
];


function Testimonials() {
  return (
    <div className="bg-white py-6 px-4 lg:px-12 rounded-lg mt-12">
      <h2 className="text-2xl font-bold text-center text-violet-600 mb-4">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <UserCircle2 className="w-12 h-12 text-violet-500" />  {/* Using a user icon here */}
            <p className="text-sm italic text-center">"{testimonial.review}"</p>
            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Testimonials;


