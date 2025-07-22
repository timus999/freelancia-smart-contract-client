
import { Link } from 'react-router-dom';
import {  Wallet } from 'lucide-react';


const NavMin = () => {


  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text-primary">Freelancia</span>
          </Link>

    
          </div>
      </div>
    </nav>
  );
};

export default NavMin;