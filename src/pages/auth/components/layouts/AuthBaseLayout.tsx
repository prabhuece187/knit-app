interface AuthBaseLayoutProps {
  children: React.ReactNode;
}

export default function AuthBaseLayout({ children }: AuthBaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
