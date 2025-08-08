import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="bg-gray-800 py-4 px-6 flex items-center  border-b border-gray-700 text-white">
      <SidebarTrigger />
      <h1 className="text-xl font-bold">Personal Assistant</h1>
    </header>
  );
}
