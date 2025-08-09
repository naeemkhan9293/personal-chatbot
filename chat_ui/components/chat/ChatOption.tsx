import { Card } from "../ui/card";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { LuImagePlus } from "react-icons/lu";
import { FaSignsPost } from "react-icons/fa6";
import Link from "next/link";

const data = [
  {
    title: "Scrape Website",
    description: "Scrape website data and extract information.",
    icon: FaScrewdriverWrench,
    param: "scrape_website",
  },
  {
    title: "Generate Image",
    description: "Generate Image from text.",
    icon: LuImagePlus,
    param: "generate_image",
  },
  {
    title: "Generate Poster Images",
    description: "Generate poster images from text.",
    icon: FaSignsPost,
    param: "generate_poster_images",
  },
];

export default function ChatOptions() {
  return (
    <div className="flex items-center justify-center flex-wrap h-full gap-2 p-2">
      {data.map((item, index) => (
        <Link href={`/dashboard/chat/new?${item.param}`} passHref>
          <Card
            key={index}
            className="bg-gray-700 rounded-lg p-4 text-white  gap-3"
          >
            <item.icon className="h-5 w-5" />
            <p className="text-sm">{item.title}</p>
            <p className="text-xs text-white">{item.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
