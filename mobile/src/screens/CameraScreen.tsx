import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useExpenses } from '../store/ExpenseContext';

export default function CameraScreen() {
  const { scanReceipt } = useExpenses();
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function pickImage() {
    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) {
      Alert.alert('Permission needed', 'Please grant photo library access to scan receipts.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  }

  async function takePhoto() {
    const permResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permResult.granted) {
      Alert.alert('Permission needed', 'Please grant camera access to scan receipts.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  }

  async function handleScan() {
    if (!image) return;

    setScanning(true);
    try {
      const formData = new FormData();
      formData.append('receipt', {
        uri: image,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      } as any);

      const scanResult = await scanReceipt(formData);
      setResult(scanResult);
      Alert.alert('Success', 'Receipt scanned and expense created!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to scan receipt');
    } finally {
      setScanning(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Receipt</Text>
      </View>

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: 48 }}>📷</Text>
            <Text style={styles.placeholderText}>Take a photo or pick from gallery</Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
          <Text style={styles.secondaryButtonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
          <Text style={styles.secondaryButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity
          style={[styles.scanButton, scanning && styles.buttonDisabled]}
          onPress={handleScan}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.scanButtonText}>Scan Receipt</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Result */}
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Extracted Data</Text>
          <Text style={styles.resultItem}>Merchant: {result.parsed?.merchant}</Text>
          <Text style={styles.resultItem}>Amount: ${result.parsed?.amount?.toFixed(2)}</Text>
          <Text style={styles.resultItem}>Date: {result.parsed?.date}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E244E',
  },
  imageContainer: {
    marginHorizontal: 20,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    marginTop: 8,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#5E244E',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
});
