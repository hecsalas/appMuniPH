import 'package:app369/camara.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SosPage extends StatefulWidget {
  const SosPage({super.key});

  @override
  State<SosPage> createState() => _SosPageState();
}

class _SosPageState extends State<SosPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text(
          "EMERGENCIAS",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: Colors.red.shade900,
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "SEGURIDAD LOCAL",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            _buildSosBoton(
              icon: Icons.security,
              label: "Seguridad Ciudadana",
              phone: "1449",
              color: Colors.blue.shade800,
            ),
            _buildSosBoton(
              icon: Icons.medical_services,
              label: "Ambulancia Municipal",
              phone: "966278243",
              color: Colors.green.shade700,
            ),

            const SizedBox(height: 25),
            const Text(
              "EMERGENCIAS NACIONALES",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            _buildSosBoton(
              icon: Icons.local_police,
              label: "Carabineros (133)",
              phone: "133",
              color: Colors.blueGrey.shade800,
            ),
            _buildSosBoton(
              icon: Icons.local_fire_department,
              label: "Bomberos (132)",
              phone: "132",
              color: Colors.red.shade700,
            ),
            _buildSosBoton(
              icon: Icons.health_and_safety,
              label: "SAMU (131)",
              phone: "131",
              color: Colors.orange.shade800,
            ),
            const Divider(color: Colors.white24, height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ReportPage()),
                  );
                },
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
                      Icon(
                        Icons.camera_alt_outlined,
                        color: Colors.blue.shade900,
                        size: 28,
                      ),
                      const SizedBox(width: 20),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Reportar Incidencia',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward_ios,
                        size: 16,
                        color: Colors.grey,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSosBoton({
    required IconData icon,
    required String label,
    required String phone,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadiusGeometry.circular(15),
      ),
      child: ListTile(
        tileColor: color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadiusGeometry.circular(15),
        ),
        leading: Icon(icon, color: Colors.white, size: 30),
        title: Text(
          label,
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        subtitle: Text(phone, style: const TextStyle(color: Colors.white70)),
        trailing: const Icon(Icons.call, color: Colors.white),
        onTap: () => launchUrl(Uri.parse('tel:$phone')),
      ),
    );
  }
}
