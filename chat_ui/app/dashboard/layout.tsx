"use client"
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative ">
      <Header />
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
}
