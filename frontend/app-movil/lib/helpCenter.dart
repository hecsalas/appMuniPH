import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpcenterPage extends StatefulWidget {
  const HelpcenterPage({super.key});

  @override
  State<HelpcenterPage> createState() => _HelpcenterPageState();
}

class _HelpcenterPageState extends State<HelpcenterPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        toolbarHeight: 100,
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        foregroundColor: Colors.white,
        title: const Padding(
          padding: EdgeInsets.only(top: 20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "CENTRO DE AYUDA",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
        ),
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.green.shade800, Colors.blue.shade800],
          ),
        ),
        child: SingleChildScrollView(
          physics: const NeverScrollableScrollPhysics(),
          padding: EdgeInsets.fromLTRB(20.0, 120.0, 20.0, 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Contáctanos",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 15),

              _buildContactCard(
                icon: Icons.phone_rounded,
                title: "Llamar a la Municipalidad",
                subtitle: "+56 2 2430 6000",
                onTap: () => launchUrl(Uri.parse("tel:56224306000")),
              ),
              _buildContactCard(
                icon: Icons.email_rounded,
                title: "Escribir un correo",
                subtitle: "contacto@mph.cl",
                onTap: () => launchUrl(Uri.parse("mailto:contacto@mph.cl")),
              ),
              _buildContactCard(
                icon: Icons.chat_bubble_rounded,
                title: "Chat de soporte (WhatsApp)",
                subtitle: "Lun a Vie, 9:00 - 14:00 hrs.",
                onTap: () => launchUrl(Uri.parse("https://wa.me/56962296332")),
              ),
              _buildContactCard(
                icon: Icons.location_on_rounded,
                title: "Oficinas municipales",
                subtitle: "San Alberto Hurtado 3295",
                onTap: () {}, // Aquí podrías abrir el mapa
              ),

              const SizedBox(height: 8),
              const Text(
                "Preguntas frecuentes",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),

              // CAJA BLANCA PARA LAS PREGUNTAS (FAQ)
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    _buildFaqItem(
                      "¿Cómo obtengo mi Tarjeta Vecino Digital?",
                      "Tu tarjeta se genera automáticamente al iniciar sesión. La encuentras en la pestaña Perfil.",
                    ),
                    _buildFaqItem(
                      "¿Cómo reporto un problema en mi barrio?",
                      "Ve a la pestaña SOS y presiona el botón 'Reportar Incidencia' para enviar una foto del problema.",
                    ),
                    _buildFaqItem(
                      "¿Cómo accedo a los beneficios?",
                      "Debes tener tu Tarjeta Vecino activa y presentar el código QR en los locales asociados.",
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 100),
              // Espacio para que el SnakeBar no tape nada
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Icon(icon, color: Colors.blue.shade900),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 13, color: Colors.grey),
        ),
      ),
    );
  }

  Widget _buildFaqItem(String question, String answer) {
    return Container(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
      ),
      child: ExpansionTile(
        title: Text(
          question,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              answer,
              style: const TextStyle(color: Colors.black54, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
