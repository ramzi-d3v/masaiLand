import { LayoutGridIcon, ListChecksIcon, ReceiptTextIcon, MessageSquareTextIcon, StoreIcon, UsersIcon, HelpCircleIcon } from "lucide-react";

/* The lodge's own admin routes, in place of the block's demo helpdesk nav.
   Anything without a page behind it yet is left out rather than pointed at a
   dead "#" link. */
export const navGroups = [
	{
		items: [
			{
				title: "Dashboard",
				path: "/admin",
				icon: (
					<LayoutGridIcon />
				),
				isActive: true,
			},
		],
	},
	{
		label: "Inbox",
		items: [
			{
				title: "Enquiries",
				path: "/admin/enquiries",
				icon: (
					<MessageSquareTextIcon />
				),
			},
			{
				title: "Bookings",
				path: "/admin/orders",
				icon: (
					<ReceiptTextIcon />
				),
			},
		],
	},
	{
		label: "The property",
		items: [
			{
				title: "Rooms & halls",
				path: "/admin/rooms",
				icon: (
					<ListChecksIcon />
				),
			},
			{
				title: "The shop",
				path: "/book",
				icon: (
					<StoreIcon />
				),
			},
			{
				title: "Back to the site",
				path: "/",
				icon: (
					<UsersIcon />
				),
			},
		],
	},
];

export const footerNavLinks = [
	{
		title: "Contact page",
		path: "/contact",
		icon: (
			<HelpCircleIcon />
		),
	},
];

export const navLinks = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item])),
	...footerNavLinks,
];
