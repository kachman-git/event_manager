import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Event Management</h1>
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
        <Link href="/signin" passHref>
          <Button variant="default" className="w-full sm:w-auto">
            Sign In
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button variant="outline" className="w-full sm:w-auto">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
