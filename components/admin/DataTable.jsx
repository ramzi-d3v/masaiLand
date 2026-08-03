"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns3Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/*
  The one table shell every admin screen builds on — bookings, the rooms &
  halls listing, enquiries — now genuinely powered by TanStack Table rather
  than a plain `.map()`, the same engine and the same pagination/column-
  visibility chrome as shadcn's own dashboard data-table. Row selection and
  drag-to-reorder from that reference are left out on purpose: nothing here
  has bulk actions or a manual order to preserve, and shipping controls with
  no effect behind them is worse than not shipping them.

  A screen still hands over the same three things it always did:

    columns: [{ key, header, cell(row), headClassName, cellClassName,
                hideBelow: "sm"|"md", hideable, sortValue(row) }]
    rows:    the array of records
    rowKey:  (row) => a stable id

  `sortValue` is optional — supply it and that column's header becomes a
  sort toggle; a JSX-only column (a photo, a row of buttons) simply has none.
  `hideable` defaults to true; set it false on a column a screen can't afford
  to lose (the leftmost identity column, the trailing actions column).
*/

const HIDE = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
};

const PAGE_SIZES = [5, 10, 20, 50];

function SortButton({ label, sorted, onClick }) {
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
  return (
    <Button className="-ml-3 h-8" onClick={onClick} size="sm" variant="ghost">
      {label}
      <Icon className="text-muted-foreground" />
    </Button>
  );
}

export default function DataTable({
  title,
  description,
  toolbar,
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  footer,
  pageSize = 5,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const tanColumns = columns.map((col, i) => ({
    id: col.key,
    accessorFn: (row) => (col.sortValue ? col.sortValue(row) : row),
    enableSorting: !!col.sortValue,
    enableHiding: col.hideable ?? !(i === 0 || i === columns.length - 1),
    header: ({ column }) =>
      col.sortValue ? (
        <SortButton
          label={col.header}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          sorted={column.getIsSorted()}
        />
      ) : (
        col.header
      ),
    cell: ({ row }) => col.cell(row.original),
    meta: { headClassName: col.headClassName, cellClassName: col.cellClassName, hideBelow: col.hideBelow, first: i === 0, last: i === columns.length - 1 },
  }));

  const table = useReactTable({
    data: rows,
    columns: tanColumns,
    getRowId: rowKey,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const visibleLeaf = table.getAllLeafColumns().filter((c) => c.getCanHide());

  return (
    <Card className="gap-0 shadow-none dark:ring-0">
      <CardHeader
        className={`flex flex-col gap-4 border-b ${toolbar ? "sm:flex-row sm:items-center sm:justify-between" : ""}`}
      >
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <CardAction className="static flex flex-col gap-2 sm:flex-row sm:items-center">
          {toolbar}
          {visibleLeaf.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Columns3Icon aria-hidden="true" />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDownIcon aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {visibleLeaf.map((column) => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        {rows.length === 0 ? (
          empty ?? <p className="p-6 text-muted-foreground text-sm">Nothing here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow className="hover:bg-transparent" key={hg.id}>
                    {hg.headers.map((header) => {
                      const m = header.column.columnDef.meta;
                      return (
                        <TableHead
                          className={`${m.first ? "pl-6" : ""} ${m.last ? "pr-6 text-right" : ""} ${
                            m.hideBelow ? HIDE[m.hideBelow] : ""
                          } ${m.headClassName ?? ""}`}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={`hover:bg-transparent ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const m = cell.column.columnDef.meta;
                      return (
                        <TableCell
                          className={`${m.first ? "pl-6" : ""} ${m.last ? "pr-6 text-right" : ""} ${
                            m.hideBelow ? HIDE[m.hideBelow] : ""
                          } align-top ${m.cellClassName ?? ""}`}
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {footer}

      {rows.length > pageSize && (
        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t px-6 py-3 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            Page {pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())} ·{" "}
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-muted-foreground text-sm">Rows per page</span>
              <Select
                onValueChange={(v) => table.setPageSize(Number(v))}
                value={`${pagination.pageSize}`}
              >
                <SelectTrigger className="w-16" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {PAGE_SIZES.map((n) => (
                    <SelectItem key={n} value={`${n}`}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                className="size-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">First page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                className="size-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                className="size-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                className="size-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
