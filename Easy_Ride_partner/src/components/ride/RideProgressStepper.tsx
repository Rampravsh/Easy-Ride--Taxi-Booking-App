import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideProgressStepperProps {
  currentStep: 'pickup' | 'arrived' | 'inprogress' | 'completed';
}

export const RideProgressStepper = ({ currentStep }: RideProgressStepperProps) => {
  const { theme } = useTheme();

  const steps = [
    { key: 'pickup', label: 'Accepted' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'inprogress', label: 'On Trip' },
    { key: 'completed', label: 'Dropped' },
  ];

  const getStepIndex = () => {
    switch (currentStep) {
      case 'pickup': return 0;
      case 'arrived': return 1;
      case 'inprogress': return 2;
      case 'completed': return 3;
    }
  };

  const currentIndex = getStepIndex();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <React.Fragment key={step.key}>
            <View style={styles.stepItem}>
              <View style={[
                styles.circle,
                { 
                  borderColor: isCompleted || isActive ? theme.colors.primary : theme.colors.border,
                  backgroundColor: isCompleted ? theme.colors.primary : isActive ? theme.colors.card : theme.colors.surface
                }
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={10} color="#111111" />
                ) : (
                  <View style={[
                    styles.dot,
                    { backgroundColor: isActive ? theme.colors.primary : theme.colors.textSecondary }
                  ]} />
                )}
              </View>
              <Text style={[
                styles.label,
                { 
                  color: isActive ? theme.colors.text : theme.colors.textSecondary,
                  fontWeight: isActive ? '800' : '600'
                }
              ]}>
                {step.label}
              </Text>
            </View>
            
            {index < steps.length - 1 && (
              <View style={[
                styles.line,
                { backgroundColor: index < currentIndex ? theme.colors.primary : theme.colors.border }
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  stepItem: {
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginTop: -16,
  },
});
export default RideProgressStepper;
