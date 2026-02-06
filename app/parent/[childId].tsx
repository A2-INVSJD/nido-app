import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyCheckOut } from '../../src/lib/notifications';

// Demo data
const DEMO_CHILDREN: { [key: string]: any } = {
  '1': {
    name: 'María García',
    age: 4,
    parent_name: 'Ana García',
    checked_in: false,
    today_report: null,
  },
  '2': {
    name: 'Carlos López',
    age: 3,
    parent_name: 'Roberto López',
    checked_in: true,
    check_in_time: '8:30 AM',
    today_report: {
      meals: '🍎 Desayuno completo, 🥪 Almuerzo (pollo con arroz)',
      nap: '💤 Siesta de 1:00 PM a 2:30 PM (1.5 horas)',
      activities: '🎨 Pintura con dedos, 📚 Lectura grupal, 🧩 Rompecabezas',
      mood: '😊 Muy feliz y participativo',
      notes: 'Carlos tuvo un excelente día. Compartió sus juguetes con los compañeros.',
    },
  },
  '3': {
    name: 'Sofía Martínez',
    age: 5,
    parent_name: 'Laura Martínez',
    checked_in: true,
    check_in_time: '7:45 AM',
    today_report: {
      meals: '🍎 Desayuno completo, 🥗 Almuerzo (pasta con vegetales)',
      nap: '💤 Siesta de 1:00 PM a 2:00 PM (1 hora)',
      activities: '🎵 Clase de música, 🌱 Jardinería, 📖 Práctica de letras',
      mood: '😌 Tranquila y concentrada',
      notes: 'Sofía mostró gran interés en las plantas. ¡Le encantó regar las flores!',
    },
  },
};

export default function ChildView() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const [child, setChild] = useState<any>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [pickupName, setPickupName] = useState('');

  useEffect(() => {
    if (childId && DEMO_CHILDREN[childId]) {
      setChild(DEMO_CHILDREN[childId]);
    }
  }, [childId]);

  const handleCheckOut = () => {
    if (!pickupName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre de quien recoge');
      return;
    }
    if (!signature.trim()) {
      Alert.alert('Error', 'Por favor firme para confirmar');
      return;
    }

    // Process checkout
    setChild({ ...child, checked_in: false, check_in_time: undefined });
    setShowSignatureModal(false);
    
    // Send notification
    notifyCheckOut(child.name, pickupName);
    
    Alert.alert(
      '✅ Salida Registrada',
      `${child.name} fue recogido por ${pickupName} a las ${new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })}`,
      [{ text: 'OK' }]
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem('parentAuth');
    router.replace('/');
  };

  if (!child) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Child Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{child.name[0]}</Text>
        </View>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childAge}>{child.age} años</Text>
        
        <View style={[styles.statusBadge, child.checked_in ? styles.statusIn : styles.statusOut]}>
          <Text style={styles.statusText}>
            {child.checked_in ? `✓ En el Nido desde ${child.check_in_time}` : 'No está en el Nido'}
          </Text>
        </View>
      </View>

      {/* Today's Report */}
      {child.today_report ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Reporte del Día</Text>
          <View style={styles.reportCard}>
            <View style={styles.reportItem}>
              <Text style={styles.reportLabel}>Comidas</Text>
              <Text style={styles.reportValue}>{child.today_report.meals}</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportLabel}>Siesta</Text>
              <Text style={styles.reportValue}>{child.today_report.nap}</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportLabel}>Actividades</Text>
              <Text style={styles.reportValue}>{child.today_report.activities}</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportLabel}>Estado de Ánimo</Text>
              <Text style={styles.reportValue}>{child.today_report.mood}</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportLabel}>Notas</Text>
              <Text style={styles.reportValue}>{child.today_report.notes}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Reporte del Día</Text>
          <View style={styles.noReport}>
            <Text style={styles.noReportText}>
              El reporte del día estará disponible cuando {child.name} esté en el Nido.
            </Text>
          </View>
        </View>
      )}

      {/* Checkout Button */}
      {child.checked_in && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => setShowSignatureModal(true)}
          >
            <Text style={styles.checkoutButtonText}>👋 Registrar Salida</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={logout}>
          <Text style={styles.actionButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Signature Modal */}
      <Modal
        visible={showSignatureModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Salida</Text>
            <Text style={styles.modalSubtitle}>
              Complete los datos para recoger a {child.name}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre de quien recoge</Text>
              <TextInput
                style={styles.input}
                value={pickupName}
                onChangeText={setPickupName}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Firma (escriba su nombre)</Text>
              <TextInput
                style={[styles.input, styles.signatureInput]}
                value={signature}
                onChangeText={setSignature}
                placeholder="Firme aquí"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowSignatureModal(false);
                  setPickupName('');
                  setSignature('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleCheckOut}
              >
                <Text style={styles.confirmButtonText}>Confirmar Salida</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  header: {
    backgroundColor: '#95D5B2',
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#95D5B2',
  },
  childName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  childAge: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  statusBadge: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusIn: {
    backgroundColor: '#4ECDC4',
  },
  statusOut: {
    backgroundColor: '#FF6B35',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  reportItem: {
    marginBottom: 20,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 5,
  },
  reportValue: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  noReport: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  noReportText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  signatureInput: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
