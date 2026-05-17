# Hướng dẫn Setup Sanity CMS cho HTtech

## Bước 1: Tạo Sanity Project

1. Truy cập [sanity.io](https://sanity.io) và đăng nhập
2. Tạo project mới hoặc sử dụng CLI:

```bash
npm create sanity@latest -- --template clean --create-project "HTtech CMS" --dataset production
```

## Bước 2: Thêm Schema Product

Copy file `sanity-schema/product.ts` vào thư mục `schemas/` của Sanity Studio.

Sau đó import vào `schemas/index.ts`:

```typescript
import product from './product'

export const schemaTypes = [product]
```

## Bước 3: Cấu hình Environment Variables

Trong v0 hoặc Vercel, thêm các biến môi trường:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Project ID từ Sanity (tìm trong sanity.config.ts hoặc sanity.io/manage)
- `NEXT_PUBLIC_SANITY_DATASET`: Thường là `production`

## Bước 4: Thêm sản phẩm trong Sanity Studio

1. Chạy Sanity Studio: `npm run dev`
2. Truy cập http://localhost:3333
3. Thêm sản phẩm với đầy đủ thông tin

## Bước 5: Deploy Sanity Studio

```bash
npx sanity deploy
```

## Cấu trúc dữ liệu Product

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| title | string | Tên sản phẩm |
| slug | slug | URL slug |
| image | image | Hình ảnh chính |
| category | string | Danh mục (bien-tan, plc-hmi, dong-cat, cam-bien, vat-tu, servo) |
| brand | string | Thương hiệu |
| sku | string | Mã sản phẩm |
| price | number | Giá bán |
| originalPrice | number | Giá gốc (nếu giảm giá) |
| inStock | boolean | Còn hàng |
| isHot | boolean | Sản phẩm hot |
| isBestSeller | boolean | Bán chạy |
| isNew | boolean | Mới |
| specs | array | Thông số kỹ thuật [{label, value}] |
| description | text | Mô tả ngắn |
| fullDescription | block | Mô tả chi tiết (rich text) |
| features | array | Tính năng nổi bật |
| gallery | array | Thư viện ảnh |

## Lưu ý

- Website hiện đang sử dụng **mock data** để demo
- Khi Sanity có dữ liệu thật, hệ thống sẽ tự động chuyển sang fetch từ Sanity
- Nếu Sanity không có dữ liệu hoặc lỗi kết nối, mock data sẽ được sử dụng làm fallback
