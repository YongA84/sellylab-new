// src/screens/DashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, R } from '../theme';
import { Card, SectionTitle, StatCard, Badge } from '../components';

const STATS = [
  { label: '오늘 매출',   value: '4,820,000', unit: '원', change: '+12.4%', up: true,  icon: '💰' },
  { label: '신규 주문',   value: '138',        unit: '건', change: '+8건',   up: true,  icon: '📦' },
  { label: '미처리 문의', value: '7',          unit: '건', change: '-3건',   up: false, icon: '💬' },
  { label: '이번달 마진', value: '38.2',       unit: '%',  change: '+1.8%',  up: true,  icon: '📈' },
];

const QUICK = [
  { label: '판매중 상품',   value: '142개', color: C.blue   },
  { label: '오늘 신규 주문', value: '23건', color: C.green  },
  { label: '배송 준비중',   value: '41건',  color: C.orange },
  { label: '미처리 CS',     value: '7건',   color: C.red    },
  { label: '재고부족 상품', value: '3개',   color: C.orange },
];

const RECENT_ORDERS = [
  { id: '#98231', product: '무선 충전기 3in1 거치대', buyer: '김*수', status: '배송중',   amt: '32,900' },
  { id: '#98230', product: '감성 캔들 홈세트 3종',   buyer: '이*현', status: '결제완료', amt: '24,500' },
  { id: '#98229', product: '고탄력 요가매트 8mm',    buyer: '박*영', status: '배송중',   amt: '41,000' },
  { id: '#98228', product: '미니 제습기 500ml',      buyer: '최*진', status: '배송완료', amt: '29,800' },
];

const CHART = [28,42,35,58,47,63,55,71,66,82,74,91];
const MONTHS = ['1','2','3','4','5','6','7','8','9','10','11','12'];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>안녕하세요, 김셀러 👋</Text>
            <Text style={s.timeText}>
              {time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
            </Text>
          </View>
          <View style={s.liveChip}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>실시간</Text>
          </View>
        </View>

        {/* Stats — 2×2 grid */}
        <View style={s.statsGrid}>
          {STATS.map((st, i) => (
            <View key={i} style={s.statWrap}>
              <StatCard {...st} />
            </View>
          ))}
        </View>

        {/* Mini bar chart */}
        <Card style={{ padding: 16 }}>
          <SectionTitle>월별 매출 추이</SectionTitle>
          <View style={s.chart}>
            {CHART.map((v, i) => (
              <View key={i} style={s.barWrap}>
                <View style={[
                  s.bar,
                  { height: (v / 100) * 90,
                    backgroundColor: i === 11 ? C.accent : 'rgba(108,99,255,0.2)' },
                ]} />
                <Text style={s.barLabel}>{MONTHS[i]}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick status */}
        <Card style={{ padding: 16 }}>
          <SectionTitle>빠른 현황</SectionTitle>
          {QUICK.map((q, i) => (
            <TouchableOpacity key={i} activeOpacity={0.7} style={s.quickRow}>
              <Text style={s.quickLabel}>{q.label}</Text>
              <Text style={[s.quickValue, { color: q.color }]}>{q.value}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Recent orders */}
        <Card style={{ padding: 16 }}>
          <SectionTitle>최근 주문</SectionTitle>
          {RECENT_ORDERS.map((o, i) => (
            <View key={i} style={[s.orderRow, i < RECENT_ORDERS.length - 1 && s.orderBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={s.orderProduct} numberOfLines={1}>{o.product}</Text>
                <Text style={s.orderMeta}>{o.buyer} · {o.id}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={s.orderAmt}>{o.amt}원</Text>
                <Badge status={o.status} />
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  scroll:     { flex: 1 },
  content:    { padding: 16, paddingBottom: 32 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting:   { fontSize: F.lg, fontWeight: '800', color: C.text },
  timeText:   { fontSize: F.xs, color: C.muted, marginTop: 2 },
  liveChip:   { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(0,214,143,0.1)', borderRadius: 99, borderWidth: 1, borderColor: 'rgba(0,214,143,0.3)' },
  liveDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  liveText:   { fontSize: F.xs, color: C.green, fontWeight: '600' },
  statsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statWrap:   { width: '48%' },
  chart:      { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4, marginTop: 8 },
  barWrap:    { flex: 1, alignItems: 'center', gap: 3 },
  bar:        { width: '100%', borderRadius: 3 },
  barLabel:   { fontSize: 7, color: C.muted },
  quickRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  quickLabel: { fontSize: F.sm, color: C.sub },
  quickValue: { fontSize: F.md, fontWeight: '700' },
  orderRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  orderBorder:{ borderBottomWidth: 1, borderBottomColor: C.border },
  orderProduct:{ fontSize: F.sm, fontWeight: '600', color: C.text, maxWidth: 200 },
  orderMeta:  { fontSize: F.xs, color: C.muted, marginTop: 2 },
  orderAmt:   { fontSize: F.sm, fontWeight: '700', color: C.text },
});
