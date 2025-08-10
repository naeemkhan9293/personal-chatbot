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
];

export default function ChatOptions() {
  return (
    <div className="flex items-center justify-center flex-wrap h-full gap-4 p-6">
      {data.map((item, index) => (
        <Link
          href={`/dashboard/chat/new?com=${item.param}`}
          passHref
          key={index}
        >
          <Card className="glass-intense p-6 text-foreground gap-3 hover:scale-105 transition-all duration-300 cursor-pointer group border-0 glass-shimmer">
            <div className="flex flex-col items-center text-center space-y-3 w-48 md:w-xs ">
              <div className="glass-card p-3 rounded-full glass-float">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
