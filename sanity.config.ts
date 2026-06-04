import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { productSchema } from "./lib/sanity/schema";

export default defineConfig({
  name: "default",
  title: "HTtech Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "881hwmwa",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  // Đăng ký URL studio để Sanity nhận diện đây là studio hợp lệ
  auth: {
    mode: "replace",
  },

  plugins: [structureTool()],

  schema: {
    types: [productSchema],
  },
});
