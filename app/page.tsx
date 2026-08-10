import { Footer } from "@/src/shared/components/Footer";
import { Header } from "@/src/shared/components/Header";
import { Hero } from "@/src/features/menu/components/Hero";
import { MenuCatalog } from "@/src/features/menu/components/MenuCatalog";
import { getMenuPageData } from "@/src/features/menu/application/get-menu-page-data";

export default async function Home() {
  const menu = await getMenuPageData();
  const featuredProduct = menu.products.find((product) => product.featured);

  return (
    <div className="min-h-screen bg-[#f6f0e6] text-[#201b16]">
      <Header />
      <main>
        <Hero featuredProduct={featuredProduct} />
        <MenuCatalog categories={menu.categories} products={menu.products} />
      </main>
      <Footer />
    </div>
  );
}
