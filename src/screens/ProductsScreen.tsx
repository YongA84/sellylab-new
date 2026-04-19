// src/screens/ProductsScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, R } from '../theme';
import { Card, SectionTitle, Badge, Btn, AIPanel } from '../components';
import { generateSEO } from '../services/claudeApi';

const PRODUCTS = [
  { id:1, name:'무선 충전기 3in1 거치대',  cat:'전자기기',    cost:14000, sell:32900, margin:57, stock:240, status:'판매중'  },
  { id:2, name:'감성 캔들 홈세트 3종',     cat:'생활/인테리어',cost:8500, sell:24500, margin:65, stock:88,  status:'판매중'  },
  { id:3, name:'고탄력 요가매트 8mm',      cat:'스포츠',      cost:18000, sell:41000, margin:56, stock:12,  status:'재고부족'},
  { id:4, name:'미니 제습기 500ml',        cat:'가전',        cost:13200, sell:29800, margin:55, stock:0,   status:'품절'   },
  { id:5, name:'스탠딩 책상 정리함',       cat:'사무용품',    cost:7800,  sell:18200, margin:57, stock:334, status:'판매중'  },
  { id:6, name:'스테인레스 텀블러 500ml',  cat:'주방',        cost:9200,  sell:22000, margin:58, stock:156, status:'판매중'  },
];

export default function ProductsScreen() {
  const [search, setSearch]   = useState('');
  const [showAI, setShowAI]   = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]   = useState('전체');

  const filtered = PRODUCTS.filter(p =>
    (filter === '전체' || p.status === filter) &&
    (p.name.includes(search) || p.cat.includes(search))
  );

  const handleGenerate = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    const res = await generateSEO(aiInput);
    setAiResult(res);
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Search */}
        <View style={s.searchRow}>
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder="🔍 상품명, 카테고리 검색..."
            placeholderTextColor={C.muted}
            style={s.search}
          />
          <Btn accent onPress={() => setShowAI(!showAI)}>⚡ AI</Btn>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {['전체','판매중','재고부족','품절'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && s.chipActive]}>
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Panel */}
        {showAI && (
          <AIPanel
            title="AI SEO 상품명/키워드 생성"
            placeholder="상품을 설명해주세요 (예: 아이폰용 무선충전 거치대 3단 높이조절)"
            onGenerate={handleGenerate}
            result={aiResult}
            loading={loading}
            value={aiInput}
            onChangeText={setAiInput}
          />
        )}

        {/* Summary */}
        <Text style={s.countText}>총 {filtered.length}개 상품</Text>

        {/* Product cards */}
        {filtered.map(p => (
          <Card key={p.id} style={s.productCard}>
            <View style={s.productHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.productName}>{p.name}</Text>
                <Text style={s.productCat}>{p.cat}</Text>
              </View>
              <Badge status={p.status} />
            </View>

            <View style={s.productStats}>
              <View style={s.pStat}>
                <Text style={s.pStatLabel}>원가</Text>
                <Text style={s.pStatValue}>{p.cost.toLocaleString()}원</Text>
              </View>
              <View style={s.pStat}>
                <Text style={s.pStatLabel}>판매가</Text>
                <Text style={[s.pStatValue, { color: C.text, fontWeight: '800' }]}>{p.sell.toLocaleString()}원</Text>
              </View>
              <View style={s.pStat}>
                <Text style={s.pStatLabel}>마진율</Text>
                <Text style={[s.pStatValue, { color: p.margin >= 60 ? C.green : p.margin >= 50 ? C.orange : C.red, fontWeight: '800' }]}>{p.margin}%</Text>
              </View>
              <View style={s.pStat}>
                <Text style={s.pStatLabel}>재고</Text>
                <Text style={[s.pStatValue, { color: p.stock === 0 ? C.red : p.stock < 20 ? C.orange : C.sub }]}>{p.stock}개</Text>
              </View>
            </View>

            <View style={s.productActions}>
              <TouchableOpacity style={s.actionBtn}><Text style={s.actionText}>수정</Text></TouchableOpacity>
              <TouchableOpacity style={s.actionBtn}><Text style={s.actionText}>복사</Text></TouchableOpacity>
              <TouchableOpacity style={s.actionBtn}><Text style={s.actionText}>삭제</Text></TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} activeOpacity={0.85}>
        <Text style={s.fabText}>+ 상품 등록</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: C.bg },
  scroll:   { flex: 1 },
  content:  { padding: 16, paddingBottom: 90 },
  searchRow:{ flexDirection: 'row', gap: 8, marginBottom: 10 },
  search:   { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: F.sm, color: C.text },
  chip:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, marginRight: 8 },
  chipActive:{ backgroundColor: 'rgba(108,99,255,0.15)', borderColor: C.accent },
  chipText: { fontSize: F.xs, color: C.sub, fontWeight: '500' },
  chipTextActive: { color: C.accent, fontWeight: '700' },
  countText:{ fontSize: F.xs, color: C.muted, marginBottom: 10 },
  productCard:  { padding: 16 },
  productHeader:{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  productName:  { fontSize: F.md, fontWeight: '700', color: C.text, marginBottom: 3 },
  productCat:   { fontSize: F.xs, color: C.muted },
  productStats: { flexDirection: 'row', backgroundColor: C.bg, borderRadius: R.sm, padding: 10, marginBottom: 10 },
  pStat:        { flex: 1, alignItems: 'center' },
  pStatLabel:   { fontSize: 10, color: C.muted, marginBottom: 4 },
  pStatValue:   { fontSize: F.sm, fontWeight: '600', color: C.sub },
  productActions:{ flexDirection: 'row', gap: 8 },
  actionBtn:    { flex: 1, paddingVertical: 7, backgroundColor: C.bg, borderRadius: R.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  actionText:   { fontSize: F.xs, color: C.sub, fontWeight: '600' },
  fab:      { position: 'absolute', bottom: 24, right: 16, left: 16, backgroundColor: C.accent, borderRadius: R.md, paddingVertical: 14, alignItems: 'center' },
  fabText:  { fontSize: F.md, fontWeight: '800', color: '#fff' },
});
