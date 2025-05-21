import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  lable?: string;
  image: string | null;
}

const UserAvatar = ({ name, lable, image }: UserAvatarProps) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-1">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={image ?? ""} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm text-zinc-500 capitalize">{lable}</p>
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;
