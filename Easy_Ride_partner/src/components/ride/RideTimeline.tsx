import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface TimelineStep {
  title: string;
  subtitle: string;
  time?: string;
  completed: boolean;
  active: boolean;
}

interface RideTimelineProps {
  steps: TimelineStep[];
}

export const RideTimeline: React.FC<RideTimelineProps> = ({ steps }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <View key={index} style={styles.row}>
            <View style={styles.left}>
              <View 
                style={[
                  styles.dot, 
                  { 
                    backgroundColor: step.completed 
                      ? theme.colors.success 
                      : step.active 
                        ? theme.colors.primary 
                        : theme.colors.border,
                    borderColor: theme.colors.white,
                    borderWidth: 2,
                  }
                ]}
              >
                {step.completed && <Ionicons name="checkmark" size={10} color={theme.colors.white} />}
              </View>
              {!isLast && (
                <View 
                  style={[
                    styles.line, 
                    { 
                      backgroundColor: step.completed 
                        ? theme.colors.success 
                        : theme.colors.border 
                    }
                  ]} 
                />
              )}
            </View>
            <View style={styles.right}>
              <View style={styles.stepHeader}>
                <Text 
                  style={[
                    styles.title, 
                    { 
                      color: step.active || step.completed 
                        ? theme.colors.text 
                        : theme.colors.textSecondary,
                      fontWeight: step.active ? '800' : '600',
                    }
                  ]}
                >
                  {step.title}
                </Text>
                {step.time && (
                  <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{step.time}</Text>
                )}
              </View>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                {step.subtitle}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    minHeight: 56,
  },
  left: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  right: {
    flex: 1,
    paddingBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});
export default RideTimeline;
