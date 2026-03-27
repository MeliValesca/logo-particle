export type Notification = {
  id: string;
  avatar: string;
  name: string;
  action: string;
  target: string;
  time: string;
  unread: boolean;
};

const NAMES = [
  'Sarah Chen',
  'Marcus Johnson',
  'Aisha Patel',
  'James O\'Brien',
  'Yuki Tanaka',
  'Elena Rodriguez',
  'David Kim',
  'Fatima Al-Hassan',
  'Lucas Silva',
  'Maya Williams',
  'Oliver Brown',
  'Priya Sharma',
  'Tom Anderson',
  'Nina Kowalski',
  'Alex Rivera',
  'Emma Wilson',
  'Raj Gupta',
  'Sophie Martin',
  'Carlos Reyes',
  'Lena Fischer',
];

const ACTIONS = [
  'liked your post',
  'commented on your photo',
  'started following you',
  'mentioned you in a comment',
  'shared your story',
  'sent you a message',
  'reacted to your comment',
  'tagged you in a post',
  'invited you to an event',
  'replied to your story',
];

const TARGETS = [
  '"Weekend hiking trip 🏔"',
  '"New project launch"',
  '"Team dinner photos"',
  '"Q1 results discussion"',
  '"Birthday celebration 🎂"',
  '"Product roadmap update"',
  '"Office renovation pics"',
  '"Summer vacation plans"',
  '"Book club meeting"',
  '"Workout challenge 💪"',
];

const TIMES = [
  '1m ago',
  '3m ago',
  '5m ago',
  '12m ago',
  '18m ago',
  '25m ago',
  '32m ago',
  '45m ago',
  '1h ago',
  '2h ago',
  '3h ago',
  '5h ago',
  '8h ago',
  '12h ago',
  '1d ago',
];

const INITIALS_COLORS = [
  '#6C5CE7',
  '#00B894',
  '#E17055',
  '#FDCB6E',
  '#A29BFE',
  '#FF7675',
  '#74B9FF',
  '#55EFC4',
  '#FD79A8',
  '#81ECEC',
  '#E84393',
  '#00CEC9',
  '#FAB1A0',
  '#636E72',
  '#D63031',
];

export function generateNotifications(count: number): Notification[] {
  return Array.from({length: count}, (_, i) => ({
    id: `notif-${i}-${Date.now()}`,
    avatar: INITIALS_COLORS[i % INITIALS_COLORS.length],
    name: NAMES[i % NAMES.length],
    action: ACTIONS[i % ACTIONS.length],
    target: TARGETS[i % TARGETS.length],
    time: TIMES[i % TIMES.length],
    unread: i < 8,
  }));
}
