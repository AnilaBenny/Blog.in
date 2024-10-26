import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { Tag } from 'lucide-react';


export default () => {
  const location = useLocation();
  const blog = location.state;
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={blog?.image ? `http://localhost:8080/uploads/${blog.image}` : '/default-image.jpg'} 
            alt={blog?.name} 
            className="w-full h-64 object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-black text-center pt-7">{blog?.name}</h1>
        
        <div className="p-8">
      
          
          <div className="flex flex-wrap gap-2 mb-6">
            {blog?.tags.map((tag:any, index:any) => (
              <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                <Tag size={14} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">{blog?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};