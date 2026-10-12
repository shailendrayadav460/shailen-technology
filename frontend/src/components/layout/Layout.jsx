import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import StatusBanner from '../common/StatusBanner.jsx';
import AIChatWidget from '../ai/AIChatWidget.jsx';
import LeadPopup from '../common/LeadPopup.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <StatusBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChatWidget />
      <LeadPopup />
    </>
  );
}
