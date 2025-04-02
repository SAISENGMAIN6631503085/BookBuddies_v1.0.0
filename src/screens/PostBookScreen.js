import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Surface, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useBook } from '../context/BookContext';

const PostBookScreen = ({ navigation, route }) => {
  const { postBook, updateBook, loading, error } = useBook();
  const isEditing = route.params?.isEditing;
  const existingBook = route.params?.book;

  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [bookImage, setBookImage] = useState(null);
  const [localError, setLocalError] = useState('');
  
  // Shipping Information
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [shippingCost, setShippingCost] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'Art & Design',
    'Business'
  ];

  const shippingMethods = [
    'Standard',
    'Express',
    'Local Pickup'
  ];

  useEffect(() => {
    if (isEditing && existingBook) {
      setBookTitle(existingBook.title);
      setAuthor(existingBook.author);
      setPrice(existingBook.price.toString());
      setDescription(existingBook.description);
      setCategory(existingBook.category);
      setBookImage(existingBook.image);
      // Set shipping information if available
      if (existingBook.shipping) {
        setShippingMethod(existingBook.shipping.method);
        setShippingCost(existingBook.shipping.cost?.toString() || '');
        setShippingAddress(existingBook.shipping.address || '');
        setShippingCity(existingBook.shipping.city || '');
        setShippingPostalCode(existingBook.shipping.postalCode || '');
      }
    }
  }, [isEditing, existingBook]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBookImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!bookTitle.trim() || !author.trim() || !price.trim() || !description.trim()) {
      setLocalError('Please fill in all required fields');
      return;
    }

    // Validate shipping information
    if (shippingMethod !== 'Local Pickup' && (!shippingAddress.trim() || !shippingCity.trim() || !shippingPostalCode.trim())) {
      setLocalError('Please fill in all shipping information');
      return;
    }

    const bookData = {
      title: bookTitle,
      author,
      price: parseFloat(price),
      description,
      image: bookImage,
      category,
      shipping: {
        method: shippingMethod,
        cost: shippingMethod === 'Local Pickup' ? 0 : parseFloat(shippingCost) || 0,
        address: shippingAddress,
        city: shippingCity,
        postalCode: shippingPostalCode
      }
    };

    let result;
    if (isEditing && existingBook) {
      result = await updateBook(existingBook.id, bookData);
    } else {
      result = await postBook(bookData);
    }

    if (result.success) {
      navigation.goBack();
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header}>{isEditing ? 'Edit Book' : 'Post Book to Sell'}</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Surface style={styles.content}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {bookImage ? (
                  <Image source={{ uri: bookImage }} style={styles.bookImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={40} color="#87CEEB" />
                    <Text style={styles.imagePlaceholderText}>Add Book Image</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.imageHelperText}>Tap to upload a book cover image</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Book Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter book title"
                value={bookTitle}
                onChangeText={setBookTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Author</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter author name"
                value={author}
                onChangeText={setAuthor}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price (USD)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryScrollContent}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      category === cat && styles.categoryPillSelected
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryPillText,
                      category === cat && styles.categoryPillTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter book description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>Shipping Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Shipping Method</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryScrollContent}
              >
                {shippingMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.categoryPill,
                      shippingMethod === method && styles.categoryPillSelected
                    ]}
                    onPress={() => setShippingMethod(method)}
                  >
                    <Text style={[
                      styles.categoryPillText,
                      shippingMethod === method && styles.categoryPillTextSelected
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {shippingMethod !== 'Local Pickup' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Shipping Cost (USD)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter shipping cost"
                    value={shippingCost}
                    onChangeText={setShippingCost}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Shipping Address</Text>
                  <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Enter shipping address"
                    value={shippingAddress}
                    onChangeText={setShippingAddress}
                    multiline
                    numberOfLines={2}
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    value={shippingCity}
                    onChangeText={setShippingCity}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Postal Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter postal code"
                    value={shippingPostalCode}
                    onChangeText={setShippingPostalCode}
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            {(localError || error) && (
              <HelperText type="error" visible={true} style={styles.error}>
                {localError || error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
            >
              {isEditing ? 'Update Book' : 'Post Book'}
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: '500',
  },
  imageHelperText: {
    marginTop: 8,
    color: '#6c757d',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryScrollContent: {
    paddingRight: 16,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryPillSelected: {
    backgroundColor: '#87CEEB',
    borderColor: '#87CEEB',
  },
  categoryPillText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryPillTextSelected: {
    color: '#fff',
  },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#87CEEB',
    borderRadius: 12,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginTop: 8,
    marginBottom: 16,
  },
});

export default PostBookScreen;