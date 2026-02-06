import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyCheckIn } from '../../src/lib/notifications';

// Demo data (replace with Supabase in production)
const DEMO_STUDENTS = [
  { id: '1', name: 'María García', age: 4, parent_name: 'Ana García', access_code: 'MARIA2024', checked_in: false },
  { id: '2', name: 'Carlos López', age: 3, parent_name: 'Roberto López', access_code: 'CARLOS2024', checked_in: true, check_in_time: '8:30 AM' },
  { id: '3', name: 'Sofía Martínez', age: 5, parent_name: 'Laura Martínez', access_code: 'SOFIA2024', checked_in: true, check_in_time: '7:45 AM' },
];

interface Student {
  id: string;
  name: string;
  age: number;
  parent_name: string;
  access_code: string;
  checked_in: boolean;
  check_in_time?: string;
}

export default function DirectorDashboard() {
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const auth = await AsyncStorage.getItem('directorAuth');
    if (!auth) {
      router.replace('/director');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleCheckIn = async (student: Student) => {
    const newStudents = students.map(s => {
      if (s.id === student.id) {
        const newCheckedIn = !s.checked_in;
        if (newCheckedIn) {
          // Send notification
          notifyCheckIn(s.name);
        }
        return {
          ...s,
          checked_in: newCheckedIn,
          check_in_time: newCheckedIn ? new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return s;
    });
    setStudents(newStudents);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('directorAuth');
    router.replace('/');
  };

  const checkedInCount = students.filter(s => s.checked_in).length;
  const totalCount = students.length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
      }
    >
      {/* Stats Header */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{checkedInCount}</Text>
          <Text style={styles.statLabel}>Presentes</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSecondary]}>
          <Text style={styles.statNumber}>{totalCount - checkedInCount}</Text>
          <Text style={styles.statLabel}>Por llegar</Text>
        </View>
        <View style={[styles.statCard, styles.statCardTertiary]}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>
        {new Date().toLocaleDateString('es-HN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>

      {/* Student List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estudiantes</Text>
        
        {students.map(student => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={[styles.avatar, student.checked_in && styles.avatarCheckedIn]}>
                <Text style={styles.avatarText}>{student.name[0]}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentMeta}>{student.age} años • {student.parent_name}</Text>
                {student.checked_in && (
                  <Text style={styles.checkInTime}>✓ Llegó: {student.check_in_time}</Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.checkButton, student.checked_in && styles.checkButtonActive]}
              onPress={() => toggleCheckIn(student)}
            >
              <Text style={styles.checkButtonText}>
                {student.checked_in ? '✓' : 'Registrar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Nuevo Reporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👶</Text>
            <Text style={styles.actionLabel}>Agregar Niño</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={logout}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionLabel}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  statCardSecondary: {
    backgroundColor: '#FF6B35',
  },
  statCardTertiary: {
    backgroundColor: '#95D5B2',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  dateText: {
    textAlign: 'center',
    color: '#636E72',
    fontSize: 16,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarCheckedIn: {
    backgroundColor: '#4ECDC4',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  studentMeta: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 2,
  },
  checkInTime: {
    fontSize: 12,
    color: '#4ECDC4',
    marginTop: 4,
    fontWeight: '500',
  },
  checkButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  checkButtonText: {
    fontWeight: '600',
    color: '#2D3436',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
  },
});
