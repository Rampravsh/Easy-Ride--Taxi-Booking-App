import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface TimelineStep {
  title: string;
  description: string;
  time?: string;
  status: 'completed' | 'active' | 'pending';
}

interface IncidentTimelineProps {
  steps: TimelineStep[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ steps }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        
        let markerColor = theme.colors.border;
        let iconName = 'ellipse-outline';
        
        if (step.status === 'completed') {
          markerColor = theme.colors.success;
          iconName = 'checkmark-circle';
        } else if (step.status === 'active') {
          markerColor = theme.colors.primary;
          iconName = 'radio-button-on';
        }

        return (
          <View key={idx} style={styles.stepContainer}>
            {/* Left line and marker section */}
            <View style={styles.leftCol}>
              <View style={styles.markerContainer}>
                {step.status === 'completed' ? (
                  <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />
                ) : step.status === 'active' ? (
                  <Ionicons name="radio-button-on" size={22} color={theme.colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={theme.colors.border} />
                )}
              </View>
              {!isLast && (
                <View 
                  style={[
                    styles.line, 
                    { 
                      backgroundColor: step.status === 'completed' ? theme.colors.success : theme.colors.border 
                    }
                  ]} 
                />
              )}
            </View>

            {/* Right text section */}
            <View style={styles.contentCol}>
              <View style={styles.header}>
                <Text 
                  style={[
                    styles.title, 
                    { 
                      color: step.status === 'pending' ? theme.colors.textSecondary : theme.colors.text,
                      fontFamily: step.status === 'active' ? theme.typography.fontFamily.semiBold : theme.typography.fontFamily.medium,
                    }
                  ]}
                >
                  {step.title}
                </Text>
                {step.time && (
                  <Text style={[styles.time, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    {step.time}
                  </Text>
                )}
              </View>
              <Text 
                style={[
                  styles.description, 
                  { 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  }
                ]}
              >
                {step.description}
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
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 70,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  markerContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    paddingBottom: 16,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
  },
  time: {
    fontSize: 11,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
