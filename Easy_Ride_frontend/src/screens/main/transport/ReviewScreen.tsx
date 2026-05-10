import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const TIP_AMOUNTS = ['$1', '$2', '$5', '$10', '$20'];

export const ReviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTip, setSelectedTip] = useState('$2');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Review</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
           {/* Stars */}
           <View style={styles.starsRow}>
             {[1, 2, 3, 4, 5].map((star) => (
               <TouchableOpacity key={star} onPress={() => setRating(star)}>
                 <Ionicons 
                   name={star <= rating ? "star" : "star-outline"} 
                   size={40} 
                   color={star <= rating ? theme.colors.primary : theme.colors.border} 
                 />
               </TouchableOpacity>
             ))}
           </View>

           <Text style={[styles.ratingLabel, { color: theme.colors.text }]}>Excellent</Text>
           <Text style={[styles.ratingSub, { color: theme.colors.textSecondary }]}>
             You rated Sergio Ramasis 4 star
           </Text>

           <TextInput
             style={[styles.commentInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
             placeholder="Write your text"
             placeholderTextColor={theme.colors.textSecondary}
             multiline
             numberOfLines={6}
             value={comment}
             onChangeText={setComment}
           />

           <Text style={[styles.tipTitle, { color: theme.colors.text }]}>Give some tips to Sergio Ramasis</Text>
           
           <View style={styles.tipRow}>
             {TIP_AMOUNTS.map((tip) => (
               <TouchableOpacity 
                 key={tip} 
                 style={[
                   styles.tipButton, 
                   { borderColor: theme.colors.border },
                   selectedTip === tip && { borderColor: theme.colors.primary, backgroundColor: '#FFF9E6' }
                 ]}
                 onPress={() => setSelectedTip(tip)}
               >
                 <Text style={[styles.tipText, { color: selectedTip === tip ? theme.colors.text : theme.colors.textSecondary }]}>{tip}</Text>
               </TouchableOpacity>
             ))}
           </View>

           <TouchableOpacity>
             <Text style={[styles.otherAmount, { color: theme.colors.primary }]}>Enter other amount</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          title="Submit" 
          onPress={() => navigation.navigate('ThankYou')} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: spacing.xl,
  },
  ratingLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingSub: {
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  commentInput: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    textAlignVertical: 'top',
    marginBottom: spacing.xl,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  tipButton: {
    width: 60,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  otherAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});
