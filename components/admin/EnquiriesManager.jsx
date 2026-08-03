"use client";

import { useMemo, useState } from "react";
import {
  CheckIcon,
  MailIcon,
  MailOpenIcon,
  MailQuestionIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataExportMenu from "@/components/admin/DataExportMenu";
import DataTable from "@/components/admin/DataTable";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import { enquiries as seedEnquiries } from "@/lib/adminContent";
import { inRange } from "@/lib/dateRange";

/*
  Same shape as ListingsManager: stat cards, then DataTable doing the work the
  old page split across a scrolling list and a separate reading pane. A row
  click opens a Sheet with the full message instead of a second panel
  competing for the same width.

  Still no backend behind any of this — read/unread and delete are held in
  React state, seeded from lib/adminContent.js, and reset on reload exactly as
  the page did before this pass. The banner above says so.
*/

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso, withTime = false) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export default function EnquiriesManager() {
  const [items, setItems] = useState(seedEnquiries);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState(undefined);
  const [openId, setOpenId] = useState(null);

  const unread = items.filter((e) => !e.read).length;
  const read = items.length - unread;
  const responseRate = items.length ? Math.round((read / items.length) * 100) : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((e) => (tab === "unread" ? !e.read : tab === "read" ? e.read : true))
      .filter((e) => inRange(e.receivedAt, dateRange))
      .filter(
        (e) =>
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  }, [items, tab, query, dateRange]);

  const open = items.find((e) => e.id === openId) ?? null;

  function toggleRead(id) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, read: !e.read } : e)));
  }

  function remove(id) {
    setItems((prev) => prev.filter((e) => e.id !== id));
    setOpenId((prev) => (prev === id ? null : prev));
  }

  const columns = [
    {
      key: "from",
      header: "From",
      sortValue: (e) => e.name,
      cell: (e) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{initials(e.name)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0">
            <span className={`block truncate ${e.read ? "" : "font-medium"}`}>{e.name}</span>
            <span className="block truncate text-muted-foreground text-xs">{e.email}</span>
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      hideBelow: "md",
      cellClassName: "max-w-48 truncate text-muted-foreground text-sm",
      cell: (e) => e.subject,
    },
    {
      key: "received",
      header: "Received",
      sortValue: (e) => new Date(e.receivedAt).getTime(),
      hideBelow: "sm",
      cellClassName: "text-muted-foreground text-sm",
      cell: (e) => formatDate(e.receivedAt),
    },
    {
      key: "status",
      header: "Status",
      cell: (e) => <Badge variant={e.read ? "secondary" : "destructive"}>{e.read ? "Read" : "Unread"}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <Button
            aria-label={e.read ? `Mark ${e.name} unread` : `Mark ${e.name} read`}
            onClick={(ev) => {
              ev.stopPropagation();
              toggleRead(e.id);
            }}
            size="icon-xs"
            variant="ghost"
          >
            {e.read ? <MailIcon /> : <MailOpenIcon />}
          </Button>
          <Button
            aria-label={`Delete enquiry from ${e.name}`}
            onClick={(ev) => {
              ev.stopPropagation();
              remove(e.id);
            }}
            size="icon-xs"
            variant="ghost"
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  const exportFields = [
    { label: "Name", value: (e) => e.name },
    { label: "Email", value: (e) => e.email },
    { label: "Subject", value: (e) => e.subject },
    { label: "Received", value: (e) => e.receivedAt },
    { label: "Status", value: (e) => (e.read ? "Read" : "Unread") },
    { label: "Message", value: (e) => e.message },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total enquiries", value: items.length, icon: MailQuestionIcon },
          { label: "Unread", value: unread, icon: MailIcon },
          { label: "Answered", value: `${responseRate}%`, icon: CheckIcon },
        ].map((s) => (
          <Card className="shadow-none dark:ring-0" key={s.label}>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-xs">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <s.icon className="size-5 text-muted-foreground" />
              <p className="font-semibold text-2xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          description={`${filtered.length} shown`}
          empty={<p className="p-6 text-muted-foreground text-sm">No enquiries match.</p>}
          onRowClick={(e) => setOpenId(e.id)}
          rowKey={(e) => e.id}
          rows={filtered}
          title="All enquiries"
          toolbar={
            <>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-8 sm:w-56"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, subject"
                  value={query}
                />
              </div>
              <Tabs onValueChange={setTab} value={tab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread{unread ? ` (${unread})` : ""}</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>
              <DateRangeFilter onChange={setDateRange} range={dateRange} />
              <DataExportMenu fields={exportFields} filenameBase="enquiries" rows={filtered} />
            </>
          }
        />
      </div>

      <Sheet onOpenChange={(v) => !v && setOpenId(null)} open={!!open}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription asChild>
                  <a className="hover:underline" href={`mailto:${open.email}`}>
                    {open.email}
                  </a>
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4">
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Subject</p>
                    <p className="mt-0.5">{open.subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Received</p>
                    <p className="mt-0.5">{formatDate(open.receivedAt, true)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <Badge className="mt-0.5" variant={open.read ? "secondary" : "destructive"}>
                      {open.read ? "Read" : "Unread"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{open.message}</p>
              </div>

              <SheetFooter className="flex-row">
                <Button asChild className="flex-1">
                  <a href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}>
                    Reply by email
                  </a>
                </Button>
                <Button onClick={() => toggleRead(open.id)} variant="outline">
                  Mark {open.read ? "unread" : "read"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
