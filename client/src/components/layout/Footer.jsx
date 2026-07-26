import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',          to: '/'           },
  { label: 'Collections',   to: '/collection' },
  { label: 'Colours',       to: '/colours'    },
  { label: 'Blogs',         to: '/blogs'      },
  { label: 'Bespoke Design',to: '/about'      },
  { label: 'Maintenance',   to: '/about'      },
];

const LEGAL_LINKS = [
  { label: 'Sustainability', to: '/about'   },
  { label: 'Contact Us',     to: '/contact' },
  { label: 'Privacy Policy', to: '/'        },
];

export default function Footer() {
  return (
    <footer className="w-full pt-[160px] pb-10 bg-surface-container-lowest border-t border-outline-variant font-body-md text-body-md transition-all duration-[400ms]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px]">

        {/* ── 4-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[32px] mb-16">

          {/* Brand Column — col-span-2 */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="font-[500] text-[32px] leading-[1.3] text-primary flex items-center gap-2 mb-6 hover:opacity-75 transition-opacity duration-[400ms]"
              style={{ fontFamily: 'Inter' }}
            >
              <Diamond size={28} strokeWidth={1.5} />
              MarbleCraft
            </Link>
            <p className="text-on-surface-variant max-w-sm">
              Elevating modern architecture through the timeless permanence and unmatched beauty of globally sourced natural stone.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4
              className="font-body-lg text-body-lg text-primary font-semibold mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              Navigation
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all duration-[400ms] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="font-body-lg text-body-lg text-primary font-semibold mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              Legal
            </h4>
            <ul className="space-y-4">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all duration-[400ms] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant">© 2024 MarbleCraft. Excellence in Stone Heritage.</p>
          <div className="flex gap-4">
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
