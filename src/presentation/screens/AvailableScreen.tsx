/**
 * Available screen component
 * 
 * Manages user availability status, schedule, and preferences.
 * 
 * @module presentation/screens/AvailableScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusIndicator } from '../components/StatusIndicator';
import { COLORS, TYPOGRAPHY, FONT_WEIGHT, SPACING, RADIUS } from '@shared/constants/theme';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  repeat: boolean;
}

type Status = 'available' | 'soon' | 'busy' | 'offline';
type Schedule = { [day: string]: TimeSlot[] };

export const AvailableScreen: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<Status>('available');
  const [duration, setDuration] = useState(120); // minutes
  const [timeLeft, setTimeLeft] = useState(135); // 2h 15m
  const [preferences, setPreferences] = useState<string[]>(['in-person', 'video']);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');

  const [schedule, setSchedule] = useState<Schedule>({
    Monday: [{ id: '1', start: '18:00', end: '20:00', repeat: true }],
    Tuesday: [],
    Wednesday: [
      { id: '2', start: '19:00', end: '21:00', repeat: true },
      { id: '3', start: '21:00', end: '22:00', repeat: true },
    ],
    Thursday: [],
    Friday: [{ id: '4', start: '17:00', end: '19:00', repeat: true }],
    Saturday: [
      { id: '5', start: '10:00', end: '12:00', repeat: true },
      { id: '6', start: '14:00', end: '18:00', repeat: true },
    ],
    Sunday: [{ id: '7', start: '11:00', end: '13:00', repeat: true }],
  });

  const [meetingTypes, setMeetingTypes] = useState({
    'in-person': true,
    'video': true,
    'voice': true,
    'chat': true,
  });

  const [notifications, setNotifications] = useState({
    favorites: true,
    nearby: true,
    messages: false,
    reminders: true,
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Countdown timer for available status
  useEffect(() => {
    if (currentStatus === 'available' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCurrentStatus('offline');
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [currentStatus, timeLeft]);

  const handleStatusChange = (
    status: Status,
    newDuration: number,
    newPreferences: string[]
  ) => {
    setCurrentStatus(status);
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setPreferences(newPreferences);
  };

  const handleAddTimeSlot = (start: string, end: string, repeat: boolean) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start,
      end,
      repeat,
    };
    setSchedule({
      ...schedule,
      [selectedDay]: [...schedule[selectedDay], newSlot],
    });
    setShowScheduleModal(false);
  };

  const handleRemoveTimeSlot = (day: string, slotId: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].filter((slot) => slot.id !== slotId),
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeLeft = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const toggleMeetingType = (type: string) => {
    setMeetingTypes({ ...meetingTypes, [type]: !meetingTypes[type] });
  };

  const toggleNotification = (type: string) => {
    setNotifications({ ...notifications, [type]: !notifications[type] });
  };

  const extendTime = () => {
    setTimeLeft((prev) => prev + 60);
  };

  const stopAvailability = () => {
    setCurrentStatus('offline');
    setTimeLeft(0);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Availability</Text>
          <TouchableOpacity>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Let others know when you're free to meet
        </Text>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor:
                      currentStatus === 'available'
                        ? `${COLORS.success}33`
                        : currentStatus === 'soon'
                        ? `${COLORS.warning}33`
                        : currentStatus === 'busy'
                        ? `${COLORS.error}33`
                        : `${COLORS.textMuted}33`,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={
                    currentStatus === 'available'
                      ? COLORS.success
                      : currentStatus === 'soon'
                      ? COLORS.warning
                      : currentStatus === 'busy'
                      ? COLORS.error
                      : COLORS.textMuted
                  }
                />
              </View>
              <View>
                <StatusIndicator status={currentStatus} showLabel size="medium" />
                {currentStatus === 'available' && (
                  <Text style={styles.timeLeftText}>
                    Auto-off in: {formatTimeLeft(timeLeft)}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.statusRight}>
              <Switch
                value={currentStatus !== 'offline'}
                onValueChange={(value) => {
                  if (value) {
                    setShowBottomSheet(true);
                  } else {
                    setCurrentStatus('offline');
                  }
                }}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
              {currentStatus !== 'offline' && (
                <TouchableOpacity
                  onPress={() => setShowBottomSheet(true)}
                  style={styles.changeButton}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {currentStatus === 'available' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={extendTime}
                style={styles.extendButton}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.extendButtonGradient}
                >
                  <Text style={styles.extendButtonText}>Extend 1h</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={stopAvailability}
                style={styles.stopButton}
              >
                <Text style={styles.stopButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Weekly Schedule */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View>
              <Text style={styles.scheduleTitle}>📅 Weekly Schedule</Text>
              <Text style={styles.scheduleSubtitle}>
                When are you usually free?
              </Text>
            </View>
          </View>

          <View style={styles.scheduleList}>
            {days.map((day) => (
              <View key={day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{day}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDay(day);
                      setShowScheduleModal(true);
                    }}
                    style={styles.addSlotButton}
                  >
                    <Ionicons name="add" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                {schedule[day].length === 0 ? (
                  <Text style={styles.noSlotsText}>No times set</Text>
                ) : (
                  <View style={styles.slotsList}>
                    {schedule[day].map((slot) => (
                      <View key={slot.id} style={styles.slotItem}>
                        <Text style={styles.slotTime}>
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveTimeSlot(day, slot.id)}
                          style={styles.deleteSlotButton}
                        >
                          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesCard}>
          <Text style={styles.preferencesTitle}>Meeting Preferences</Text>

          <View style={styles.preferencesList}>
            {[
              { id: 'in-person', label: '☕ In person', emoji: '☕' },
              { id: 'video', label: '📹 Video call', emoji: '📹' },
              { id: 'voice', label: '📞 Voice call', emoji: '📞' },
              { id: 'chat', label: '💬 Text chat', emoji: '💬' },
            ].map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => toggleMeetingType(type.id)}
                style={styles.preferenceItem}
              >
                <Text style={styles.preferenceEmoji}>{type.emoji}</Text>
                <Text style={styles.preferenceLabel}>{type.label.replace(/^[^\s]+\s/, '')}</Text>
                <Switch
                  value={meetingTypes[type.id as keyof typeof meetingTypes]}
                  onValueChange={() => toggleMeetingType(type.id)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timezoneCard}>
            <Text style={styles.timezoneLabel}>Time zone:</Text>
            <Text style={styles.timezoneValue}>🌍 Amsterdam (GMT+1)</Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.notificationsCard}>
          <Text style={styles.notificationsTitle}>Notifications</Text>
          <Text style={styles.notificationsSubtitle}>Notify me when:</Text>

          <View style={styles.notificationsList}>
            {[
              { id: 'favorites', label: 'Favorites come online' },
              { id: 'nearby', label: 'Partners available nearby' },
              { id: 'messages', label: 'New messages' },
              { id: 'reminders', label: 'Meeting reminders' },
            ].map((notif) => (
              <TouchableOpacity
                key={notif.id}
                onPress={() => toggleNotification(notif.id)}
                style={styles.notificationItem}
              >
                <Text style={styles.notificationLabel}>{notif.label}</Text>
                <Switch
                  value={notifications[notif.id as keyof typeof notifications]}
                  onValueChange={() => toggleNotification(notif.id)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Status Info */}
        {currentStatus === 'available' && (
          <View style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.infoEmoji}>✨</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>
                  You're visible to partners!
                </Text>
                <Text style={styles.infoDescription}>
                  Language learners nearby can now see you're available and send
                  you connection requests.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Status Change Bottom Sheet */}
      <Modal
        visible={showBottomSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setShowBottomSheet(false)}
            activeOpacity={1}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Set Availability</Text>
            <ScrollView style={styles.bottomSheetContent}>
              {/* Status options would go here */}
              <TouchableOpacity
                onPress={() => {
                  handleStatusChange('available', 120, ['in-person', 'video']);
                  setShowBottomSheet(false);
                }}
                style={styles.statusOption}
              >
                <Text style={styles.statusOptionEmoji}>🟢</Text>
                <View style={styles.statusOptionText}>
                  <Text style={styles.statusOptionTitle}>Available</Text>
                  <Text style={styles.statusOptionSubtitle}>Right now!</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  saveButton: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLeftText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statusRight: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  changeButton: {
    paddingVertical: 2,
  },
  changeButtonText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  extendButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  extendButtonGradient: {
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extendButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
  stopButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  scheduleCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  scheduleHeader: {
    marginBottom: SPACING.lg,
  },
  scheduleTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  scheduleSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scheduleList: {
    gap: SPACING.md,
  },
  dayCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dayName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  addSlotButton: {
    padding: SPACING.xs,
  },
  noSlotsText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  slotsList: {
    gap: SPACING.sm,
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  slotTime: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
  },
  deleteSlotButton: {
    padding: SPACING.xs,
  },
  preferencesCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  preferencesTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  preferencesList: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
  },
  preferenceEmoji: {
    fontSize: 20,
  },
  preferenceLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  timezoneCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
  },
  timezoneLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  timezoneValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  notificationsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  notificationsTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  notificationsSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  notificationsList: {
    gap: SPACING.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
  },
  notificationLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
  },
  infoCard: {
    backgroundColor: `${COLORS.success}1A`,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.success}4D`,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  infoContent: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoEmoji: {
    fontSize: 40,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    maxHeight: '85%',
    paddingTop: SPACING.md,
  },
  bottomSheetHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  bottomSheetTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bottomSheetContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  statusOptionEmoji: {
    fontSize: 24,
  },
  statusOptionText: {
    flex: 1,
  },
  statusOptionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  statusOptionSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
});

export default AvailableScreen;

