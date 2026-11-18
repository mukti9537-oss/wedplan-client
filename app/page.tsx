import Banner from "@/components/Banner"
import { Navbar } from "@/components/navbar"


export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main>
         <Banner />
      </main>
    </div>
  )
}
