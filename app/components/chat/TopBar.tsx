import { Button } from "~/components/ui/button";
import { Star, Trash2 } from 'lucide-react';
import { Link } from "@remix-run/react";

export function TopBar() {
  return (
    <div className="h-14 border-b flex items-center justify-between px-4 py-4 sticky top-0 bg-background">
      <Link to="/">
        <h1 className="text-lg font-semibold">Cetec Support Bot</h1>
      </Link>
      <div className="flex items-center space-x-2">
        {/* <Button variant="ghost" size="icon">
          <Star className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="w-4 h-4" />
        </Button> */}
      </div>
    </div>
  );
} 