import Image from "next/image";
import { ModeToggle } from "@/components/molecules/mode-toggle";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog"

const data = [
  {
    id: 1,
    title: "Nama Kegiatan 1",
    description: "Deskripsi Kegiatan.",
    image: "/images/sample.jpg",
  },
  {
    id: 2,
    title: "Nama Kegiatan 2",
    description: "Deskripsi Kegiatan.",
    image: "/images/sample.jpg",
  },
  {
    id: 3,
    title: "Nama Kegiatan 3",
    description: "Deskripsi Kegiatan.",
    image: "/images/sample.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-muted">
      <main className="flex flex-col gap-8 p-6 bg-background max-w-3xl mx-auto min-h-screen">
        <div className="mt-3">
          <h1 className="font-bold text-3xl text-center">Form Mailstone</h1>
          <p className="text-center text-muted-foreground">Fill in the form below to get started</p>
        </div>
          <Dialog>
            <DialogTrigger className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.map((item) => (
                <div key={item.id} className="w-full space-y-3">
                  <div className="rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.title} width={1000} height={1000} className="transition hover:scale-105 cursor-pointer " />
                  </div>
                  <div className="space-y-1">
                    <h1 className="font-bold text-lg">{item.title}</h1>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* {data.map((item) => (
            <div key={item.id} className="w-full space-y-3">
              <div className="rounded-lg overflow-hidden">
                <Image src={item.image} alt={item.title} width={1000} height={1000} className="transition hover:scale-105 cursor-pointer " />
              </div>
              <div className="space-y-1">
                <h1 className="font-bold text-lg">{item.title}</h1>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))} */}

        <ModeToggle />
      </main>
    </div>
  );
}
