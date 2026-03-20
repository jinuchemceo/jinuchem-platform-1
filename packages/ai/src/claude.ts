// ================================================================
// Claude API 클라이언트 — JINUCHEM AI 엔진 기반
// ================================================================

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.AI_MODEL || 'claude-sonnet-4-20250514';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Claude API 호출 래퍼
 */
export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: options?.maxTokens ?? 2048,
    temperature: options?.temperature ?? 0.3,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock?.text ?? '';
}

/**
 * JSON 응답을 파싱하는 Claude 호출
 */
export async function callClaudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<T> {
  const response = await callClaude(
    systemPrompt + '\n\n응답은 반드시 유효한 JSON 형식으로만 출력하세요. 다른 텍스트 없이 JSON만 출력하세요.',
    userMessage,
    options
  );

  // JSON 블록 추출 (```json ... ``` 또는 순수 JSON)
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!jsonMatch) {
    throw new Error('AI 응답에서 JSON을 파싱할 수 없습니다.');
  }

  return JSON.parse(jsonMatch[1]) as T;
}

export { client, MODEL };
