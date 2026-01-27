import { Menu, Search, Bell, User } from "lucide-react";

type TopBarProps = {
  title?: string;
  onMenuClick?: () => void;
  userName?: string;
  notificationCount?: number;
};

function TopBar({
  title,
  onMenuClick,
  userName = "Admin",
  notificationCount = 0,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-6 md:px-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <h1 className="font-display text-xl font-semibold">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 mr-2 md:mr-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm
                       outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-md p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />

          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
        {/* User Icon */}
           <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted">
              <User className="h-5 w-5" />
           </button>

         {/* User Name */}
           <span className="hidden text-sm font-medium text-foreground md:block">
            {userName}
           </span>
        </div>

        
     
      </div>
    </header>
  );
}

export default TopBar;
