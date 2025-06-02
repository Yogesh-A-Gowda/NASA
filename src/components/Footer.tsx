// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} NASA Data Hub. All data sourced from official NASA APIs.</p>
      </div>
    </footer>
  );
};

export default Footer;