// src/screens/RemainingScreens.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, R } from '../theme';
import { Card, SectionTitle, Badge, Btn, AIPanel, RowItem } from '../components';
import {
  generateMarketingCopy,
  generateDetailPage,
  analyzeUploadURL,
} from '../services/claudeApi';

// ─── MARKETING ───────────────────────────────────────────
const KEYWORDS = [
  { kw: '무선충전기 아이폰',  vol: 42800, comp: '중',  trend: 8  },
  { kw: '멀티충전기 거치대',  vol: 31200, comp: '낮음', trend: 15 },
  { kw: '캔들 선물세트',      vol: 28900, comp: '높음', trend: -2 },
  { kw: '요가매트 추천',      vol: 67400, comp: '높음', trend: 22 },
  { kw: '제습기 소형',        vol: 19300, comp: '중',   trend: -5 },
];

export function MarketingScreen() {
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    const r = await generateMarketingCopy(aiInput);
    setAiResult(r);
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <AIPanel
          title="AI 마케팅 카피 생성"
          placeholder="상품명 또는 이벤트를 입력하세요"
          onGenerate={handleGen} result={aiResult} loading={loading}
          value={aiInput} onChangeText={setAiInput}
        />
        <Card style={{ padding: 16 }}>
          <SectionTitle>🔥 인기 키워드</SectionTitle>
          {KEYWORDS.map((k, i) => (
            <View key={i} style={ms.kwRow}>
              <View style={{ flex: 1 }}>
                <Text style={ms.kwText}>{k.kw}</Text>
                <Text style={ms.kwVol}>{k.vol.toLocaleString()} 검색/월</Text>
              </View>
              <Text style={[ms.kwComp, { color: k.comp === '낮음' ? C.green : k.comp === '중' ? C.orange : C.red }]}>{k.comp}</Text>
              <Text style={[ms.kwTrend, { color: k.trend > 0 ? C.green : C.red }]}>{k.trend > 0 ? '+' : ''}{k.trend}%</Text>
            </View>
          ))}
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle>📊 광고 성과</SectionTitle>
          <RowItem label="노출수"  value="284,932"      valueColor={C.blue}   />
          <RowItem label="클릭수"  value="4,721"        valueColor={C.green}  />
          <RowItem label="전환율"  value="3.2%"         valueColor={C.orange} />
          <RowItem label="ROAS"    value="380%"         valueColor={C.green}  />
          <RowItem label="광고비"  value="1,420,000원"  valueColor={C.red}    />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const ms = StyleSheet.create({
  kwRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  kwText: { fontSize: F.sm, fontWeight: '600', color: C.text },
  kwVol:  { fontSize: F.xs, color: C.muted, marginTop: 2 },
  kwComp: { fontSize: F.xs, fontWeight: '600' },
  kwTrend:{ fontSize: F.sm, fontWeight: '700', width: 40, textAlign: 'right' },
});

// ─── ANALYTICS ───────────────────────────────────────────
export function AnalyticsScreen() {
  const tops: [string, number, string][] = [
    ['무선 충전기 3in1 거치대', 82, '4,820,000'],
    ['고탄력 요가매트 8mm',     71, '3,280,000'],
    ['감성 캔들 홈세트 3종',    63, '2,110,000'],
    ['미니 제습기 500ml',       55, '1,790,000'],
    ['스탠딩 책상 정리함',      42,   '980,000'],
  ];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={as.kpiRow}>
          {[['총매출', '124,800,000원', C.text], ['마진율', '38.2%', C.green], ['ROAS', '380%', C.blue]].map(([l, v, c]: any, i) => (
            <Card key={i} style={as.kpiCard}>
              <Text style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>{l}</Text>
              <Text style={{ fontSize: F.md, fontWeight: '800', color: c }}>{v}</Text>
            </Card>
          ))}
        </View>
        <Card style={{ padding: 16 }}>
          <SectionTitle>잘 팔리는 상품 TOP 5</SectionTitle>
          {tops.map(([name, pct, amt], i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: F.xs, color: C.sub }}>{i + 1}. {name}</Text>
                <Text style={{ fontSize: F.xs, color: C.blue, fontWeight: '600' }}>{amt}원</Text>
              </View>
              <View style={{ height: 5, backgroundColor: C.card, borderRadius: 99 }}>
                <View style={{ height: '100%', borderRadius: 99, width: `${pct}%`, backgroundColor: i === 0 ? C.accent : C.green } as any} />
              </View>
            </View>
          ))}
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle>마진 구성</SectionTitle>
          <RowItem label="총 매출"       value="124,800,000원" valueColor={C.text}   />
          <RowItem label="원가 합계"     value="-65,200,000원" valueColor={C.red}    />
          <RowItem label="광고비"        value="-8,400,000원"  valueColor={C.orange} />
          <RowItem label="플랫폼 수수료" value="-5,700,000원"  valueColor={C.muted}  />
          <RowItem label="순이익"        value="45,500,000원"  valueColor={C.green}  />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const as = StyleSheet.create({
  kpiRow:  { flexDirection: 'row', gap: 8, marginBottom: 12 },
  kpiCard: { flex: 1, padding: 14 },
});

