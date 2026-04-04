import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JINU E-Note | 전자실험노트',
  description: '연구기관을 위한 전자실험노트(ELN) - 실험 관리, 프로토콜, 시약장 연동',
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
