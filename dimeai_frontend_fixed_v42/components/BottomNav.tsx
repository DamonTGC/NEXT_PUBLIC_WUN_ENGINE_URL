'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/straight', label: 'STRAIGHTS' },
  { href: '/props', label: 'PROPS' },
  { href: '/parlays', label: 'PARLAYS' },
  { href: '/teasers', label: 'TEASERS' },
  { href: '/profile', label: 'PROFILE' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-pill${pathname === item.href ? ' active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
