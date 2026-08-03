"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BedIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  PresentationIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DataExportMenu from "@/components/admin/DataExportMenu";
import DataTable from "@/components/admin/DataTable";
import { currency } from "@/lib/catalogue";
import {
  addListing,
  manageableCatalogue,
  propertyImages,
  readStorefront,
  removeListing,
  setHidden,
  slugify,
} from "@/lib/storefront";

/*
  What the shop lists. Entries from the real catalogue can be taken off the
  shop and put back — never deleted, because they come from lib/content.js and
  are the property's actual rooms and halls. Listings added here are the shop's
  own and can be removed outright.
*/

const BLANK = {
  name: "",
  kind: "room",
  price: "",
  capacity: "",
  lead: "",
  image: propertyImages[0] ?? "",
};

export default function ListingsManager() {
  const [state, setState] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    setState(readStorefront());
  }, []);

  const rows = useMemo(() => (state ? manageableCatalogue(state) : []), [state]);

  const listed = rows.filter((r) => !r.hidden);
  const rooms = listed.filter((r) => r.kind === "room").length;
  const halls = listed.filter((r) => r.kind === "hall").length;

  function submit(e) {
    e.preventDefault();
    const name = draft.name.trim();
    const price = Number(draft.price);

    if (name.length < 3) return setError("Give the listing a name.");
    if (!Number.isFinite(price) || price <= 0) return setError("Set a rate above zero.");

    const slug = slugify(name);
    if (rows.some((r) => r.slug === slug)) return setError("Something already uses that name.");

    const isRoom = draft.kind === "room";
    setState(
      addListing({
        id: `custom-${slug}`,
        slug,
        kind: draft.kind,
        category: isRoom ? "Rooms & Suites" : "Conference Halls",
        name,
        price,
        unit: isRoom ? "night" : "day",
        unitPlural: isRoom ? "nights" : "days",
        images: [draft.image],
        lead: draft.lead.trim() || "Added from the admin screen.",
        badge: draft.capacity.trim() || (isRoom ? "Room" : "Hall"),
        capacityLabel: draft.capacity.trim() || "—",
        capacity: Number.parseInt(draft.capacity, 10) || 2,
        option: { label: isRoom ? "Bed setup" : "Layout", values: ["Standard"] },
        included: [],
        specs: [],
        href: "/book",
        sourceHref: "/book",
      })
    );
    setDraft(BLANK);
    setError("");
    setOpen(false);
  }

  const columns = [
    {
      key: "listing",
      header: "Listing",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              alt=""
              aria-hidden
              className="object-cover"
              fill
              sizes="40px"
              src={`/img/${r.images[0]}.webp`}
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{r.name}</span>
            {r.isCustom && (
              <span className="block text-muted-foreground text-xs">
                Added here · no detail page
              </span>
            )}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      hideBelow: "md",
      cellClassName: "text-muted-foreground text-sm",
      cell: (r) => r.category,
    },
    {
      key: "takes",
      header: "Takes",
      hideBelow: "sm",
      cellClassName: "text-muted-foreground text-sm",
      cell: (r) => r.badge,
    },
    {
      key: "rate",
      header: "Rate",
      sortValue: (r) => r.price,
      headClassName: "text-right",
      cellClassName: "text-right tabular-nums",
      cell: (r) => (
        <>
          {currency(r.price)}
          <span className="text-muted-foreground">/{r.unit}</span>
        </>
      ),
    },
    {
      key: "shop",
      header: "Shop",
      cell: (r) => <Badge variant={r.hidden ? "outline" : "secondary"}>{r.hidden ? "Hidden" : "Listed"}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r) =>
        r.isCustom ? (
          <Button
            aria-label={`Remove ${r.name}`}
            onClick={() => setState(removeListing(r.slug))}
            size="icon-xs"
            variant="ghost"
          >
            <TrashIcon />
          </Button>
        ) : (
          <Button
            aria-label={r.hidden ? `Put ${r.name} back on the shop` : `Take ${r.name} off the shop`}
            onClick={() => setState(setHidden(r.slug, !r.hidden))}
            size="icon-xs"
            variant="ghost"
          >
            {r.hidden ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        ),
    },
  ];

  const exportFields = [
    { label: "Name", value: (r) => r.name },
    { label: "Type", value: (r) => r.category },
    { label: "Takes", value: (r) => r.badge },
    { label: "Rate", value: (r) => r.price },
    { label: "Unit", value: (r) => r.unit },
    { label: "Shop status", value: (r) => (r.hidden ? "Hidden" : "Listed") },
    { label: "Source", value: (r) => (r.isCustom ? "Added in admin" : "Property catalogue") },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Listed on the shop", value: listed.length, icon: EyeIcon },
          { label: "Rooms & suites", value: rooms, icon: BedIcon },
          { label: "Conference halls", value: halls, icon: PresentationIcon },
        ].map((s) => (
          <Card className="shadow-none dark:ring-0" key={s.label}>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-xs">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <s.icon className="size-5 text-muted-foreground" />
              <p className="font-semibold text-2xl tabular-nums">{state ? s.value : "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          description="Take an entry off the shop, put it back, or add a listing of your own."
          empty={<p className="p-6 text-muted-foreground text-sm">Reading the shop…</p>}
          rowKey={(r) => r.slug}
          rows={rows}
          title="Rooms & halls on the shop"
          toolbar={
            <>
            <DataExportMenu fields={exportFields} filenameBase="rooms-and-halls" rows={rows} />
            <Sheet onOpenChange={setOpen} open={open}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <PlusIcon aria-hidden="true" />
                  Add a listing
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Add a listing</SheetTitle>
                  <SheetDescription>
                    It appears on the shop grid straight away. Without a backend it
                    has no detail page of its own, and it exists in this browser
                    only.
                  </SheetDescription>
                </SheetHeader>

                <form className="grid gap-4 px-4" id="add-listing" onSubmit={submit}>
                  <div className="grid gap-2">
                    <Label htmlFor="l-name">Name</Label>
                    <Input
                      id="l-name"
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Garden Cottage"
                      value={draft.name}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="l-kind">Type</Label>
                      <Select
                        onValueChange={(v) => setDraft({ ...draft, kind: v })}
                        value={draft.kind}
                      >
                        <SelectTrigger id="l-kind">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room">Room or suite</SelectItem>
                          <SelectItem value="hall">Conference hall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="l-price">
                        Rate, per {draft.kind === "room" ? "night" : "day"}
                      </Label>
                      <Input
                        id="l-price"
                        inputMode="numeric"
                        onChange={(e) =>
                          setDraft({ ...draft, price: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder="120"
                        value={draft.price}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="l-capacity">
                      {draft.kind === "room" ? "Size or sleeps" : "Seats"}
                    </Label>
                    <Input
                      id="l-capacity"
                      onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                      placeholder={draft.kind === "room" ? "42 sqm" : "40 seats"}
                      value={draft.capacity}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="l-lead">Short description</Label>
                    <Input
                      id="l-lead"
                      onChange={(e) => setDraft({ ...draft, lead: e.target.value })}
                      placeholder="One line, as it reads on the card."
                      value={draft.lead}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="l-image">Photograph</Label>
                    <Select
                      onValueChange={(v) => setDraft({ ...draft, image: v })}
                      value={draft.image}
                    >
                      <SelectTrigger id="l-image">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyImages.map((img) => (
                          <SelectItem key={img} value={img}>
                            {img}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                      Pick from photographs already on the property — uploading
                      needs a backend.
                    </p>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}
                </form>

                <SheetFooter>
                  <Button form="add-listing" type="submit">
                    Add to the shop
                  </Button>
                  <Button onClick={() => setOpen(false)} type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            </>
          }
        />
      </div>
    </>
  );
}
