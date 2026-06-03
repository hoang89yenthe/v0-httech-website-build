# HTtech Design System

Tài liệu này ghi lại tất cả design tokens và nguyên tắc đang được áp dụng.
Màu sắc không thay đổi — chỉ structure, typography, spacing và motion.

---

## Typography

| Token | Value | Dùng ở |
|-------|-------|--------|
| Font family | `'Be Vietnam Pro', system-ui, sans-serif` | Toàn bộ |
| Body size | `16px / 1rem` | `<p>`, body text |
| Body line-height | `1.65` | `<p>` |
| h1 letter-spacing | `-0.03em` | Display heading |
| h2 letter-spacing | `-0.025em` | Section heading |
| h3/h4 letter-spacing | `-0.015em` | Card heading |
| h1/h2 line-height | `1.1 / 1.15` | Large headings |
| Label uppercase | `font-medium + tracking-[0.06–0.08em]` | Brand labels ≤11px |

### Font weight quy tắc
- `400` — body text, descriptions
- `500` — labels, secondary info (`font-medium`)
- `600` — section headings, card titles, CTA text (`font-semibold`)
- `700` — hero display heading only (`font-bold`)
- **Tránh 700+ trừ hero display**

### Size scale (px)
`10 → 11 → 12 → 13 → 14 → 16 → 18 → 20 → 24 → 30 → 36 → 48 → 56`

---

## Spacing

Bội số 4px. Container padding tối thiểu 16px.

| Token | Value | Dùng ở |
|-------|-------|--------|
| Section padding mobile | `py-20` (80px) | Tất cả sections |
| Section padding desktop | `py-28` (112px) | Tất cả sections |
| Card internal | `p-6` (24px) | Service cards |
| Component gap | `gap-4 / gap-5` | Grids |
| Heading → subtext | `mb-4` (16px) | h2 → p |
| Subtext → content | `mb-12` (48px) | p → main content |

---

## Border Radius

| Token CSS | Value | Dùng ở |
|-----------|-------|--------|
| `--ds-radius-sm` | `6px` | Tags, badges |
| `--ds-radius-md` | `10px` | Inputs |
| `--ds-radius-lg` | `14px` | — |
| `--ds-radius-xl` | `18px` | Logo block |
| `rounded-2xl` | `16px` | Cards, images |
| `rounded-3xl` / `rounded-full` | `24px / 9999px` | Pills, CTA buttons |

**Quy tắc:**
- CTA button primary/secondary → `rounded-full` (pill)
- Cards, panels → `rounded-2xl` (16px)
- Icon containers → `rounded-xl` (12px)
- Tags → `rounded-full`

---

## Elevation (Shadow)

Apple-style: cực kỳ nhẹ, chủ yếu dùng border thay shadow.

| Token CSS | Value | Dùng ở |
|-----------|-------|--------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,.06)` | Micro elevation |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,.08)` | Default card |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,.10)` | Hover state, CTA |

**Quy tắc:**
- Default card state → border `border-border/60` (không shadow)
- Hover card state → `hover:shadow-md + hover:border-primary/20`
- CTA buttons → `shadow-md shadow-primary/20`
- Tránh `shadow-xl`, `shadow-2xl` hoàn toàn

---

## Motion

| Token CSS | Value | Dùng ở |
|-----------|-------|--------|
| `--dur-fast` | `150ms` | Micro (color change) |
| `--dur-base` | `200ms` | Default (tất cả transitions) |
| `--dur-medium` | `300ms` | Overlay, panel |
| `--dur-slow` | `500ms` | Page-level |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default ease |
| `--ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Entrance |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Exit |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge bounce |

### Quy tắc motion
- **Hover:** `opacity` thay vì `scale` (trừ image thumbnail: scale 1.03 tối đa)
- **Active/press:** `scale(0.97–0.98)` kèm `duration-200`
- **Scale hover:** tối đa `scale(1.03)` — không dùng scale lớn hơn
- **Stagger:** tối đa 80ms mỗi item, tổng stagger không quá 320ms
- **Tránh:** bounce, elastic, duration > 500ms cho UI transition

### Hero entrance animation
```
label   → 0.3s ease-enter 0ms
h1      → 0.4s ease-enter 80ms
p       → 0.35s ease-enter 160ms
CTAs    → 0.3s ease-enter 240ms
badges  → 0.3s ease-enter 320ms
image   → 0.5s ease-enter 100ms
badge   → 0.4s ease-spring 400ms
```

---

## Components

### Button
```
Primary:   bg-primary rounded-full px-6 py-3 font-medium hover:opacity-85 active:scale-[0.97] duration-200
Secondary: variant="outline" rounded-full border-border/60
```

### Card (Product)
```
bg-card rounded-2xl border border-border/60
hover: border-primary/20 shadow-md
transition: all duration-200
```

### Service Card
```
rounded-2xl border border-border/60 p-6
hover: border-primary/25 glow-effect
transition: all duration-200
```

### Brand Label (uppercase)
```
text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground
```

### Section Label (small uppercase)
```
text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80
```

---

## Responsive Breakpoints

| Name | Width | Notes |
|------|-------|-------|
| Mobile | `390px` | Full-width, stacked |
| Tablet | `768px` | 2-col grid |
| Desktop | `1200px` | 4-col grid, sidebar |
| Wide | `1440px` | Max-width container |

Container: `max-w-7xl mx-auto px-4` (default Next.js container)
