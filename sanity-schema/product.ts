// Sanity Schema cho HTtech - Copy vào Sanity Studio của bạn
// File: schemas/product.ts

export default {
  name: 'product',
  title: 'Sản phẩm',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tên sản phẩm',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Hình ảnh',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Danh mục',
      type: 'string',
      options: {
        list: [
          { title: 'Biến tần', value: 'bien-tan' },
          { title: 'PLC & HMI', value: 'plc-hmi' },
          { title: 'Thiết bị đóng cắt', value: 'dong-cat' },
          { title: 'Cảm biến', value: 'cam-bien' },
          { title: 'Vật tư tủ điện', value: 'vat-tu' },
          { title: 'Servo & Động cơ', value: 'servo' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'brand',
      title: 'Thương hiệu',
      type: 'string',
    },
    {
      name: 'sku',
      title: 'Mã sản phẩm (SKU)',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Giá (VNĐ)',
      type: 'number',
    },
    {
      name: 'originalPrice',
      title: 'Giá gốc (nếu có giảm giá)',
      type: 'number',
    },
    {
      name: 'inStock',
      title: 'Còn hàng',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'isHot',
      title: 'Sản phẩm Hot',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isBestSeller',
      title: 'Bán chạy',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isNew',
      title: 'Sản phẩm mới',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'specs',
      title: 'Thông số kỹ thuật',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tên thông số', type: 'string' },
            { name: 'value', title: 'Giá trị', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'description',
      title: 'Mô tả ngắn',
      type: 'text',
      rows: 3,
    },
    {
      name: 'fullDescription',
      title: 'Mô tả chi tiết',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'features',
      title: 'Tính năng nổi bật',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'gallery',
      title: 'Thư viện ảnh',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
}
