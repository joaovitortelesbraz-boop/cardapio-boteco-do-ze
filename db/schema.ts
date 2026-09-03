import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  iconKey: text("icon_key"),
  sortOrder: integer("sort_order").default(0),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  imageFit: text("image_fit").default("cover"),
  imagePosition: text("image_position").default("50% 50%"),
  imageScale: integer("image_scale"),
  available: integer("available").default(1),
  sortOrder: integer("sort_order").default(0),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
});
