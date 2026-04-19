// src/components/index.tsx — 공유 컴포넌트 모음

import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { C, F, R } from '../theme';

/* ── Card ── */
export function Card({
  children, style,
}: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>{children}</View>
  );
}

/* ── SectionTitle ── */
export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

/* ── Badge ── */
const STATUS_MAP: Record<string, { bg: string; text: string }> = {
  '배송중':   { bg: 'rgba(61,155,255,0.15)',  text: '#3d9bff' },
  '결제완료': { bg: 'rgba(0,214,143,0.15)',   text: '#00d68f' },
  '배송완료': { bg: 'rgba(136,144,170,0.15)', text: '#8890aa' },
  '재고부족': { bg: 'rgba(255,159,67,0.15)',  text: '#ff9f43' },
  '품절':     { bg: 'rgba(255,92,92,0.15)',   text: '#ff5c5c' },
  '판매중':   { bg: 'rgba(0,214,143,0.15)',   text: '#00d68f' },
  '정상':     { bg: 'rgba(0,214,143,0.15)',   text: '#00d68f' },
  '점검중':   { bg: 'rgba(255,159,67,0.15)',  text: '#ff9f43' },
  '취소':     { bg: 'rgba(255,92,92,0.15)',   text: '#ff5c5c' },
  '미답변':   { bg: 'rgba(255,92,92,0.15)',   text: '#ff5c5c' },
  '답변완료': { bg: 'rgba(136,144,170,0.15)', text: '#8890aa' },
};

export function Badge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { bg: 'rgba(136,144,170,0.1)', text: C.muted };
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{status}</Text>
    </View>
  );
}

/* ── Btn ── */
export function Btn({
  children, onPress, accent, disabled, style, textStyle,
}: {
  children: string;
  onPress?: () => void;
  accent?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.btn,
        accent && styles.btnAccent,
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Text style={[styles.btnText, accent && styles.btnTextAccent, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/* ── StatCard ── */
export function StatCard({
  label, value, unit, change, up, icon,
}: {
  label: string; value: string; unit: string;
  change: string; up: boolean; icon: string;
}) {
  return (
    <Card style={styles.statCard}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
      <Text style={[styles.statChange, { color: up ? C.green : C.red }]}>
        {up ? '▲' : '▼'} {change}
      </Text>
    </Card>
  );
}

/* ── AIPanel ── */
export function AIPanel({
  title, placeholder, onGenerate, result, loading,
  value, onChangeText,
}: {
  title: string; placeholder: string;
  onGenerate: () => void; result: string;
  loading: boolean; value: string;
  onChangeText: (t: string) => void;
}) {
  // Using TextInput inline to avoid circular import
  const { TextInput } = require('react-native');
  return (
    <Card style={styles.aiPanel}>
      <Text style={styles.aiTitle}>⚡ {title}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        style={styles.aiInput}
        multiline
      />
      <Btn accent onPress={onGenerate} disabled={loading}
        style={{ marginTop: 10 }}>
        {loading ? '⏳ 생성중...' : '생성하기'}
      </Btn>
      {!!result && (
        <View style={styles.aiResult}>
          <Text style={styles.aiResultText}>{result}</Text>
        </View>
      )}
    </Card>
  );
}

/* ── LoadingSpinner ── */
export function Spinner() {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" color={C.accent} />
    </View>
  );
}

/* ── RowItem ── */
export function RowItem({
  label, value, valueColor,
}: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: F.md,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: F.xs,
    fontWeight: '600',
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: R.sm,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  btnAccent: {
    backgroundColor: 'rgba(108,99,255,0.15)',
    borderColor: 'rgba(108,99,255,0.4)',
  },
  btnText: {
    fontSize: F.sm,
    fontWeight: '600',
    color: C.sub,
  },
  btnTextAccent: {
    color: C.accent,
  },
  statCard: {
    padding: 16,
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: F.xs,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statIcon: { fontSize: 18 },
  statValue: {
    fontSize: F.xl,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: F.xs,
    fontWeight: '400',
    color: C.muted,
  },
  statChange: {
    fontSize: F.xs,
    fontWeight: '600',
    marginTop: 6,
  },
  aiPanel: {
    padding: 18,
    borderColor: 'rgba(108,99,255,0.3)',
    backgroundColor: 'rgba(108,99,255,0.04)',
  },
  aiTitle: {
    fontSize: F.sm,
    fontWeight: '700',
    color: C.accent,
    marginBottom: 10,
  },
  aiInput: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.sm,
    padding: 12,
    fontSize: F.sm,
    color: C.text,
    minHeight: 50,
  },
  aiResult: {
    marginTop: 12,
    padding: 14,
    backgroundColor: C.bg,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  aiResultText: {
    fontSize: F.xs,
    color: C.sub,
    lineHeight: 20,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontSize: F.sm,
    color: C.sub,
  },
  rowValue: {
    fontSize: F.md,
    fontWeight: '700',
    color: C.text,
  },
});
