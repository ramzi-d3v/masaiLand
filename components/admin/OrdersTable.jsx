"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptTextIcon, TrashIcon } from "lucide-react";
import DataExportMenu from "@/components/admin/DataExportMenu";
import DataTable from "@/components/admin/DataTable";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import { clearOrders, ORDER_STATUS, readOrders } from "@/lib/orders";
import { currency } from "@/lib/catalogue";
import { inRange } from "@/lib/dateRange";

/*
  Bookings taken through the demo checkout. Read from localStorage on mount
  rather than during render, so the server-rendered markup and the first client
  render agree before the real list arrives.
*/

function StatusBadge({ status }) {
  const meta = ORDER_STATUS[status] ?? ORDER_STATUS.pending;
  const variant =
    meta.tone === "paid" ? "secondary" : meta.tone === "failed" ? "destructive" : "outline";
  return <Badge variant={variant}>{meta.label}</Badge>;
}

const columns = [
  {
    key: "reference",
    header: "Reference",
    sortValue: (o) => new Date(o.at).getTime(),
    cell: (o) => (
      <>
        <span className="font-mono text-xs">{o.reference}</span>
        <span className="block text-muted-foreground text-xs">
          {new Date(o.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" · "}
          {new Date(o.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </>
    ),
  },
  {
    key: "guest",
    header: "Guest",
    sortValue: (o) => o.name,
    cellClassName: "max-w-40",
    cell: (o) => (
      <>
        <span className="block truncate font-medium">{o.name}</span>
        <span className="block truncate text-muted-foreground text-xs">{o.email}</span>
      </>
    ),
  },
  {
    key: "booked",
    header: "Booked",
    hideBelow: "md",
    cellClassName: "max-w-56",
    cell: (o) =>
      o.lines.map((l) => (
        <span
          className="block truncate text-muted-foreground text-sm"
          key={`${o.reference}-${l.name}-${l.option ?? ""}`}
        >
          {l.qty} × {l.name}
          {l.option ? ` (${l.option})` : ""}
        </span>
      )),
  },
  {
    key: "method",
    header: "Method",
    cell: (o) => (
      <>
        <span className="block text-sm">{o.method}</span>
        <span className="block font-mono text-muted-foreground text-xs">{o.detail}</span>
      </>
    ),
  },
  {
    key: "total",
    header: "Total",
    sortValue: (o) => o.amount,
    headClassName: "text-right",
    cellClassName: "font-medium tabular-nums",
    cell: (o) => currency(o.amount),
  },
  {
    key: "payment",
    header: "Payment",
    cell: (o) => (
      <>
        <StatusBadge status={o.status} />
        {o.simulated && (
          <span className="mt-1 block text-muted-foreground text-[11px]">simulated</span>
        )}
      </>
    ),
  },
];

const exportFields = [
  { label: "Reference", value: (o) => o.reference },
  { label: "Date", value: (o) => o.at },
  { label: "Guest", value: (o) => o.name },
  { label: "Email", value: (o) => o.email },
  { label: "Booked", value: (o) => o.lines.map((l) => `${l.qty} x ${l.name}`).join("; ") },
  { label: "Method", value: (o) => o.method },
  { label: "Total", value: (o) => o.amount },
  { label: "Status", value: (o) => ORDER_STATUS[o.status]?.label ?? o.status },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);
  const [dateRange, setDateRange] = useState(undefined);

  useEffect(() => {
    setOrders(readOrders());
    setReady(true);
  }, []);

  const filtered = useMemo(
    () => orders.filter((o) => inRange(o.at, dateRange)),
    [orders, dateRange]
  );

  const total = filtered.reduce((n, o) => n + o.amount, 0);
  const nights = filtered.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.qty, 0), 0);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-none dark:ring-0">
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-xs">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{ready ? filtered.length : "—"}</p>
          </CardContent>
        </Card>
        <Card className="shadow-none dark:ring-0">
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-xs">
              Nights and days booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{ready ? nights : "—"}</p>
          </CardContent>
        </Card>
        <Card className="shadow-none dark:ring-0">
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-xs">
              Value at published rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{ready ? currency(total) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          description="Everything put through the checkout in this browser, newest first."
          empty={
            !ready ? (
              <p className="p-6 text-muted-foreground text-sm">
                Reading this browser&rsquo;s orders…
              </p>
            ) : orders.length > 0 ? (
              <p className="p-6 text-muted-foreground text-sm">No bookings in that date range.</p>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <ReceiptTextIcon className="size-6 text-muted-foreground" />
                <p className="font-medium">No bookings yet</p>
                <p className="max-w-md text-muted-foreground text-sm">
                  Orders appear here once someone completes the demo checkout in
                  this browser. There is no server behind it, so a booking made
                  on another device or another browser will not show up.
                </p>
                <Button asChild className="mt-2" size="sm" variant="outline">
                  <a href="/book">Open the booking pages</a>
                </Button>
              </div>
            )
          }
          footer={
            ready &&
            orders.length > 0 && (
              <div className="flex justify-center border-t py-3">
                <Button
                  onClick={() => {
                    clearOrders();
                    setOrders([]);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <TrashIcon aria-hidden="true" />
                  Clear demo bookings
                </Button>
              </div>
            )
          }
          rowKey={(o) => o.reference}
          rows={ready ? filtered : []}
          title="Bookings"
          toolbar={
            <>
              <DateRangeFilter label="Booked on" onChange={setDateRange} range={dateRange} />
              <DataExportMenu fields={exportFields} filenameBase="bookings" rows={filtered} />
            </>
          }
        />
      </div>
    </>
  );
}
