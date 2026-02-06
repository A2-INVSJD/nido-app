import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🐣</Text>
          <Text style={styles.logoText}>Nido Montessori</Text>
        </View>
        <Text style={styles.tagline}>Donde cada niño florece</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Bienvenidos a{'\n'}Nido Montessori</Text>
        <Text style={styles.heroSubtitle}>
          Un espacio seguro y amoroso donde los pequeños descubren, 
          aprenden y crecen siguiendo la metodología Montessori.
        </Text>
      </View>

      {/* Portal Buttons */}
      <View style={styles.portals}>
        <Link href="/director" asChild>
          <TouchableOpacity style={styles.portalButton}>
            <Text style={styles.portalIcon}>👩‍💼</Text>
            <Text style={styles.portalTitle}>Portal Director</Text>
            <Text style={styles.portalDesc}>Gestión de estudiantes y reportes</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/parent" asChild>
          <TouchableOpacity style={[styles.portalButton, styles.portalParent]}>
            <Text style={styles.portalIcon}>👨‍👩‍👧</Text>
            <Text style={styles.portalTitle}>Portal Padres</Text>
            <Text style={styles.portalDesc}>Ver reportes y registrar salidas</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Nuestros Servicios</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📚</Text>
            <Text style={styles.featureLabel}>Educación Montessori</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🍎</Text>
            <Text style={styles.featureLabel}>Alimentación Nutritiva</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureLabel}>Arte y Creatividad</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌳</Text>
            <Text style={styles.featureLabel}>Juego al Aire Libre</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.contact}>
        <Text style={styles.contactTitle}>Contáctanos</Text>
        <Text style={styles.contactInfo}>📍 San Pedro Sula, Honduras</Text>
        <Text style={styles.contactInfo}>📞 +504 9351-8599</Text>
        <Text style={styles.contactInfo}>🕐 Lunes a Viernes: 7:00 AM - 6:00 PM</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Nido Montessori</Text>
        <Text style={styles.footerText}>Hecho con ❤️ para nuestras familias</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    textAlign: 'center',
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
    fontSize: 16,
  },
  hero: {
    padding: 30,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  portals: {
    paddingHorizontal: 20,
    gap: 15,
  },
  portalButton: {
    backgroundColor: '#4ECDC4',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  portalParent: {
    backgroundColor: '#95D5B2',
  },
  portalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  portalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  portalDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  features: {
    padding: 30,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 35,
    marginBottom: 10,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  contact: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  contactInfo: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 8,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#636E72',
  },
});
