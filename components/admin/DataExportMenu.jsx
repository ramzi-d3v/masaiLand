"use client";

import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCsv, downloadJson, todayStamp } from "@/lib/exportData";

/*
  Real, right now, for CSV and JSON: both build the file in the browser and
  trigger a download, no server involved.

  "Sync to Google Drive" stays in the menu because the button belongs in the
  set — but it's disabled rather than wired to anything. Actually syncing to
  Drive needs a Google Cloud OAuth client and a Drive API key, and this
  project has neither. A button that looked connected without being connected
  would be worse than no button, so this one says plainly that it isn't.
*/
export default function DataExportMenu({ filenameBase, rows, fields }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <DownloadIcon aria-hidden="true" />
          <span className="hidden sm:inline">Export</span>
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={() =>
            downloadCsv(`${filenameBase}-${todayStamp()}.csv`, rows, fields)
          }
        >
          <FileSpreadsheetIcon aria-hidden="true" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            downloadJson(
              `${filenameBase}-${todayStamp()}.json`,
              rows.map((row) =>
                Object.fromEntries(fields.map((f) => [f.label, f.value(row)]))
              )
            )
          }
        >
          <FileJsonIcon aria-hidden="true" />
          Export JSON
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <img
            alt=""
            aria-hidden
            className="size-4 opacity-50 grayscale"
            src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
          />
          Sync to Google Drive
        </DropdownMenuItem>
        <DropdownMenuLabel className="font-normal text-[11px] text-muted-foreground leading-snug">
          Not connected — needs a Google API client, not added yet.
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
