import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOutIcon, UserIcon } from "lucide-react";
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
          profile
          <UserIcon />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth" })}>
          signOut
          <LogOutIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
