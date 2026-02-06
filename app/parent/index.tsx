import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Demo access codes
const VALID_CODES: { [key: string]: string } = {
  'MARIA2024': '1',
  'CARLOS2024': '2',
  'SOFIA2024': '3',
};

export default function ParentLogin() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!accessCode) {
      Alert.alert('Error', 'Por favor ingrese su código de acceso');
      return;
    }

    setLoading(true);

    const childId = VALID_CODES[accessCode.toUpperCase()];
    
    if (childId) {
      await AsyncStorage.setItem('parentAuth', childId);
      router.replace(`/parent/${childId}`);
    } else {
      Alert.alert('Error', 'Código de acceso inválido');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.icon}>👨‍👩‍👧</Text>
        <Text style={styles.title}>Portal Padres</Text>
        <Text style={styles.subtitle}>
          Ingrese el código de acceso que le proporcionó el Nido
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Código de Acceso</Text>
          <TextInput
            style={styles.input}
            value={accessCode}
            onChangeText={setAccessCode}
            placeholder="Ej: MARIA2024"
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>¿No tiene código?</Text>
          <Text style={styles.helpText}>
            Contacte a la directora del Nido para obtener su código de acceso único.
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#95D5B2',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpBox: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  helpTitle: {
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 5,
  },
  helpText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  backLink: {
    textAlign: 'center',
    color: '#4ECDC4',
    marginTop: 20,
    fontSize: 16,
  },
});
