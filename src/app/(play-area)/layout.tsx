export default function PlayAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen w-full bg-dark-mauve">
      {children}
    </div>
  );
}
