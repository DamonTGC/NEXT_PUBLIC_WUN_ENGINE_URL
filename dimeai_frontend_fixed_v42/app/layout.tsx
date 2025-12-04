import './globals.css';
import BottomNav from '../components/BottomNav';

export const metadata = {
  title: 'DimeAI – Powered by the WUN Engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="app-frame">
            <header className="app-header">
              <div className="app-brand">
                <div className="brand-coin" />
                <div>
                  <div className="brand-text-main">DIMEAI</div>
                  <div className="brand-sub">
                    Powered by the WUN Engine • Made to be Number 1
                  </div>
                </div>
              </div>
              <div className="app-user">
                <span className="tier">Freer tier • Email verified</span>
                <span>Log out</span>
              </div>
            </header>
            {children}
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
