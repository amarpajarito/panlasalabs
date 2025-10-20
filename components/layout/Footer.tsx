import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const socialIconClass =
    "w-5 h-5 sm:w-6 sm:h-6 text-[#6D2323] hover:text-[#8B3030] hover:scale-110 transition-all duration-300";
  const headingClass =
    "font-bold text-[#6D2323] text-sm sm:text-base mb-3 sm:mb-4 uppercase tracking-wide";
  const linkClass =
    "text-[#454545] hover:text-[#6D2323] hover:font-semibold text-xs sm:text-sm transition-all duration-200";

  const socialLinks = [
    { href: "https://facebook.com", icon: FaFacebook, label: "Facebook" },
    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
    { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
  ];

  const footerSections = [
    {
      title: "Home",
      links: [
        { href: "/#featured-recipes", text: "Featured Recipes" },
        { href: "/#how-it-works", text: "How It Works" },
        { href: "/#ai-technology", text: "AI Technology" },
        { href: "/#testimonials", text: "Testimonials" },
      ],
    },
    {
      title: "About",
      links: [
        { href: "/about#our-story", text: "Our Story" },
        { href: "/about#our-values", text: "Our Values" },
        { href: "/about#team", text: "Meet The Team" },
      ],
    },
    {
      title: "Recipe",
      links: [
        { href: "/recipe#browse", text: "Browse Recipes" },
        { href: "/recipe#cuisines", text: "Cuisines" },
        { href: "/recipe#ingredients", text: "By Ingredients" },
        { href: "/recipe#popular", text: "Popular Recipes" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: "/contact#get-in-touch", text: "Get In Touch" },
        { href: "/contact#faq", text: "FAQs" },
        { href: "/contact#support", text: "Support" },
      ],
    },
  ];

  return (
    <footer className="bg-[#FEF9E1] w-full border-t-2 border-[#6D2323]/10">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-[88px]">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Brand Column */}
            <div className="lg:col-span-3">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/logo.svg"
                  alt="PanlasaLabs Logo"
                  width={280}
                  height={60}
                  className="h-auto w-[200px] sm:w-[240px]"
                />
              </Link>
              <p className="text-[#454545] text-sm sm:text-base mb-6 leading-relaxed max-w-xs">
                Your AI-powered culinary companion. Discover personalized
                recipes that match your taste, ingredients, and creativity.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="bg-white p-3 rounded-xl hover:bg-[#6D2323] hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                {footerSections.map(({ title, links }) => (
                  <div key={title}>
                    <h3 className={headingClass}>{title}</h3>
                    <ul className="flex flex-col gap-3">
                      {links.map(({ href, text }) => (
                        <li key={href}>
                          <Link href={href} className={linkClass}>
                            {text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#6D2323]/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#454545] text-xs sm:text-sm">
            <p>
              © {new Date().getFullYear()} PanlasaLabs. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
