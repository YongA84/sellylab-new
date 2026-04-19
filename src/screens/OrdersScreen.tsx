// src/screens/OrdersScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, R } from '../theme';
import { Card, SectionTitle, Badge, Btn } from '../components';

const ORDERS = [
  { id:'#98231', product:'무선 충전기 3in1 거치대', buyer:'김*수', status:'배송중',   amt:'32,900', courier:'CJ대한통운', invoice:'581234567890' },
  { id:'#98230', product:'감성 캔들 홈세트 3종',   buyer:'이*현', status:'결제완료', amt:'24,500', courier:'한진택배',    invoice:'-' },
  { id:'#98229', product:'고탄력 요가매트 8mm',    buyer:'박*영', status:'배송중',   amt:'41,000', courier:'CJ대한통운', invoice:'581234567891' },
  { id:'#98228', product:'미니 제습기 500ml',      buyer:'최*진', status:'배송완료', amt:'29,800', courier:'롯데택배',    invoice:'360123456789' },
  { id:'#98227', product:'스탠딩 책상 정리함',     buyer:'정*아', status:'결제완료', amt:'18,200', courier:'-',          invoice:'-' },
  { id:'#98226', product:'스테인레스 텀블러',      buyer:'윤*호', status:'취소',     amt:'22,000', courier:'-',          invoice:'-' },
];

const SUMMARY = [
  { label:'신규주문', value:'23', color:C.blue   },
  { label:'배송준비', value:'41', color:C.orange  },
  { label:'배송중',   value:'74', color:C.green   },
  { label:'완료',     value:'312',color:C.muted   },
];

export default function OrdersScreen() {
  const [filter, setFilter] = useState('전체');
  const filters = ['전체','결제완료','배송중','배송완료','취소'];
  const filtered = filter === '전체' ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Summary */}
        <View style={s.summaryRow}>
          {SUMMARY.map((sm,i) => (
            <View key={i} style={s.summaryCard}>
              <Text style={s.summaryLabel}>{sm.label}</Text>
              <Text style={[s.summaryValue, { color: sm.color }]}>{sm.value}</Text>
            </View>
          ))}
        </View>

        {/* Toolbar */}
        <View style={s.toolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(f => (
              <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter===f && s.chipOn]}>
                <Text style={[s.chipTxt, filter===f && s.chipTxtOn]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Btn accent style={{ marginBottom: 12 }}>🚚 송장번호 일괄입력</Btn>

        {filtered.map((o, i) => (
          <Card key={i} style={s.orderCard}>
            <View style={s.orderTop}>
              <Text style={s.orderId}>{o.id}</Text>
              <Badge status={o.status} />
            </View>
            <Text style={s.orderProduct}>{o.product}</Text>
            <View style={s.orderMeta}>
              <View style={s.metaItem}><Text style={s.metaLabel}>구매자</Text><Text style={s.metaValue}>{o.buyer}</Text></View>
              <View style={s.metaItem}><Text style={s.metaLabel}>금액</Text><Text style={[s.metaValue,{color:C.text,fontWeight:'700'}]}>{o.amt}원</Text></View>
              <View style={s.metaItem}><Text style={s.metaLabel}>택배</Text><Text style={s.metaValue}>{o.courier}</Text></View>
              <View style={s.metaItem}><Text style={s.metaLabel}>송장</Text><Text style={s.metaValue}>{o.invoice}</Text></View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex:1, backgroundColor:C.bg },
  scroll:   { flex:1 },
  content:  { padding:16, paddingBottom:32 },
  summaryRow:{ flexDirection:'row', gap:8, marginBottom:14 },
  summaryCard:{ flex:1, backgroundColor:C.card, borderRadius:R.md, borderWidth:1, borderColor:C.border, padding:12, alignItems:'center' },
  summaryLabel:{ fontSize:10, color:C.muted, marginBottom:4 },
  summaryValue:{ fontSize:F.xl, fontWeight:'800' },
  toolbar:{ marginBottom:10 },
  chip:{ paddingHorizontal:14, paddingVertical:6, borderRadius:99, backgroundColor:C.card, borderWidth:1, borderColor:C.border, marginRight:8 },
  chipOn:{ backgroundColor:'rgba(108,99,255,0.15)', borderColor:C.accent },
  chipTxt:{ fontSize:F.xs, color:C.sub },
  chipTxtOn:{ color:C.accent, fontWeight:'700' },
  orderCard:{ padding:14 },
  orderTop:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  orderId:{ fontSize:F.xs, color:C.muted },
  orderProduct:{ fontSize:F.md, fontWeight:'600', color:C.text, marginBottom:10 },
  orderMeta:{ flexDirection:'row', flexWrap:'wrap', gap:8 },
  metaItem:{ backgroundColor:C.bg, borderRadius:R.sm, padding:8, minWidth:'45%' },
  metaLabel:{ fontSize:10, color:C.muted, marginBottom:2 },
  metaValue:{ fontSize:F.sm, color:C.sub },
});
