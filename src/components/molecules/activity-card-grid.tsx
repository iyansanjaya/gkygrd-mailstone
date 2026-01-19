"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";

const data = [
  {
    id: 1,
    title: "Nama Kegiatan 1",
    description:
      "Deskripsi Kegiatan satu Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque repellendus dolore recusandae odit mollitia dicta nostrum, excepturi voluptas. Ipsum quaerat architecto autem quas nostrum obcaecati nam optio laborum, id vel!",
    date: "29 Jan 2026",
    image: "/images/sample.jpg",
  },
  {
    id: 2,
    title: "Nama Kegiatan 2",
    description: "Deskripsi Kegiatan dua",
    date: "29 Jan 2026",
    image: "/images/sample.jpg",
  },
  {
    id: 3,
    title: "Nama Kegiatan 3",
    description: "Deskripsi Kegiatan tiga",
    date: "29 Jan 30",
    image: "/images/sample.jpg",
  },
];

export function ActivityCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {data.map((item, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="w-full space-y-3 cursor-pointer group">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1000}
                  height={1000}
                  className="transition group-hover:scale-105"
                />
                <div className="absolute top-1 right-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Ellipsis />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-1 p-1 w-fit bg-background border-none">
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="default"
                        className="h-8 rounded-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="destructive"
                        className="h-8 rounded-sm"
                      >
                        Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="font-bold text-lg">{item.title}</h1>
                <p className="text-muted-foreground text-sm">{item.date}</p>
                <p className="text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{item.title}</DialogTitle>
              <p className="text-muted-foreground text-sm">{item.date}</p>
              <DialogDescription>{item.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