// ─── DETAIL PAGE ─────────────────────────────────────────
export function DetailPageScreen() {
  const [product, setProduct]   = useState('');
  const [features, setFeatures] = useState('');
  const [target, setTarget]     = useState('일반 소비자');
  const [result, setResult]     = useState('');
  const [loading, setLoading]   = useState(false);
  const targets = ['일반 소비자', '직장인', '주부', '운동 마니아', '선물 구매자'];

  const gen = async () => {
    if (!product.trim()) return;
    setLoading(true);
    const r = await generateDetailPage(product, features, target);
    setResult(r);
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <SectionTitle>✦ AI 상세페이지 생성</SectionTitle>
          <Text style={{ fontSize: F.xs, color: C.muted, marginBottom: 14 }}>상품 정보 입력 → 전환율 높은 상세페이지 즉시 생성</Text>
          <Text style={dp.label}>상품명 *</Text>
          <TextInput value={product} onChangeText={setProduct} placeholder="예: 3단 접이식 요가매트 6mm"
            placeholderTextColor={C.muted} style={dp.input} />
          <Text style={dp.label}>주요 특징</Text>
          <TextInput value={features} onChangeText={setFeatures} placeholder="예: 친환경 TPE, 두께 6mm, 케이스 포함"
            placeholderTextColor={C.muted} multiline style={[dp.input, { minHeight: 60 }]} />
          <Text style={dp.label}>타겟 고객</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {targets.map(t => (
              <TouchableOpacity key={t} onPress={() => setTarget(t)} style={[dp.tChip, target === t && dp.tChipOn]}>
                <Text style={[dp.tChipTxt, target === t && { color: C.accent }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Btn accent onPress={gen} disabled={loading} style={{ justifyContent: 'center', paddingVertical: 13 }}>
            {loading ? '⏳ 생성중...' : '⚡ 상세페이지 생성'}
          </Btn>
        </Card>
        {!!result && (
          <Card style={{ padding: 16 }}>
            <SectionTitle>생성 결과</SectionTitle>
            <Text style={{ fontSize: F.sm, color: C.sub, lineHeight: 22 }}>{result}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const dp = StyleSheet.create({
  label:    { fontSize: F.xs, color: C.muted, fontWeight: '600', marginBottom: 6 },
  input:    { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, padding: 12, fontSize: F.sm, color: C.text, marginBottom: 12 },
  tChip:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  tChipOn:  { backgroundColor: 'rgba(108,99,255,0.15)', borderColor: C.accent },
  tChipTxt: { fontSize: F.xs, color: C.sub },
});

// ─── PRICE CALC ──────────────────────────────────────────
export function PriceCalcScreen() {
  const [cost, setCost]         = useState(15000);
  const [margin, setMargin]     = useState(40);
  const [fee, setFee]           = useState(3.3);
  const [delivery, setDelivery] = useState(3000);
  const [ad, setAd]             = useState(500);

  const totalCost  = cost + delivery + ad;
  const sellPrice  = Math.round(totalCost / (1 - (margin + fee) / 100) / 100) * 100;
  const profit     = sellPrice - totalCost - sellPrice * fee / 100;
  const realMargin = sellPrice > 0 ? (profit / sellPrice * 100).toFixed(1) : '0';

  const Field = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={pc.label}>{label}</Text>
      <TextInput value={String(value)} onChangeText={t => onChange(Number(t) || 0)}
        keyboardType="numeric" style={pc.input} placeholderTextColor={C.muted} />
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <Card style={{ padding: 16 }}>
          <SectionTitle>입력값</SectionTitle>
          <Field label="원가 (매입가) 원"  value={cost}     onChange={setCost}     />
          <Field label="목표 마진율 %"      value={margin}   onChange={setMargin}   />
          <Field label="플랫폼 수수료 %"    value={fee}      onChange={setFee}      />
          <Field label="배송비 부담 원"     value={delivery} onChange={setDelivery} />
          <Field label="광고비 (건당) 원"   value={ad}       onChange={setAd}       />
        </Card>
        <Card style={{ padding: 16, borderColor: 'rgba(108,99,255,0.4)' }}>
          <Text style={{ fontSize: F.xs, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>권장 판매가</Text>
          <Text style={{ fontSize: 38, fontWeight: '900', color: C.accent, letterSpacing: -2, marginBottom: 16 }}>{sellPrice.toLocaleString()}원</Text>
          {[
            ['총 원가',       totalCost.toLocaleString() + '원',       C.text  ],
            ['플랫폼 수수료', Math.round(sellPrice * fee / 100).toLocaleString() + '원', C.red],
            ['순수익 (건당)', Math.round(profit).toLocaleString() + '원', C.green],
            ['실제 마진율',   realMargin + '%',                          C.green ],
          ].map(([l, v, c]: any, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border }}>
              <Text style={{ fontSize: F.sm, color: C.muted }}>{l}</Text>
              <Text style={{ fontSize: F.md, fontWeight: '700', color: c }}>{v}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const pc = StyleSheet.create({
  label: { fontSize: F.xs, color: C.muted, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, padding: 12, fontSize: F.md, color: C.text, fontWeight: '700' },
});

// ─── AUTO UPLOAD ─────────────────────────────────────────
export function AutoUploadScreen() {
  const [step, setStep]       = useState(1);
  const [url, setUrl]         = useState('');
  const [margin, setMargin]   = useState(40);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const r = await analyzeUploadURL(url, margin);
    setResult(r);
    setLoading(false);
    setStep(2);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          {[['1', 'URL 입력'], ['2', '확인'], ['3', '업로드']].map(([n, l], i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[au.stepDot, step > i ? { backgroundColor: C.green } : step === i + 1 ? { backgroundColor: C.accent } : { backgroundColor: C.card }]}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: step >= i + 1 ? '#fff' : C.muted }}>{step > i ? '✓' : n}</Text>
              </View>
              <Text style={{ fontSize: F.xs, color: step === i + 1 ? C.text : C.muted, marginRight: 4 }}> {l}</Text>
              {i < 2 && <Text style={{ color: C.muted, marginRight: 4 }}>›</Text>}
            </View>
          ))}
        </View>

        {step === 1 && (
          <Card style={{ padding: 18 }}>
            <SectionTitle>도매 사이트 URL 입력</SectionTitle>
            <Text style={{ fontSize: F.xs, color: C.muted, marginBottom: 14 }}>오너클랜, 도매꾹, 도매매 URL을 입력하면 AI가 자동 분석합니다</Text>
            <Text style={au.label}>도매 상품 URL</Text>
            <TextInput value={url} onChangeText={setUrl} placeholder="https://www.ownerclan.com/..."
              placeholderTextColor={C.muted} style={au.input} />
            <Text style={au.label}>목표 마진율: <Text style={{ color: C.accent, fontWeight: '700' }}>{margin}%</Text></Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {[20, 30, 40, 50, 60].map(v => (
                <TouchableOpacity key={v} onPress={() => setMargin(v)} style={[au.marginChip, margin === v && au.marginChipOn]}>
                  <Text style={[au.marginChipTxt, margin === v && { color: C.accent }]}>{v}%</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Btn accent onPress={analyze} disabled={loading} style={{ justifyContent: 'center', paddingVertical: 13 }}>
              {loading ? '⏳ AI 분석중...' : '⚡ 자동 분석 시작'}
            </Btn>
          </Card>
        )}

        {step === 2 && result && (
          <>
            <Card style={{ padding: 16 }}>
              <SectionTitle>AI 분석 결과</SectionTitle>
              {[
                ['최적화 상품명', result.optimized_name],
                ['카테고리',     result.category],
                ['원가',         result.cost?.toLocaleString() + '원'],
                ['판매가 (' + margin + '% 마진)', result.sell_price?.toLocaleString() + '원'],
                ['상품 설명',    result.short_desc],
              ].map(([l, v], i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: F.xs, color: C.muted, marginBottom: 4 }}>{l}</Text>
                  <View style={{ padding: 10, backgroundColor: C.bg, borderRadius: R.sm, borderWidth: 1, borderColor: i === 3 ? 'rgba(0,214,143,0.4)' : C.border }}>
                    <Text style={{ fontSize: F.sm, color: i === 3 ? C.green : C.text, fontWeight: i === 3 ? '700' : '400' }}>{v}</Text>
                  </View>
                </View>
              ))}
            </Card>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn onPress={() => { setStep(1); setUrl(''); setResult(null); }} style={{ flex: 1, justifyContent: 'center' }}>← 다시 입력</Btn>
              <Btn accent onPress={() => setStep(3)} style={{ flex: 2, justifyContent: 'center', paddingVertical: 13 }}>✓ 스마트스토어 업로드</Btn>
            </View>
          </>
        )}

        {step === 3 && (
          <Card style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>✅</Text>
            <Text style={{ fontSize: F.xl, fontWeight: '800', color: C.text, marginBottom: 8 }}>업로드 완료!</Text>
            <Text style={{ fontSize: F.sm, color: C.muted, marginBottom: 24, textAlign: 'center' }}>상품이 스마트스토어에 성공적으로 등록되었습니다</Text>
            <Btn accent onPress={() => { setStep(1); setUrl(''); setResult(null); }}>새 상품 업로드</Btn>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const au = StyleSheet.create({
  stepDot:      { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  label:        { fontSize: F.xs, color: C.muted, fontWeight: '600', marginBottom: 6 },
  input:        { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, padding: 12, fontSize: F.sm, color: C.text, marginBottom: 14 },
  marginChip:   { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  marginChipOn: { backgroundColor: 'rgba(108,99,255,0.15)', borderColor: C.accent },
  marginChipTxt:{ fontSize: F.sm, color: C.sub, fontWeight: '600' },
});

// ─── ACCOUNTS ────────────────────────────────────────────
const ACCOUNTS = [
  { name: '셀리랩_홈리빙',   sales: 8230, products: 142, orders: 312, status: '정상',  color: C.green  },
  { name: '셀리랩_전자기기', sales: 3140, products: 67,  orders: 118, status: '정상',  color: C.blue   },
  { name: '셀리랩_스포츠',   sales: 1110, products: 23,  orders: 44,  status: '점검중', color: C.orange },
];

export function AccountsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <Btn accent style={{ marginBottom: 14, justifyContent: 'center' }}>+ 스토어 연결</Btn>
        {ACCOUNTS.map((a, i) => (
          <Card key={i} style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: a.color + '22', borderWidth: 1, borderColor: a.color + '44', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: a.color, fontWeight: '800' }}>S</Text>
                </View>
                <View>
                  <Text style={{ fontSize: F.md, fontWeight: '700', color: C.text }}>{a.name}</Text>
                  <Text style={{ fontSize: F.xs, color: C.muted }}>스마트스토어</Text>
                </View>
              </View>
              <Badge status={a.status} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {[['월 매출', a.sales + '만원'], ['상품수', a.products + '개'], ['주문수', a.orders + '건']].map(([l, v], j) => (
                <View key={j} style={{ flex: 1, backgroundColor: C.bg, borderRadius: R.sm, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{l}</Text>
                  <Text style={{ fontSize: F.sm, fontWeight: '700', color: C.text }}>{v}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={{ paddingVertical: 9, backgroundColor: C.bg, borderRadius: R.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
              <Text style={{ fontSize: F.sm, color: C.sub, fontWeight: '600' }}>관리하기 →</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SETTINGS ────────────────────────────────────────────
export function SettingsScreen() {
  const [autoReply,   setAutoReply]   = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [notify,      setNotify]      = useState(true);
  const [marginDef,   setMarginDef]   = useState('40');

  const ToggleRow = ({ label, desc, value, onChange }: any) => (
    <View style={st.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: F.sm, fontWeight: '600', color: C.text }}>{label}</Text>
        <Text style={{ fontSize: F.xs, color: C.muted, marginTop: 2 }}>{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onChange}
        trackColor={{ false: C.card, true: 'rgba(108,99,255,0.4)' }}
        thumbColor={value ? C.accent : C.muted} />
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content}>
        <Card style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>김</Text>
            </View>
            <View>
              <Text style={{ fontSize: F.md, fontWeight: '700', color: C.text }}>김셀러</Text>
              <Text style={{ fontSize: F.xs, color: C.muted }}>pro@sellylab.io</Text>
              <Text style={{ fontSize: F.xs, color: C.accent, fontWeight: '700', marginTop: 2 }}>PRO 플랜</Text>
            </View>
          </View>
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle>자동화 설정</SectionTitle>
          <ToggleRow label="고객문의 AI 자동답변" desc="유사 문의 감지 시 자동으로 답변 초안 생성" value={autoReply}   onChange={setAutoReply}   />
          <ToggleRow label="송장번호 자동입력"     desc="결제완료 주문에 택배사 API 연동 자동 처리" value={autoInvoice} onChange={setAutoInvoice} />
          <ToggleRow label="실시간 알림"           desc="신규 주문, 문의, 재고부족 즉시 알림"       value={notify}      onChange={setNotify}      />
        </Card>
        <Card style={{ padding: 16 }}>
          <SectionTitle>기본 설정</SectionTitle>
          <Text style={{ fontSize: F.xs, color: C.muted, marginBottom: 6, fontWeight: '600' }}>기본 마진율 (%)</Text>
          <TextInput value={marginDef} onChangeText={setMarginDef} keyboardType="numeric"
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, padding: 12, fontSize: F.sm, color: C.text, marginBottom: 14 }} />
          <Text style={{ fontSize: F.xs, color: C.muted, marginBottom: 6, fontWeight: '600' }}>AI 답변 브랜드명</Text>
          <TextInput defaultValue="셀리랩"
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, padding: 12, fontSize: F.sm, color: C.text, marginBottom: 16 }} />
          <Btn accent style={{ justifyContent: 'center' }}>설정 저장</Btn>
        </Card>
        <Card style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: F.xs, color: C.muted }}>셀리랩 v1.0.0 · Powered by Claude AI</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border, gap: 12 },
});

// ─── SHARED ──────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
});
