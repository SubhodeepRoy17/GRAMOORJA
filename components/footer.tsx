export function Footer() {
  return (
    <footer className="w-full bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-xs">GO</span>
              </div>
              <span className="font-serif font-bold">GramoOrja</span>
            </div>
            <p className="text-sm text-background/70">Traditional sweets, modern technology.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>&copy; 2025 GramoOrja. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-background transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
