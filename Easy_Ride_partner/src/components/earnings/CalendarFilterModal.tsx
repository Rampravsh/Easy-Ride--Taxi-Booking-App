import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Pressable, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme';

const { height } = Dimensions.get('window');

interface CalendarFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRange: string; // 'May 10 - May 16' or 'May 03 - May 09'
  onSelectRange: (
    range: 'current' | 'previous',
    label: string,
    earnings: string,
    todayEarnings: string,
    trips: number,
    bars: { mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string }
  ) => void;
}

export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  visible,
  onClose,
  selectedRange,
  onSelectRange,
}) => {
  const { theme } = useTheme();

  const handleSelect = async (type: 'current' | 'previous') => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (type === 'current') {
      onSelectRange(
        'current',
        'May 10 - May 16',
        '₹18,420',
        '₹4,850.75',
        34,
        { mon: '60%', tue: '80%', wed: '45%', thu: '95%', fri: '70%', sat: '100%', sun: '30%' }
      );
    } else {
      onSelectRange(
        'previous',
        'May 03 - May 09',
        '₹15,230',
        '₹3,920.00',
        28,
        { mon: '40%', tue: '65%', wed: '75%', thu: '50%', fri: '90%', sat: '85%', sun: '20%' }
      );
    }
    onClose();
  };

  const isCurrentSelected = selectedRange === 'May 10 - May 16';
  const isPreviousSelected = selectedRange === 'May 03 - May 09';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.flexEnd}>
          <Pressable 
            style={[
              styles.modalContainer, 
              { 
                backgroundColor: theme.colors.card, 
                borderTopLeftRadius: theme.radius.modal || 24,
                borderTopRightRadius: theme.radius.modal || 24,
                borderWidth: 1,
                borderColor: theme.colors.border
              }
            ]}
          >
            {/* Top Indicator Bar */}
            <View style={[styles.indicator, { backgroundColor: theme.colors.border }]} />

            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(245, 184, 0, 0.15)' }]}>
                  <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
                  Select Roster Week
                </Text>
              </View>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Filter your weekly metrics, completed rides history, and incentive target logs.
            </Text>

            {/* Options List */}
            <View style={styles.optionsList}>
              
              {/* Option 1: Current Week */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isCurrentSelected ? theme.colors.primary : theme.colors.border,
                    borderWidth: isCurrentSelected ? 2 : 1,
                    borderRadius: theme.radius.card || 16,
                  }
                ]}
                onPress={() => handleSelect('current')}
                activeOpacity={0.8}
              >
                <View style={optionStyles.optionContent}>
                  <View style={optionStyles.optionInfo}>
                    <Text style={[optionStyles.optionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
                      May 10 - May 16 (Current)
                    </Text>
                    <View style={optionStyles.statsBadgeRow}>
                      <View style={[optionStyles.statsBadge, { backgroundColor: 'rgba(76, 175, 80, 0.12)' }]}>
                        <Text style={[optionStyles.statsBadgeText, { color: theme.colors.success, fontFamily: theme.typography.fontFamily.bold }]}>
                          ₹18,420
                        </Text>
                      </View>
                      <Text style={[optionStyles.statsSummary, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
                        •  34 Completed Trips
                      </Text>
                    </View>
                  </View>

                  <View 
                    style={[
                      optionStyles.circle, 
                      { borderColor: isCurrentSelected ? theme.colors.primary : theme.colors.border }
                    ]}
                  >
                    {isCurrentSelected && (
                      <View style={[optionStyles.innerCircle, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Option 2: Previous Week */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isPreviousSelected ? theme.colors.primary : theme.colors.border,
                    borderWidth: isPreviousSelected ? 2 : 1,
                    borderRadius: theme.radius.card || 16,
                  }
                ]}
                onPress={() => handleSelect('previous')}
                activeOpacity={0.8}
              >
                <View style={optionStyles.optionContent}>
                  <View style={optionStyles.optionInfo}>
                    <Text style={[optionStyles.optionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
                      May 03 - May 09 (Previous)
                    </Text>
                    <View style={optionStyles.statsBadgeRow}>
                      <View style={[optionStyles.statsBadge, { backgroundColor: 'rgba(0, 122, 255, 0.12)' }]}>
                        <Text style={[optionStyles.statsBadgeText, { color: '#007AFF', fontFamily: theme.typography.fontFamily.bold }]}>
                          ₹15,230
                        </Text>
                      </View>
                      <Text style={[optionStyles.statsSummary, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
                        •  28 Completed Trips
                      </Text>
                    </View>
                  </View>

                  <View 
                    style={[
                      optionStyles.circle, 
                      { borderColor: isPreviousSelected ? theme.colors.primary : theme.colors.border }
                    ]}
                  >
                    {isPreviousSelected && (
                      <View style={[optionStyles.innerCircle, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

            </View>

            {/* Cancel Button */}
            <TouchableOpacity 
              onPress={onClose}
              style={[
                styles.cancelButton,
                { 
                  backgroundColor: theme.colors.surface, 
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.button || 12 
                }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
                Close Period Filters
              </Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  flexEnd: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    borderTopWidth: 1,
  },
  indicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  optionsList: {
    gap: 14,
    marginBottom: 24,
  },
  optionCard: {
    padding: 16,
  },
  cancelButton: {
    height: 48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
  },
});

const optionStyles = StyleSheet.create({
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionInfo: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    marginBottom: 6,
  },
  statsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statsBadgeText: {
    fontSize: 11,
  },
  statsSummary: {
    fontSize: 12,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CalendarFilterModal;
