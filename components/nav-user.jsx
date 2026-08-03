"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/adminAuth";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoreIcon, LogOutIcon } from "lucide-react";

/* No user accounts behind this — one shared passcode, see lib/adminAuth.js.
   This is what shows in the corner while that session lasts. */
const user = {
	name: "Front desk",
	email: "info@masailandsafari.com",
};

export function NavUser() {
	const router = useRouter();

	function logOut() {
		signOut();
		router.replace("/admin/login");
	}

	return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
				<Avatar className="size-8">
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
				<DropdownMenuItem className="flex items-center justify-start gap-2">
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{user.name}</span>{" "}
							<br />
							<div
                                className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{user.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<a href="/">
							<StoreIcon />
							Back to the site
						</a>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="w-full cursor-pointer" onSelect={logOut} variant="destructive">
						<LogOutIcon />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
        </DropdownMenu>
    );
}
