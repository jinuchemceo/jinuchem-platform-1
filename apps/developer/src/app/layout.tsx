import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JINU API | 개발자 포털',
  description: 'JINUCHEM 외부 API v1 개발자 문서 및 관리 포털',
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
