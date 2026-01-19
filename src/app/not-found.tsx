import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 -mt-[10%] sm:-mt-[4%]">
      <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-card to-muted/30">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <h1 className="text-9xl font-black bg-gradient-to-br from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent select-none">
              404
            </h1>
            <div className="absolute inset-0 text-9xl font-black text-primary/5 blur-xl select-none">
              404
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full">
            <Button asChild variant="default" className="flex-1">
              <Link href="/">
                <Home className="size-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
