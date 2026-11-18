import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1 pt-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Worldwide matrimonial app for meaningful, serious marriages.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Online Rishtay is an online rishta platform and matrimonial app for
            marriage-minded adults who want thoughtful introductions, meaningful
            compatibility, private profiles and family values expected at every step.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-3">Get Started</Button>
            <Button variant="outline" className="px-8 py-3">
              Browse Services
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
