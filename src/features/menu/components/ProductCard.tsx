"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { MenuProduct } from "@/src/domain/menu/menu.types";
import { formatCurrency } from "@/src/shared/lib/format-currency";
import { CategoryIcon } from "./CategoryIcon";

interface ProductCardProps {
  product: MenuProduct;
}

type ImageStatus = "loading" | "loaded" | "error";

type ProductImageStyle = CSSProperties & {
  "--product-image-scale"?: number;
  "--product-image-hover-scale"?: number;
};

const responsiveImageSizes =
  "(min-width: 1280px) 584px, (min-width: 1024px) calc(50vw - 3rem), (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)";

function ProductMedia({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl;
  const hasConfiguredImage = Boolean(imageUrl) && !product.imageIsPlaceholder;
  const [imageStatus, setImageStatus] = useState<ImageStatus>(
    hasConfiguredImage ? "loading" : "error",
  );
  const showPlaceholder = !hasConfiguredImage || imageStatus === "error";
  const imageIsVisible = hasConfiguredImage && imageStatus === "loaded";
  const imageFit = product.imageFit ?? "cover";
  const imagePosition = product.imagePosition ?? "50% 50%";
  const imageScale = product.imageScale;
  // objectFit precisa vir sempre no style inline: o next/image com `fill`
  // injeta `object-fit: cover` inline, que vence a classe do Tailwind. Sem
  // isto, imageFit "contain" era ignorado e todo card renderizava como cover.
  const foregroundImageStyle: ProductImageStyle = {
    objectFit: imageFit,
    objectPosition: imagePosition,
    ...(imageScale === undefined
      ? {}
      : {
          "--product-image-scale": imageScale,
          "--product-image-hover-scale": Math.min(imageScale + 0.02, 1.05),
        }),
  };

  return (
    <div
      data-product-media={product.id}
      data-image-placeholder={showPlaceholder ? "true" : "false"}
      className="absolute inset-0 overflow-hidden bg-[#0b0704]"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,rgb(231_163_22/0.22),transparent_42%),linear-gradient(145deg,#2a1a0d,#090603_72%)]"
        aria-hidden="true"
      />

      {hasConfiguredImage && imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes={responsiveImageSizes}
            quality={78}
            loading="lazy"
            aria-hidden="true"
            className={`scale-[1.12] object-cover blur-[10px] brightness-[0.34] saturate-[1.25] transition-[opacity,transform,filter] duration-500 group-hover:scale-[1.14] group-hover:brightness-[0.38] ${
              imageIsVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <Image
            src={imageUrl}
            alt={product.imageAlt ?? `Foto de ${product.name}`}
            fill
            sizes={responsiveImageSizes}
            quality={78}
            loading="lazy"
            onLoad={() => setImageStatus("loaded")}
            onError={() => setImageStatus("error")}
            style={foregroundImageStyle}
            className={`${
              imageFit === "contain" ? "object-contain" : "object-cover"
            } transition-[opacity,transform,filter] duration-500 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_94%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_94%)] sm:[mask-image:linear-gradient(to_right,black_0%,black_48%,transparent_80%)] sm:[-webkit-mask-image:linear-gradient(to_right,black_0%,black_48%,transparent_80%)] ${
              imageScale === undefined
                ? "group-hover:scale-[1.025]"
                : "scale-[var(--product-image-scale)] group-hover:scale-[var(--product-image-hover-scale)]"
            } ${
              imageIsVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(5_4_3/0.06)_0%,rgb(5_4_3/0.18)_42%,rgb(5_4_3/0.96)_100%)] sm:bg-[linear-gradient(90deg,rgb(5_4_3/0.08)_0%,rgb(5_4_3/0.22)_40%,rgb(5_4_3/0.93)_69%,rgb(5_4_3/0.98)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_42%,transparent_18%,rgb(5_4_3/0.12)_56%,rgb(5_4_3/0.58)_100%)] shadow-[inset_0_0_48px_rgb(0_0_0/0.52)]"
        aria-hidden="true"
      />

      {showPlaceholder ? (
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-[38%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 sm:left-[27%] sm:top-1/2">
            <span className="grid size-14 place-items-center rounded-full border border-[#e7a316]/40 bg-[#090603]/72 text-3xl shadow-[0_10px_28px_rgb(0_0_0/0.45)] backdrop-blur-sm">
              <CategoryIcon
                categoryId={product.categoryId}
                className="size-7 text-[#ffbc24]"
              />
            </span>
            <span className="rounded-full border border-[#e7a316]/30 bg-[#090603]/78 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.17em] text-[#fff0c2]/85 backdrop-blur-sm">
              Foto em breve
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const titleId = `product-${product.id}`;

  return (
    <article
      aria-labelledby={titleId}
      data-product-card={product.id}
      className="vintage-panel group relative isolate h-full min-h-[214px] overflow-hidden rounded-xl transition-[border-color,box-shadow] duration-300 hover:border-[#e7a316]/60 hover:shadow-[0_20px_45px_rgb(0_0_0/0.42),0_0_26px_rgb(231_163_22/0.08)] sm:min-h-[228px]"
    >
      <ProductMedia product={product} />

      <div className="relative z-10 flex min-h-[214px] items-end p-4 sm:min-h-[228px] sm:items-center sm:justify-end sm:p-5">
        <div className="w-full sm:w-[58%]">
          <span
            className="mb-3 block w-10 border-t border-[#e7a316]/65"
            aria-hidden="true"
          />

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:items-start">
            <div className="min-w-0">
              {product.badge ? (
                <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#ffbc24]">
                  {product.badge}
                </p>
              ) : null}

              <h4
                id={titleId}
                className="font-display text-[1.12rem] leading-tight tracking-[0.015em] text-[#fff0c2] [text-shadow:0_2px_10px_rgb(0_0_0/0.9)] sm:text-[1.3rem]"
              >
                {product.name}
              </h4>

              {product.description ? (
                <p className="mt-2 text-xs leading-5 text-[#cdb886] [text-shadow:0_1px_8px_rgb(0_0_0/0.95)] sm:text-sm">
                  {product.description}
                </p>
              ) : null}
            </div>

            <p className="shrink-0 rounded-md border border-[#e7a316]/45 bg-[#090603]/88 px-2.5 py-2 text-sm font-black text-[#ffbc24] shadow-[inset_0_1px_0_rgb(255_240_194/0.06),0_6px_18px_rgb(0_0_0/0.3)] backdrop-blur-sm sm:px-3 sm:text-base">
              {formatCurrency(product.priceInCents)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
