import { Footer } from "@/src/shared/components/Footer";
import { Header } from "@/src/shared/components/Header";
import { Hero } from "@/src/features/menu/components/Hero";
import { MenuCatalog } from "@/src/features/menu/components/MenuCatalog";
import { getMenuPageData } from "@/src/features/menu/application/get-menu-page-data";

export default async function Home() {
  const menu = await getMenuPageData();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--cream)]">
      <Header />
      <main>
        <Hero />
        <MenuCatalog categories={menu.categories} products={menu.products} />
      </main>
      <Footer />
    </div>
  );
}
