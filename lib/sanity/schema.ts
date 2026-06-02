/**
 * Sanity Schema Definition for HTtech Products
 * 
 * This is the schema you need to create in your Sanity Studio.
 * Copy this schema to your Sanity Studio project at: schemas/product.ts
 * 
 * To set up Sanity Studio:
 * 1. Go to https://www.sanity.io/get-started
 * 2. Create a new project
 * 3. Copy the Project ID to your .env file as NEXT_PUBLIC_SANITY_PROJECT_ID
 * 4. Create this schema in your Sanity Studio
 */

export const productSchema = {
  name: "product",
  title: "Sản phẩm",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Tên sản phẩm",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image",
      title: "Hình ảnh",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "category",
      title: "Danh mục",
      type: "string",
      options: {
        list: [
          { title: "Biến tần", value: "bien-tan" },
          { title: "PLC & HMI", value: "plc-hmi" },
          { title: "Thiết bị đóng cắt", value: "dong-cat" },
          { title: "Cảm biến", value: "cam-bien" },
          { title: "Vật tư tủ điện", value: "vat-tu" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "brand",
      title: "Thương hiệu",
      type: "string",
    },
    {
      name: "price",
      title: "Giá bán",
      type: "number",
    },
    {
      name: "originalPrice",
      title: "Giá gốc",
      type: "number",
    },
    {
      name: "specs",
      title: "Thông số kỹ thuật",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Tên thông số", type: "string" },
            { name: "value", title: "Giá trị", type: "string" },
          ],
        },
      ],
    },
    {
      name: "description",
      title: "Mô tả",
      type: "text",
    },
    {
      name: "tag",
      title: "Nhãn",
      type: "string",
      options: {
        list: [
          { title: "Hot", value: "hot" },
          { title: "Bán chạy", value: "best-seller" },
          { title: "Mới", value: "new" },
        ],
      },
    },
    {
      name: "inStock",
      title: "Còn hàng",
      type: "boolean",
      initialValue: true,
    },
  ],
};

// TypeScript type for Product
export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  image?: {
    asset: {
      _ref: string;
    };
  };
  category: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  specs?: Array<{
    label: string;
    value: string;
  }>;
  description?: string;
  tag?: "hot" | "best-seller" | "new";
  inStock: boolean;
}

// Category mapping for display
export const categoryLabels: Record<string, string> = {
  "bien-tan": "Biến tần",
  "plc-hmi": "PLC & HMI",
  "dong-cat": "Thiết bị đóng cắt",
  "cam-bien": "Cảm biến",
  "vat-tu": "Vật tư tủ điện",
};

export const tagLabels: Record<string, string> = {
  "hot": "Hot",
  "best-seller": "Bán chạy",
  "new": "Mới",
};

export function getTagClass(tag?: string): string {
  switch (tag) {
    case "hot": return "bg-red-500 text-white";
    case "best-seller": return "bg-amber-500 text-white";
    case "new": return "bg-green-500 text-white";
    default: return "bg-slate-500 text-white";
  }
}
