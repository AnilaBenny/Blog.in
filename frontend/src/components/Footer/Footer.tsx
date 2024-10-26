import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">
              We are dedicated to providing insightful blogs,
              helping you read, grow, and cherish knowledge.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/technology" className="text-gray-400 hover:text-white">Technology</Link></li>
              <li><Link to="/category/science" className="text-gray-400 hover:text-white">Science</Link></li>
              <li><Link to="/category/literature" className="text-gray-400 hover:text-white">Literature</Link></li>
              <li><Link to="/category/lifestyle" className="text-gray-400 hover:text-white">Lifestyle</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com/youraccount" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Twitter</a></li>
              <li><a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Facebook</a></li>
              <li><a href="https://instagram.com/youraccount" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Instagram</a></li>
              <li><a href="mailto:contact@yourwebsite.com" className="text-gray-400 hover:text-white">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">© 2024 Your Website Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;