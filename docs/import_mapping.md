# Product Import Mapping Strategy

## Overview
This document defines how to map incoming dropshipping data (e.g., from CSV/External API) to the Supabase `products` table, ensuring strict adherence to the **"Hybrid" i18n Strategy** and **Catalog Mode**.

## Target Schema: `public.products`

| Field | Type | Mapping Rule | Notes |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Generate New | Auto-gen by Supabase |
| `title` | Text | **Keep English** | e.g. "Vintage Steel Shears" |
| `description` | Text | **Hybrid Arabic Story** | Map English description to a translated/localized "Story" field or use mixed content.<br>*Action*: Use AI summarizer/translator during import to generate the "Story" from the raw description. |
| `price` | Numeric | Direct Map | Ensure currency is USD (or store base) |
| `category_id` | UUID | **Auto-Tag: Maker Supplies** | Lookup ID for slug `maker-supplies` |
| `status` | Enum | **Set to 'catalog_only'** | Disables "Add to Cart" button in UI |
| `stock` | Integer | Direct Map | |
| `image_url` | Text | Direct Map | URL from source |

## Category Tagging Logic
For all items identified as "Supplies" or "Tools":
1. Query `product_categories` for `slug = 'maker-supplies'`.
2. Use returned `id` for `products.category_id`.

## Status Logic
- **'active'**: Items for sale (LaraCraft Originals).
- **'catalog_only'**: Supplies (Inquiry Only).
- **'draft'**: Incomplete items.

## Example Import Row (JSON)
```json
{
  "title": "Solid Brass Caliper",
  "raw_desc": "Precise measuring tool...",
  "status": "catalog_only",
  "category_id": "UUID-OF-MAKER-SUPPLIES"
}
```
