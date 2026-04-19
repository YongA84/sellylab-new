// src/screens/CSScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, R } from '../theme';
import { Card, SectionTitle, Badge, Btn } from '../components';
import { generateCSReply } from '../services/claudeApi';

const CS_DATA = [
  { id:1, from:'김도연', msg:'배송은 언제 오나요? 주문한지 3일됐는데요', time:'2분 전',   status:'미답변', type:'배송문의' },
  { id:2, from:'이준혁', msg:'사이즈 교환 가능한가요? L → XL로 바꾸고싶어요', time:'15분 전',  status:'미답변', type:'교환/반품' },
  { id:3, from:'박지민', msg:'색상이 사진이랑 많이 달라요. 환불 원합니다',  time:'32분 전',  status:'미답변', type:'불만/환불' },
  { id:4, from:'최서연', msg:'영수증 발급 요청드립니다',                    time:'1시간 전', status:'답변완료', type:'기타'    },
  { id:5, from:'강민준', msg:'재입고 예정이 있나요?',                       time:'2시간 전', status:'답변완료', type:'재고문의' },
];

const TEMPLATES = [
  { label:'배송 안내', text:'안녕하세요 😊 셀리랩 고객센터입니다.\n주문하신 상품은 현재 배송 준비 중이며, 영업일 기준 1~2일 내 발송 예정입니다.\n빠른 배송 도와드리겠습니다!' },
  { label:'교환 안내', text:'안녕하세요 😊 교환 요청 확인했습니다.\n미개봉 상태로 반송 후 새 상품 발송해 드립니다.\n반송 주소 DM 드릴게요!' },
  { label:'환불 안내', text:'안녕하세요 😊 환불 요청 확인했습니다.\n반송 후 영업일 3~5일 내 환불 처리됩니다.\n불편 드려 정말 죄송합니다 🙏' },
];

export default function CSScreen() {
  const [selected, setSelected] = useState<typeof CS_DATA[0] | null>(null);
  const [reply, setReply]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleAutoReply = async () => {
    if (!selected) return;
    setLoading(true);
    const res = await generateCSReply(selected.msg, selected.type);
    setReply(res);
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Summary */}
        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summaryNum}>{CS_DATA.filter(c=>c.status==='미답변').length}</Text>
            <Text style={[s.summaryLabel, {color:C.red}]}>미답변</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={[s.summaryNum, {color:C.green}]}>{CS_DATA.filter(c=>c.status==='답변완료').length}</Text>
            <Text style={s.summaryLabel}>답변완료</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={[s.summaryNum, {color:C.blue}]}>98%</Text>
            <Text style={s.summaryLabel}>답변률</Text>
          </View>
        </View>

        <SectionTitle>문의 목록</SectionTitle>
        {CS_DATA.map((c, i) => (
          <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => { setSelected(c); setReply(''); }}>
            <Card style={s.csCard}>
              <View style={s.csTop}>
                <Text style={s.csFrom}>{c.from}</Text>
                <View style={{flexDirection:'row', gap:6, alignItems:'center'}}>
                  <Text style={s.csTime}>{c.time}</Text>
                  <Badge status={c.status} />
                </View>
              </View>
              <Text style={s.csMsg} numberOfLines={2}>{c.msg}</Text>
              <View style={s.csTypeChip}>
                <Text style={s.csTypeText}>{c.type}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reply Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={s.modal}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={s.closeBtn}>✕ 닫기</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>{selected?.from} 님의 문의</Text>
            <View style={{width:60}} />
          </View>

          <ScrollView style={s.modalBody}>
            {/* Original msg */}
            <View style={s.msgBubble}>
              <Text style={s.msgBubbleText}>{selected?.msg}</Text>
              <Text style={s.msgBubbleMeta}>{selected?.type} · {selected?.time}</Text>
            </View>

            {/* Templates */}
            <Text style={s.templateTitle}>빠른 템플릿</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
              {TEMPLATES.map((t, i) => (
                <TouchableOpacity key={i} onPress={() => setReply(t.text)} style={s.templateChip}>
                  <Text style={s.templateChipText}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* AI button */}
            <Btn accent onPress={handleAutoReply} disabled={loading} style={{marginBottom:14}}>
              {loading ? '⏳ AI 답변 생성중...' : '⚡ AI 자동답변 생성'}
            </Btn>

            {/* Reply textarea */}
            <TextInput
              value={reply}
              onChangeText={setReply}
              placeholder="답변을 입력하거나 AI 자동답변을 생성하세요..."
              placeholderTextColor={C.muted}
              multiline
              style={s.replyInput}
            />
          </ScrollView>

          <View style={s.modalFooter}>
            <TouchableOpacity style={s.sendBtn}>
              <Text style={s.sendBtnText}>답변 전송 →</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex:1, backgroundColor:C.bg },
  scroll:    { flex:1 },
  content:   { padding:16, paddingBottom:32 },
  summaryRow:{ flexDirection:'row', backgroundColor:C.card, borderRadius:R.lg, borderWidth:1, borderColor:C.border, marginBottom:16, padding:16 },
  summaryItem:{ flex:1, alignItems:'center' },
  summaryNum:{ fontSize:F.xxl, fontWeight:'800', color:C.text },
  summaryLabel:{ fontSize:F.xs, color:C.muted, marginTop:2 },
  csCard:    { padding:14 },
  csTop:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  csFrom:    { fontSize:F.md, fontWeight:'700', color:C.text },
  csTime:    { fontSize:F.xs, color:C.muted },
  csMsg:     { fontSize:F.sm, color:C.sub, lineHeight:20, marginBottom:8 },
  csTypeChip:{ alignSelf:'flex-start', paddingHorizontal:8, paddingVertical:3, borderRadius:6, backgroundColor:'rgba(61,155,255,0.12)' },
  csTypeText:{ fontSize:10, color:C.blue, fontWeight:'600' },
  // Modal
  modal:     { flex:1, backgroundColor:C.bg },
  modalHeader:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderBottomWidth:1, borderBottomColor:C.border },
  closeBtn:  { fontSize:F.sm, color:C.muted },
  modalTitle:{ fontSize:F.md, fontWeight:'700', color:C.text },
  modalBody: { flex:1, padding:16 },
  msgBubble: { backgroundColor:C.card, borderRadius:R.md, padding:14, marginBottom:16, borderWidth:1, borderColor:C.border },
  msgBubbleText:{ fontSize:F.sm, color:C.text, lineHeight:22 },
  msgBubbleMeta:{ fontSize:F.xs, color:C.muted, marginTop:6 },
  templateTitle:{ fontSize:F.xs, color:C.muted, marginBottom:8, fontWeight:'600' },
  templateChip:{ paddingHorizontal:14, paddingVertical:8, backgroundColor:C.card, borderRadius:99, borderWidth:1, borderColor:C.border, marginRight:8 },
  templateChipText:{ fontSize:F.xs, color:C.sub, fontWeight:'600' },
  replyInput:{ backgroundColor:C.card, borderWidth:1, borderColor:C.border, borderRadius:R.md, padding:14, fontSize:F.sm, color:C.text, minHeight:140, textAlignVertical:'top', fontFamily:'System' },
  modalFooter:{ padding:16, borderTopWidth:1, borderTopColor:C.border },
  sendBtn:   { backgroundColor:C.accent, borderRadius:R.md, paddingVertical:14, alignItems:'center' },
  sendBtnText:{ fontSize:F.md, fontWeight:'800', color:'#fff' },
});
