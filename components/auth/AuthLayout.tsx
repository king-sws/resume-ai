import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string | ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 py-12 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <div className="mt-4 text-base text-gray-400">
            {subtitle}
          </div>
        </div>
        <div className="mt-10">
          {children}
        </div>
        <div className="mt-10 text-center text-sm text-gray-500">
          Protected by industry-standard encryption and security protocols
        </div>
      </div>
    </div>
  );
}