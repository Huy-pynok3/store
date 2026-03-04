# TapHoaMmo Frontend

Frontend cho TapHoaMmo - Next.js + React + TypeScript + Tailwind CSS

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env.local`:

```bash
cp .env.local.example .env.local
```

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm start
```

## Cấu trúc thư mục

```
frontend/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities (API, auth)
├── public/          # Static files
└── styles/          # CSS files
```

## Kết nối Backend

Frontend sẽ kết nối với backend qua biến môi trường `NEXT_PUBLIC_API_URL`.

Mặc định: `http://localhost:5000/api`
