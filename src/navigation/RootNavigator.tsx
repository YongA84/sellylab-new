import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen  from '../screens/ProductsScreen';
import OrdersScreen    from '../screens/OrdersScreen';
import CSScreen        from '../screens/CSScreen';
import {
  AutoUploadScreen,
  MarketingScreen,
  AnalyticsScreen,
  DetailPageScreen,
  PriceCalcScreen,
  AccountsScreen,
  SettingsScreen,
} from '../screens/RemainingScreens';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    홈: '◈', 상품: '⊞', 주문: '⊡', CS: '◎', 더보기: '⊗',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 18, color: focused ? C.accent : C.muted }}>
        {icons[label] ?? '●'}
      </Text>
      <Text style={{ fontSize: 9, color: focused ? C.accent : C.muted, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: C.surface },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        cardStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="MoreHome"   component={MoreHomeScreen}   options={{ title: '더보기' }} />
      <Stack.Screen name="Marketing"  component={MarketingScreen}  options={{ title: '마케팅' }} />
      <Stack.Screen name="Analytics"  component={AnalyticsScreen}  options={{ title: '매출분석' }} />
      <Stack.Screen name="DetailPage" component={DetailPageScreen} options={{ title: 'AI 상세페이지' }} />
      <Stack.Screen name="PriceCalc"  component={PriceCalcScreen}  options={{ title: '가격계산기' }} />
      <Stack.Screen name="Accounts"   component={AccountsScreen}   options={{ title: '다계정관리' }} />
      <Stack.Screen name="AutoUpload" component={AutoUploadScreen} options={{ title: '자동업로드' }} />
      <Stack.Screen name="Settings"   component={SettingsScreen}   options={{ title: '설정' }} />
    </Stack.Navigator>
  );
}

function MoreHomeScreen({ navigation }: any) {
  const menus = [
    { key: 'AutoUpload', icon: '⇪', label: '자동업로드',   desc: '도매 URL → 스토어 자동 등록', badge: 'NEW' },
    { key: 'Marketing',  icon: '◈', label: '마케팅',        desc: 'AI 카피 · 키워드 추천' },
    { key: 'Analytics',  icon: '◉', label: '매출분석',      desc: '매출 · 마진 · ROAS 분석' },
    { key: 'DetailPage', icon: '▦', label: 'AI 상세페이지', desc: '전환율 높은 문구 자동 생성', badge: 'AI' },
    { key: 'PriceCalc',  icon: '⊕', label: '가격계산기',    desc: '마진율 자동 계산' },
    { key: 'Accounts',   icon: '⊗', label: '다계정관리',    desc: '여러 스토어 통합 관리' },
    { key: 'Settings',   icon: '⚙', label: '설정',          desc: '자동화 · 알림 설정' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={moreStyles.profileCard}>
        <View style={moreStyles.avatar}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>김</Text>
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>김셀러</Text>
          <Text style={{ fontSize: 12, color: C.muted }}>pro@sellylab.io · PRO 플랜</Text>
        </View>
      </View>

      {menus.map(m => (
        <TouchableOpacity
          key={m.key}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(m.key)}
          style={moreStyles.menuItem}
        >
          <View style={moreStyles.menuIcon}>
            <Text style={{ fontSize: 20, color: C.accent }}>{m.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{m.label}</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{m.desc}</Text>
          </View>
          {m.badge && (
            <View style={[moreStyles.badge, { backgroundColor: 'rgba(108,99,255,0.2)' }]}>
              <Text style={{ fontSize: 10, color: C.accent, fontWeight: '700' }}>{m.badge}</Text>
            </View>
          )}
          <Text style={{ fontSize: 18, color: C.muted, marginLeft: 8 }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const moreStyles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.card, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(108,99,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
  },
});

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: C.surface },
          headerTintColor: C.text,
          headerTitleStyle: { fontWeight: '800', fontSize: 17 },
          tabBarStyle: {
            backgroundColor: C.surface,
            borderTopColor: C.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 8,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Dashboard" component={DashboardScreen}
          options={{ title: '대시보드', tabBarIcon: ({ focused }) => <TabIcon label="홈" focused={focused} /> }}
        />
        <Tab.Screen
          name="Products" component={ProductsScreen}
          options={{ title: '상품관리', tabBarIcon: ({ focused }) => <TabIcon label="상품" focused={focused} /> }}
        />
        <Tab.Screen
          name="Orders" component={OrdersScreen}
          options={{
            title: '주문/배송',
            tabBarIcon: ({ focused }) => <TabIcon label="주문" focused={focused} />,
            tabBarBadge: 23,
            tabBarBadgeStyle: { backgroundColor: C.red, fontSize: 9 },
          }}
        />
        <Tab.Screen
          name="CS" component={CSScreen}
          options={{
            title: '고객응대',
            tabBarIcon: ({ focused }) => <TabIcon label="CS" focused={focused} />,
            tabBarBadge: 7,
            tabBarBadgeStyle: { backgroundColor: C.red, fontSize: 9 },
          }}
        />
        <Tab.Screen
          name="More" component={MoreStack}
          options={{ headerShown: false, tabBarIcon: ({ focused }) => <TabIcon label="더보기" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}