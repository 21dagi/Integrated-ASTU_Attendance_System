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
import UserAvatar from "./UserAvatar";
interface NavAvatarProps {
  user: User | undefined;
  onClick?: () => void;
}
export const NavAvatar = ({ user }: NavAvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserAvatar
          lable={user?.role ?? ""}
          image={user?.image ?? ""}
          name={user?.name ?? ""}
        />
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
