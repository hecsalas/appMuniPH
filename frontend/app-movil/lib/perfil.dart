import 'package:app369/datos.dart';
import 'package:app369/helpCenter.dart';
import 'package:app369/inicio.dart';
import 'package:app369/notificaciones.dart';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class PerfilPage extends StatefulWidget {
  const PerfilPage({super.key});

  @override
  State<PerfilPage> createState() => _PerfilPageState();
}

class _PerfilPageState extends State<PerfilPage> {
  Future<void> _cerrarSesion() async {
    final url = Uri.parse("http://mph-web.mph/claveunica/logout");

    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint("Error al abrir logout: $e");
    }

    // Independientemente de si se abre la URL, limpiamos la sesión local y redirigimos
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const InicioPage()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text(
            "MI PERFIL",
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
          ),
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          automaticallyImplyLeading: false,
        ),
      body: SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            _buildMenuOpciones(
              icon: Icons.person_outline,
              titulo: "Datos Personales",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => DatosPage()),
                );
              },
            ),
            _buildMenuOpciones(
              icon: Icons.notifications_none_rounded,
              titulo: "Notificaciones",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => NotificationsPage()),
                );
              },
            ),
            _buildMenuOpciones(
              icon: Icons.help_outline_rounded,
              titulo: "Centro de Ayuda",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => HelpcenterPage()),
                );
              },
            ),
            const SizedBox(height: 6),

            Center(
              child: TextButton.icon(
                onPressed: _cerrarSesion,
                icon: const Icon(
                  Icons.logout_rounded,
                  color: Colors.white70,
                  size: 20,
                ),
                label: const Text(
                  "Cerrar Sesión",
                  style: TextStyle(
                    color: Colors.white70,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  backgroundColor: Colors.white.withAlpha(30),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
      ),
    );
  }
}

Widget _buildMenuOpciones({
  required IconData icon,
  required String titulo,
  required VoidCallback onTap,
}) {
  return Card(
    elevation: 4,
    margin: const EdgeInsets.symmetric(vertical: 8),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadiusGeometry.circular(20),
    ),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Colors.blue.shade50],
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.blue.shade900, size: 28),
            const SizedBox(width: 20),
            Expanded(
              child: Text(
                titulo,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          ],
        ),
      ),
    ),
  );
}
