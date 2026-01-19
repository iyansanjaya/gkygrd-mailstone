import { ActivityCardGrid } from "@/components/molecules/activity-card-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-muted">
      <main className="sm:pb-0 pb-[30%] flex flex-col gap-8 p-6 bg-background max-w-3xl mx-auto min-h-screen">
        <div className="mt-3">
          <h1 className="font-bold text-3xl text-center">Form Mailstone</h1>
          <p className="text-center text-muted-foreground">
            Fill in the form below to get started
          </p>
        </div>
        <ActivityCardGrid />
      </main>
    </div>
  );
}
``;
