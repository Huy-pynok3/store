# TạpHóaMMO - Next.js 14 + Tailwind CSS

Sàn thương mại điện tử sản phẩm số được xây dựng với Next.js 14 (App Router) và Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Font Awesome 6
- **Font**: Roboto (Google Fonts)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Development

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
taphoammo/
├── app/
│   ├── layout.tsx          # Root layout with Header & Footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Header with navbar & dropdown
│   ├── Footer.tsx          # Footer with 3 columns
│   ├── CategorySection.tsx # Product categories
│   ├── ServiceSection.tsx  # Services grid
│   ├── ProductGrid.tsx     # Latest products
│   └── AboutSection.tsx    # About TaphoaMMO
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Features

### SEO Optimized
- Server-Side Rendering (SSR)
- Metadata API for SEO tags
- Semantic HTML structure
- Open Graph tags
- Robots.txt ready

### Performance
- Image optimization with next/image
- Automatic code splitting
- Font optimization
- Sticky header for better UX

### UI/UX
- Responsive design (mobile-first)
- Dropdown menus with hover
- Sticky sidebars
- Smooth animations
- Marquee notification bar

## 🔧 Configuration

### Tailwind Colors
```js
primary: '#2dbf6a'        // Main green color
primary-dark: '#22c55e'   // Darker green
```

### Container Width
```js
max-w-container: '1600px'
```

## 📝 Adding New Pages

Create a new folder in `app/` directory:

```typescript
// app/san-pham/page.tsx
export const metadata = {
  title: 'Sản phẩm - TạpHóaMMO',
  description: 'Danh sách sản phẩm...',
}

export default function SanPhamPage() {
  return <div>Sản phẩm page</div>
}
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
```bash
# Build
npm run build

# The output will be in .next/ folder
# Upload to your hosting provider
```

## 📊 SEO Checklist

- [x] Metadata API configured
- [x] Semantic HTML
- [x] Open Graph tags
- [x] Responsive design
- [x] Image optimization
- [ ] Sitemap.xml (add in production)
- [ ] Robots.txt (add in production)
- [ ] Structured data (JSON-LD)
- [ ] Analytics integration

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)

