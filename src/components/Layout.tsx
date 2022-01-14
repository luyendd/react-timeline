import dynamic from 'next/dynamic';
import { FunctionComponent } from 'react';
const Header = dynamic(() => import('./Header'), { ssr: false });

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen pt-4 px-8'>
      <Header />
      <main className='main-container'>{children}</main>
    </div>
  );
};

export default Layout;
