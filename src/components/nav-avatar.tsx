import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { User } from "next-auth";
interface NavAvatarProps {
  user: User | undefined;
  onClick?: () => void;
}
export const NavAvatar = ({ user }: NavAvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-md p-1">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-sm text-zinc-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button
            variant={"outline"}
            className="hover:bg-slate-50"
            onClick={() => signOut()}
          >
            signOut
            <LogOutIcon />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
