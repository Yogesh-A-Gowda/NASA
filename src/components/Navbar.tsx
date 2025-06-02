// src/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-blue-400 hover:text-blue-300 transition duration-300 mb-4 md:mb-0">
          NASA Data Hub
        </Link>
        <ul className="flex flex-wrap justify-center space-x-4 md:space-x-6">
          <li><Link href="/" className="hover:text-gray-300 text-lg font-medium">Dashboard</Link></li>
          <li><Link href="/exoplanets" className="hover:text-gray-300 text-lg font-medium">Exoplanets</Link></li>
          <li><Link href="/mars-rover" className="hover:text-gray-300 text-lg font-medium">Mars Rover</Link></li>
          <li><Link href="/launch-tracker" className="hover:text-gray-300 text-lg font-medium">Launches & ISS</Link></li>
          <li><Link href="/space-weather" className="hover:text-gray-300 text-lg font-medium">Space Weather</Link></li>
          <li><Link href="/earth-from-space" className="hover:text-gray-300 text-lg font-medium">Earth From Space</Link></li>
          <li><Link href="/nasa-media" className="hover:text-gray-300 text-lg font-medium">NASA Media</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;