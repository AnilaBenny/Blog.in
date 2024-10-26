import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import { ChevronRight } from 'lucide-react';

const RecommendedBlogs = () => {
  const navigate = useNavigate();
  const user = useSelector((state:any) => state.user.user);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState(4);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.post('/allblogs', { userId: user._id });
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching  blogs:', error);
      }
    };
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const loadMoreBlogs = () => {
    setVisibleBlogs((prev) => prev + 4);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Recommended For You
        </h2>
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogs.slice(0, visibleBlogs).map((blog:any) => (
                <div
                  key={blog._id}
                  onClick={() => navigate('/blog', { state: blog })}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: blog.image
                        ? `url(http://localhost:8080/uploads/${blog.image})`
                        : `url('/default-image.jpg')`
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      By {blog.author.firstName} {blog.author.lastName}
                    </p>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {blog.description.split('. ').slice(0, 3).join('. ')}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/blog', { state: blog });
                      }}
                      className="text-indigo-600 font-medium text-sm flex items-center hover:text-indigo-800 transition-colors duration-200"
                    >
                      Read more
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {visibleBlogs < blogs.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMoreBlogs}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Load More Blogs
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-xl text-gray-600 text-center">
            No recommended blogs available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedBlogs;