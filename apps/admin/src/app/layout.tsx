import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JINU Admin | 관리자 플랫폼',
  description: 'JINUCHEM 통합 플랫폼 운영 관리 대시보드',
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
