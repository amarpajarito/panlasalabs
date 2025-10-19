import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const socialIconClass =
    "w-5 h-5 sm:w-6 sm:h-6 text-[#6D2323] hover:text-[#4A1818] transition-colors";
  const headingClass = "font-semibold text-sm sm:text-base mb-3 sm:mb-4";
  const linkClass =
    "text-[#454545] hover:text-[#4A1818] text-xs sm:text-sm transition-colors";

  const socialLinks = [
    { href: "https://facebook.com", icon: FaFacebook, label: "Facebook" },
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
  ];

  const footerSections = [
    {
      title: "Home",
      links: [
        { href: "/about", text: "About" },
        { href: "/feedback", text: "Feedback & Reviews" },
      ],
    },
    {
      title: "Recipe",
      links: [
        { href: "/ingredients", text: "Ingredients" },
        { href: "/suggestions", text: "Suggestions" },
      ],
    },
    {
      title: "Dashboard",
      links: [
        { href: "/popular-recipes", text: "Popular Recipes" },
        { href: "/suggestions", text: "Suggestions" },
      ],
    },
  ];

  return (
    <footer className="bg-[#FEF9E1] w-full py-6 sm:py-8 md:py-10">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-[88px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
          {/* Logo and Social Icons */}
          <div className="flex-shrink-0 flex flex-col justify-end">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="PanlasaLabs Logo"
                width={360}
                height={60}
                className="mb-4 h-auto w-[180px] sm:w-[200px] md:w-[250px] lg:w-[300px]"
              />
            </Link>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  aria-label={label}
                >
                  <Icon className={socialIconClass} />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-[120px]">
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h3 className={headingClass}>{title}</h3>
                <ul className="flex flex-col gap-2 sm:gap-3">
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
    </footer>
  );
}
