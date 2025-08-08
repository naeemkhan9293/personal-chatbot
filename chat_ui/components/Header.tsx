import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="bg-gray-800 py-4 px-6 flex items-center  border-b border-gray-700 text-white fixed w-full z-50">
      <SidebarTrigger />
    </header>
  );
}
