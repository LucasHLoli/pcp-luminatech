import Nav from "@/components/Nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 overflow-x-auto pt-14 md:pt-0 print:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
