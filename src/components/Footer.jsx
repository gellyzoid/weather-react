function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Angel Victorio
        </p>
        <div className="mt-1">
          <a
            href="https://www.angelvictorio.com"
            target="_NEW"
            className="text-gray-400 hover:text-white mx-2 text-xs"
          >
            Visit my webpage
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
