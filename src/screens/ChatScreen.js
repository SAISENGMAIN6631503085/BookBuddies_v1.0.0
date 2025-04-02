import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'other',
      timestamp: 'Just now',
    },
  ]);
  const scrollViewRef = useRef(null);

  const sendMessage = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    
    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team will get back to you shortly.',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prevMessages => [...prevMessages, supportResponse]);
    }, 1000);

    // Scroll to bottom
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>BookBuddies Support</Text>
                <Text style={styles.headerSubtitle}>Active now</Text>
              </View>
            </View>

            {/* Chat Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatContainer} 
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {messages.map(message => (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageRow,
                    message.sender === 'user' ? styles.userMessageRow : styles.otherMessageRow
                  ]}
                >
                  {message.sender === 'other' && (
                    <Image 
                      source={require('../../assets/icon.png')} 
                      style={styles.messageAvatar} 
                    />
                  )}
                  <View style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.otherBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.otherMessageText
                    ]}>
                      {message.text}
                    </Text>
                    <Text style={[
                      styles.timestamp,
                      message.sender === 'user' ? styles.userTimestamp : styles.otherTimestamp
                    ]}>
                      {message.timestamp}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Input Container */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                placeholderTextColor="#666"
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                onKeyPress={handleKeyPress}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons 
                  name="paper-plane" 
                  size={20} 
                  color={inputText.trim() ? '#fff' : '#ccc'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#87CEEB',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#87CEEB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatScreen; 