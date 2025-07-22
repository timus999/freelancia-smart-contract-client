export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Freelancia</h3>
              <p className="text-gray-400">Connecting clients with top freelancers worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded-md text-gray-800"
              />
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md">
                Subscribe
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            &copy; 2025 Freelancia. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }