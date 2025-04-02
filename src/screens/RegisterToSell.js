import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Surface } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const RegisterToSell = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    idCard: '',
    passportNumber: '',
    mobileNumber: '',
    nationality: '',
    gender: '',
    address: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    idCardPhoto: null,
    currentPhoto: null,
  });
  const [loading, setLoading] = useState(false);

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'idCard') {
        setFormData({ ...formData, idCardPhoto: result.assets[0].uri });
      } else {
        setFormData({ ...formData, currentPhoto: result.assets[0].uri });
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'age',
      'email',
      'mobileNumber',
      'nationality',
      'gender',
      'street',
      'city',
      'state',
      'postalCode',
      'country',
      'idCardPhoto',
      'currentPhoto'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields and upload both photos');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to register seller
      Alert.alert('Success', 'Your seller registration has been submitted for review');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Register as Seller</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Please fill in your personal details to register as a seller on BookBuddies.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="Enter your first name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Enter your last name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Enter your age"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.mobileNumber}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                placeholder="Enter your mobile number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nationality *</Text>
              <TextInput
                style={styles.input}
                value={formData.nationality}
                onChangeText={(text) => setFormData({ ...formData, nationality: text })}
                placeholder="Enter your nationality"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Gender *</Text>
              <TextInput
                style={styles.input}
                value={formData.gender}
                onChangeText={(text) => setFormData({ ...formData, gender: text })}
                placeholder="Enter your gender"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identification</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>ID Card Number</Text>
              <TextInput
                style={styles.input}
                value={formData.idCard}
                onChangeText={(text) => setFormData({ ...formData, idCard: text })}
                placeholder="Enter your ID card number"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Passport Number</Text>
              <TextInput
                style={styles.input}
                value={formData.passportNumber}
                onChangeText={(text) => setFormData({ ...formData, passportNumber: text })}
                placeholder="Enter your passport number"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Street Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.street}
                onChangeText={(text) => setFormData({ ...formData, street: text })}
                placeholder="Enter your street address"
                placeholderTextColor="#666"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="Enter your city"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>State/Province *</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
                placeholder="Enter your state/province"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Postal Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.postalCode}
                onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                placeholder="Enter your postal code"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(text) => setFormData({ ...formData, country: text })}
                placeholder="Enter your country"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo Upload</Text>
            
            <View style={styles.photoUploadSection}>
              <Text style={styles.photoUploadTitle}>Upload your ID Card</Text>
              <Text style={styles.photoUploadDescription}>
                Please upload a clear photo of your government-issued ID card
              </Text>
              <TouchableOpacity
                style={styles.photoUploadButton}
                onPress={() => pickImage('idCard')}
              >
                {formData.idCardPhoto ? (
                  <Image
                    source={{ uri: formData.idCardPhoto }}
                    style={styles.uploadedPhoto}
                  />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera" size={32} color="#87CEEB" />
                    <Text style={styles.photoPlaceholderText}>Tap to upload ID card</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.photoUploadSection}>
              <Text style={styles.photoUploadTitle}>Upload your Current Photo</Text>
              <Text style={styles.photoUploadDescription}>
                Please upload a recent photo of yourself
              </Text>
              <TouchableOpacity
                style={styles.photoUploadButton}
                onPress={() => pickImage('current')}
              >
                {formData.currentPhoto ? (
                  <Image
                    source={{ uri: formData.currentPhoto }}
                    style={styles.uploadedPhoto}
                  />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={32} color="#87CEEB" />
                    <Text style={styles.photoPlaceholderText}>Tap to upload photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}
          >
            Submit Registration
          </Button>

          <Text style={styles.note}>
            * Required fields. Your registration will be reviewed by our team before approval.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: '#87CEEB',
  },
  note: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  photoUploadSection: {
    marginBottom: 24,
  },
  photoUploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  photoUploadDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  photoUploadButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default RegisterToSell;
