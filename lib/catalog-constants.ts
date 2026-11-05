// Catalogue enums shared by server code and client forms. Keep this module free
// of server imports: lib/models/* pull in the MongoDB driver.

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const COLLECTION_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export type CollectionStatus = (typeof COLLECTION_STATUSES)[number];

export const IMAGE_KINDS = ["FRONT", "BACK", "DETAIL", "MODEL", "OTHER"] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"] as const;
