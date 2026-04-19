// src/services/claudeApi.ts — Anthropic API 호출 서비스

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

export async function callClaude(prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? '오류가 발생했습니다.';
}

// ── 기능별 프롬프트 ──────────────────────────────

export async function generateSEO(product: string): Promise<string> {
  return callClaude(
    `네이버 스마트스토어 SEO 최적화 전문가로서 다음 상품의 정보를 생성해줘.\n` +
    `상품: ${product}\n\n` +
    `[SEO 최적화 상품명 3개]\n` +
    `[추천 키워드 10개] (쉼표 구분)\n` +
    `[상품 설명 150자]\n` +
    `[해시태그 5개]`
  );
}

export async function generateCSReply(inquiry: string, type: string): Promise<string> {
  return callClaude(
    `스마트스토어 셀러 고객센터 담당자로서 친절하고 전문적으로 답변해줘.\n` +
    `문의 유형: ${type}\n` +
    `고객 문의: "${inquiry}"\n\n` +
    `조건: 이모지 1~2개, 4~5문장, 실질적 해결책 포함, 브랜드명 "셀리랩" 사용`
  );
}

export async function generateDetailPage(
  product: string,
  features: string,
  target: string
): Promise<string> {
  return callClaude(
    `네이버 스마트스토어 상세페이지 카피라이터로서 작성해줘.\n` +
    `상품명: ${product}\n` +
    `특징: ${features}\n` +
    `타겟: ${target}\n\n` +
    `🎯 [메인 히어로 카피] 20자 이내\n` +
    `✨ [핵심 특징 4가지] 이모지+제목+설명\n` +
    `🏆 [구매 이유 3가지]\n` +
    `⚡ [한정 구매 유도 문구]`
  );
}

export async function generateMarketingCopy(topic: string): Promise<string> {
  return callClaude(
    `스마트스토어 마케팅 전문가로서 다음 주제의 카피를 작성해줘.\n` +
    `주제: ${topic}\n\n` +
    `1. 메인 광고 카피 (20자 이내)\n` +
    `2. 서브 카피 3개 (각 40자)\n` +
    `3. 할인 이벤트 문구 (긴급성 포함)\n` +
    `4. 인스타그램 홍보 문구 (해시태그 포함)`
  );
}

export async function analyzeUploadURL(
  url: string,
  margin: number
): Promise<{
  optimized_name: string;
  cost: number;
  sell_price: number;
  category: string;
  keywords: string[];
  short_desc: string;
}> {
  const text = await callClaude(
    `도매 상품을 스마트스토어에 등록할 준비를 해줘.\n` +
    `URL: ${url}\n목표 마진율: ${margin}%\n\n` +
    `JSON만 출력 (다른 텍스트 없이):\n` +
    `{"optimized_name":"","cost":15000,"sell_price":0,"category":"","keywords":[],"short_desc":""}`
  );
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    const cost = parsed.cost || 15000;
    parsed.sell_price = Math.round((cost / (1 - margin / 100)) / 100) * 100;
    return parsed;
  } catch {
    return {
      optimized_name: '파싱 오류 — 직접 입력해주세요',
      cost: 15000, sell_price: 25000,
      category: '기타', keywords: [], short_desc: '',
    };
  }
}
