import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JINU Supplier Portal | 공급사 포털',
  description: 'JINUCHEM 공급사를 위한 견적, 주문, 제품 관리 포털',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
