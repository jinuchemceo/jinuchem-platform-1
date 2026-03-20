// ================================================================
// 스마트택배 (Sweet Tracker) API 프록시
// https://tracking.sweettracker.co.kr
// 무료: 300회/일, API Key 필요
// ================================================================

import { NextRequest, NextResponse } from 'next/server';

const SWEET_TRACKER_API_KEY = process.env.SWEET_TRACKER_API_KEY || '';
const SWEET_TRACKER_BASE = 'http://info.sweettracker.co.kr/api/v1';

// 택배사 코드 매핑
export const CARRIER_CODES: Record<string, { code: string; name: string }> = {
  cj: { code: '04', name: 'CJ대한통운' },
  lotte: { code: '08', name: '롯데택배' },
  hanjin: { code: '05', name: '한진택배' },
  post: { code: '01', name: '우체국택배' },
  logen: { code: '06', name: '로젠택배' },
  cu: { code: '20', name: 'CU편의점택배' },
  gs: { code: '24', name: 'GS편의점택배' },
  kdexp: { code: '23', name: '경동택배' },
  daesin: { code: '22', name: '대신택배' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const carrierCode = searchParams.get('carrier'); // 택배사 코드 (04, 08 등)
  const trackingNumber = searchParams.get('tracking'); // 운송장 번호

  if (!carrierCode || !trackingNumber) {
    return NextResponse.json(
      { error: '택배사 코드(carrier)와 운송장 번호(tracking)가 필요합니다' },
      { status: 400 }
    );
  }

  // API Key가 없으면 Mock 데이터 반환
  if (!SWEET_TRACKER_API_KEY) {
    return NextResponse.json({
      success: true,
      data: getMockTrackingData(trackingNumber, carrierCode),
    });
  }

  try {
    const res = await fetch(
      `${SWEET_TRACKER_BASE}/trackingInfo?t_key=${SWEET_TRACKER_API_KEY}&t_code=${carrierCode}&t_invoice=${trackingNumber}`,
      { next: { revalidate: 300 } } // 5분 캐시
    );

    if (!res.ok) {
      throw new Error(`Sweet Tracker API error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: {
        carrier: data.carrierName || CARRIER_CODES[carrierCode]?.name || carrierCode,
        trackingNumber,
        status: mapStatus(data.level),
        statusText: data.lastStateDetail?.text || '',
        estimatedDelivery: data.estimate || null,
        trackingDetails: (data.trackingDetails || []).map((d: { timeString: string; where: string; kind: string; telno: string }) => ({
          time: d.timeString,
          location: d.where,
          description: d.kind,
          phone: d.telno,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '배송 추적 정보를 조회할 수 없습니다' },
      { status: 500 }
    );
  }
}

function mapStatus(level: number): string {
  switch (level) {
    case 1: return 'preparing';
    case 2: return 'picked_up';
    case 3: return 'in_transit';
    case 4: return 'out_for_delivery';
    case 5: return 'delivered';
    case 6: return 'delivered';
    default: return 'unknown';
  }
}

// Mock 배송 추적 데이터 (API Key 없을 때)
function getMockTrackingData(trackingNumber: string, carrierCode: string) {
  const carrier = Object.values(CARRIER_CODES).find((c) => c.code === carrierCode);
  return {
    carrier: carrier?.name || 'CJ대한통운',
    trackingNumber,
    status: 'in_transit',
    statusText: '배송 중',
    estimatedDelivery: '2026-03-22',
    trackingDetails: [
      { time: '2026-03-20 09:30', location: '서울 송파 집하점', description: '배송 출발', phone: '' },
      { time: '2026-03-20 07:15', location: '옥천 HUB', description: '간선 상차', phone: '' },
      { time: '2026-03-19 22:40', location: '옥천 HUB', description: '간선 하차', phone: '' },
      { time: '2026-03-19 18:30', location: '대전 대덕 집하점', description: '집하 완료', phone: '' },
      { time: '2026-03-19 16:00', location: '(주)지누켐', description: '상품 인수', phone: '070-8027-2696' },
    ],
  };
}
