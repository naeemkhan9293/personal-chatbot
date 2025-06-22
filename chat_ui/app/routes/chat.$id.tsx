import { useParams } from "@remix-run/react";

export default function ChatIdPage() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Chat Page</h1>
      <p>This is a dynamic chat page for chat ID: <span className="font-mono text-blue-600">{id}</span></p>
      <p className="mt-4">You can use this page to display chat details for the given ID.</p>
    </div>
  );
}
