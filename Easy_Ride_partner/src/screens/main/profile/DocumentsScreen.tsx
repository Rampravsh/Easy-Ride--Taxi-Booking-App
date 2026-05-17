import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';

interface ComplianceDocument {
  id: string;
  name: string;
  description: string;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  expiryDate?: string;
}

export const DocumentsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    {
      id: 'd1',
      name: 'Driving License (DL)',
      description: 'Front & back high-resolution color scan of commercial driving authorization.',
      status: 'verified',
      expiryDate: 'Dec 14, 2030',
    },
    {
      id: 'd2',
      name: 'Vehicle Registration Certificate (RC)',
      description: 'Official smart card registration issued by state transport authority.',
      status: 'verified',
      expiryDate: 'May 10, 2028',
    },
    {
      id: 'd3',
      name: 'Rider PAN Card',
      description: 'Permanent Account Number card scanner for income tax declarations.',
      status: 'verified',
    },
    {
      id: 'd4',
      name: 'Police Clearance Certificate (PCC)',
      description: 'Criminal history background verification check document.',
      status: 'pending',
      expiryDate: 'Nov 20, 2026',
    },
    {
      id: 'd5',
      name: 'Commercial Vehicle Permit',
      description: 'State tourism and transport commercial taxi permit authorization.',
      status: 'expired',
      expiryDate: 'May 12, 2026', // Expired recently! Matches the critical warning in Inbox notifications.
    },
  ]);

  const handleUploadDocument = (doc: ComplianceDocument) => {
    Alert.alert(
      `Upload ${doc.name}`,
      `Would you like to take a photo or select an existing scan to upload a renewed copy?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera Capture', 
          onPress: () => {
            Alert.alert('Upload Process', 'Camera scan simulation complete. Saving document to easy ride verification queues.');
            setDocuments((prev) => 
              prev.map((item) => 
                item.id === doc.id ? { ...item, status: 'pending', expiryDate: 'Renewed (In Review)' } : item
              )
            );
          } 
        },
        { 
          text: 'Select PDF/Image', 
          onPress: () => {
            Alert.alert('Upload Process', 'Document uploaded successfully.');
            setDocuments((prev) => 
              prev.map((item) => 
                item.id === doc.id ? { ...item, status: 'pending', expiryDate: 'Renewed (In Review)' } : item
              )
            );
          } 
        }
      ]
    );
  };

  const getStatusBadge = (status: ComplianceDocument['status']) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'rgba(76, 175, 80, 0.12)',
          border: theme.colors.success,
          color: theme.colors.success,
          label: 'VERIFIED',
          icon: 'checkmark-circle',
        };
      case 'pending':
        return {
          bg: 'rgba(245, 184, 0, 0.12)',
          border: theme.colors.primary,
          color: theme.colors.text,
          label: 'REVIEWING',
          icon: 'time',
        };
      case 'rejected':
        return {
          bg: 'rgba(255, 69, 58, 0.12)',
          border: theme.colors.danger,
          color: theme.colors.danger,
          label: 'REJECTED',
          icon: 'close-circle',
        };
      case 'expired':
      default:
        return {
          bg: 'rgba(255, 69, 58, 0.12)',
          border: theme.colors.danger,
          color: theme.colors.danger,
          label: 'EXPIRED',
          icon: 'alert-circle',
        };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Compliance Documents
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Warning card for expiring/expired documentation */}
        <View style={[styles.complianceCardAlert, { backgroundColor: 'rgba(255, 69, 58, 0.08)', borderColor: 'rgba(255, 69, 58, 0.2)' }]}>
          <Ionicons name="warning" size={24} color={theme.colors.danger} />
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Action Required
            </Text>
            <Text style={[styles.alertBody, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Your Commercial Permit has expired. Please upload an active valid permit document immediately to prevent automatic suspension of ride dispatch alerts.
            </Text>
          </View>
        </View>

        {/* List of documents */}
        <View style={styles.documentList}>
          {documents.map((doc) => {
            const badge = getStatusBadge(doc.status);

            return (
              <View 
                key={doc.id} 
                style={[
                  styles.docItem, 
                  { 
                    backgroundColor: theme.colors.card, 
                    borderColor: doc.status === 'expired' ? theme.colors.danger : theme.colors.border 
                  }
                ]}
              >
                <View style={styles.docHeader}>
                  <Text style={[styles.docName, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
                    {doc.name}
                  </Text>
                  
                  {/* Status Indicator badge */}
                  <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                    <Ionicons name={badge.icon as any} size={12} color={badge.color} />
                    <Text style={[styles.badgeText, { color: badge.color, fontFamily: theme.typography.fontFamily.semiBold }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.docDesc, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {doc.description}
                </Text>

                {doc.expiryDate && (
                  <Text style={[styles.expiryText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
                    Expiry: {doc.expiryDate}
                  </Text>
                )}

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Upload action button */}
                <TouchableOpacity
                  style={[
                    styles.uploadBtn,
                    {
                      backgroundColor: doc.status === 'verified' ? theme.colors.surface : theme.colors.primary,
                      borderColor: doc.status === 'verified' ? theme.colors.border : theme.colors.primary,
                    },
                  ]}
                  onPress={() => handleUploadDocument(doc)}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={doc.status === 'verified' ? 'refresh' : 'cloud-upload'} 
                    size={16} 
                    color={doc.status === 'verified' ? theme.colors.text : theme.colors.black} 
                  />
                  <Text 
                    style={[
                      styles.uploadBtnText, 
                      { 
                        color: doc.status === 'verified' ? theme.colors.text : theme.colors.black,
                        fontFamily: theme.typography.fontFamily.semiBold 
                      }
                    ]}
                  >
                    {doc.status === 'verified' ? 'Upload Update' : 'Upload Renewed Document'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 20,
  },
  headerRight: {
    width: 24,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  complianceCardAlert: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 15,
  },
  alertBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  documentList: {
    gap: 16,
  },
  docItem: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  docName: {
    fontSize: 16,
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
  },
  docDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 12,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
  },
  uploadBtnText: {
    fontSize: 13,
  },
});
export default DocumentsScreen;
