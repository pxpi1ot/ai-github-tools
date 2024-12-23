import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
  isActive: boolean;
}

export const ProjectAvatar = ({
  name,
  className,
  isActive,
  fallbackClassName,
}: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("size-6 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "rounded-md border bg-white text-sm font-semibold uppercase text-primary",
          { "border-none bg-primary text-white": isActive },
          fallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
