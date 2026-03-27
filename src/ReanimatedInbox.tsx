import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import {generateNotifications, type Notification} from './data';

const ITEM_COUNT = 80;

function TypingDot({delay}: {delay: number}) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
        -1,
        true,
      ),
    );
  }, [delay, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return <Animated.View style={[styles.typingDot, style]} />;
}

function PulsingBadge() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.4, {duration: 800, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.3, {duration: 800, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [scale, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return <Animated.View style={[styles.pulsingRing, style]} />;
}

function NotificationRow({
  item,
  index,
  triggerKey,
}: {
  item: Notification;
  index: number;
  triggerKey: number;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = 0;
    translateX.value = -30;
    scale.value = 0.95;

    const delay = index * 30;
    opacity.value = withDelay(
      delay,
      withTiming(1, {duration: 350, easing: Easing.out(Easing.ease)}),
    );
    translateX.value = withDelay(
      delay,
      withSpring(0, {damping: 18, stiffness: 140}),
    );
    scale.value = withDelay(
      delay,
      withSpring(1, {damping: 18, stiffness: 140}),
    );
  }, [triggerKey, index, opacity, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateX: translateX.value}, {scale: scale.value}],
  }));

  return (
    <Animated.View
      style={[styles.row, item.unread && styles.rowUnread, animatedStyle]}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, {backgroundColor: item.avatar}]}>
          <Text style={styles.avatarText}>
            {item.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </Text>
        </View>
        {item.unread && <PulsingBadge />}
      </View>
      <View style={styles.content}>
        <Text style={styles.text} numberOfLines={2}>
          <Text style={styles.name}>{item.name}</Text> {item.action}{' '}
          <Text style={styles.target}>{item.target}</Text>
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.time}>{item.time}</Text>
          {item.unread && (
            <View style={styles.typingRow}>
              <TypingDot delay={0} />
              <TypingDot delay={150} />
              <TypingDot delay={300} />
              <Text style={styles.typingLabel}>typing</Text>
            </View>
          )}
        </View>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </Animated.View>
  );
}

export default function ReanimatedInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [triggerKey, setTriggerKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(ITEM_COUNT);

  useEffect(() => {
    setNotifications(generateNotifications(count));
  }, [count]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifications(generateNotifications(count));
      setTriggerKey(k => k + 1);
      setRefreshing(false);
    }, 300);
  }, [count]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeLabel}>Reanimated</Text>
        </View>
      </View>

      <View style={styles.countRow}>
        {[80, 150, 300].map(c => (
          <Pressable
            key={c}
            style={[styles.countBtn, count === c && styles.countBtnActive]}
            onPress={() => {
              setCount(c);
              setTriggerKey(k => k + 1);
            }}>
            <Text
              style={[
                styles.countBtnText,
                count === c && styles.countBtnTextActive,
              ]}>
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.headerSub}>
        {count} items with stagger + looping typing indicators & pulse badges
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C5CE7"
          />
        }>
        {notifications.map((item, index) => (
          <NotificationRow
            key={item.id}
            item={item}
            index={index}
            triggerKey={triggerKey}
          />
        ))}
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0F0F1A'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {fontSize: 28, fontWeight: '800', color: '#FFF'},
  headerBadge: {
    backgroundColor: '#E17055',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  headerBadgeLabel: {color: '#FFF', fontSize: 12, fontWeight: '700'},
  countRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  countBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  countBtnActive: {backgroundColor: '#6C5CE7', borderColor: '#6C5CE7'},
  countBtnText: {color: '#8B8BA7', fontWeight: '600', fontSize: 14},
  countBtnTextActive: {color: '#FFF'},
  headerSub: {
    fontSize: 12,
    color: '#6C6C8A',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  list: {flex: 1},
  listContent: {paddingHorizontal: 16},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  rowUnread: {backgroundColor: '#1E1B3A', borderColor: '#3A2A6A'},
  avatarWrap: {marginRight: 12},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {color: '#FFF', fontSize: 14, fontWeight: '700'},
  pulsingRing: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6C5CE7',
  },
  content: {flex: 1},
  text: {color: '#C8C8D4', fontSize: 14, lineHeight: 19},
  name: {color: '#FFF', fontWeight: '700'},
  target: {color: '#A29BFE'},
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {color: '#6C6C8A', fontSize: 12},
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 3,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#A29BFE',
  },
  typingLabel: {
    color: '#6C6C8A',
    fontSize: 11,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C5CE7',
    marginLeft: 8,
  },
});
