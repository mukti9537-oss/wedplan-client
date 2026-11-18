import Banner from "@/components/Banner"
import Footer from "@/components/Footer"
import { Navbar } from "@/components/navbar"


export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main>
         <Banner />
      </main>
      <Footer />
    </div>
  )
}
