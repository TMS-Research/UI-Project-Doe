export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch">
      <div className="w-full flex items-center justify-center">{children}</div>
      <div className="w-full bg-primary">
        <p className="text-sm text-gray-500">Cek</p>
      </div>
    </div>
  );
}
