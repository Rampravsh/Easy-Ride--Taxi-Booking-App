import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AuthHeader } from '../../components/common/AuthHeader';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

type DocumentType = 'license' | 'rc' | 'insurance' | 'profile';

interface DocumentState {
  uploaded: boolean;
  progress: number;
  fileName?: string;
}

export const DocumentUploadScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'DocumentUpload'>>();

  // Documents state
  const [docs, setDocs] = useState<Record<DocumentType, DocumentState>>({
    license: { uploaded: false, progress: 0 },
    rc: { uploaded: false, progress: 0 },
    insurance: { uploaded: false, progress: 0 },
    profile: { uploaded: false, progress: 0 },
  });

  const [loading, setLoading] = useState(false);

  const simulateUpload = (type: DocumentType) => {
    // Check if already uploaded
    if (docs[type].uploaded) {
      Alert.alert(
        "Document Options",
        "What would you like to do?",
        [
          { text: "View Document", onPress: () => {} },
          { text: "Remove", onPress: () => setDocs({ ...docs, [type]: { uploaded: false, progress: 0 } }), style: "destructive" },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    setDocs(prev => ({
      ...prev,
      [type]: { ...prev[type], progress: 0.1 }
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 0.2;
      if (currentProgress >= 1) {
        clearInterval(interval);
        setDocs(prev => ({
          ...prev,
          [type]: { uploaded: true, progress: 1, fileName: `${type.toUpperCase()}_DOC.png` }
        }));
      } else {
        setDocs(prev => ({
          ...prev,
          [type]: { ...prev[type], progress: Number(currentProgress.toFixed(1)) }
        }));
      }
    }, 300);
  };

  const handleNext = () => {
    const allUploaded = Object.values(docs).every(doc => doc.uploaded);
    if (!allUploaded) {
      Alert.alert("Pending Documents", "Please upload all the required documents to proceed.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ApprovalPending');
    }, 1500);
  };

  const renderDocCard = (type: DocumentType, title: string, subtitle: string, icon: string) => {
    const doc = docs[type];
    const isUploading = doc.progress > 0 && doc.progress < 1;

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => simulateUpload(type)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
          </View>
          
          <View style={styles.statusBox}>
            {doc.uploaded ? (
              <View style={[styles.chip, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[styles.chipText, { color: '#2E7D32' }]}>Uploaded</Text>
              </View>
            ) : isUploading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <View style={[styles.chip, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="cloud-upload" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.chipText, { color: theme.colors.textSecondary }]}>Upload</Text>
              </View>
            )}
          </View>
        </View>

        {isUploading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { backgroundColor: theme.colors.primary, width: `${doc.progress * 100}%` }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {Math.round(doc.progress * 100)}%
            </Text>
          </View>
        )}

        {doc.uploaded && doc.fileName && (
          <View style={styles.fileDetails}>
            <Ionicons name="document" size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[styles.fileName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {doc.fileName}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <AuthHeader title="Documents" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Upload Required Documents</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Upload scanned copies or pictures of official documents. All uploads are fully encrypted.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {renderDocCard(
            'profile',
            'Profile Image',
            'Clear front-facing passport size image',
            'person'
          )}
          {renderDocCard(
            'license',
            'Driving License',
            'Valid Indian non-expired driving license',
            'card'
          )}
          {renderDocCard(
            'rc',
            'Registration Certificate (RC)',
            'Official vehicle registration document',
            'document-text'
          )}
          {renderDocCard(
            'insurance',
            'Vehicle Insurance',
            'Valid third-party or comprehensive policy',
            'shield-checkmark'
          )}
        </View>

        <AppButton
          title="Submit Verification Request"
          loading={loading}
          onPress={handleNext}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  fileName: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
});
