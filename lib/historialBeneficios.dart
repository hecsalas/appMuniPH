import 'package:flutter/material.dart';

class HistorialPage extends StatefulWidget {
  const HistorialPage({super.key});

  @override
  State<HistorialPage> createState() => _HistorialPageState();
}

class _HistorialPageState extends State<HistorialPage> {
  // Datos de ejemplo para el historial
  final List<Map<String, dynamic>> _historial = [
    {
      'titulo': 'Gasco - Descuento 15%',
      'fecha': '01 Ago 2026',
      'isUsed': true,
      'categoria': 'Hogar',
      'icon': Icons.local_fire_department,
    },
    {
      'titulo': 'Farmacia Ibiza - \$2.000 dcto',
      'fecha': '25 Jul 2026',
      'isUsed': true,
      'categoria': 'Salud',
      'icon': Icons.local_pharmacy,
    },
    {
      'titulo': 'Dulce Reino - 2x1 Café',
      'fecha': '15 Jul 2026',
      'isUsed': false, // Vencido
      'categoria': 'Alimentos',
      'icon': Icons.coffee,
    },
    {
      'titulo': 'Ferretería El Martillo',
      'fecha': '10 Jul 2026',
      'isUsed': true,
      'categoria': 'Hogar',
      'icon': Icons.build,
    },
    {
      'titulo': 'Bono Invierno Municipal',
      'fecha': '30 Jun 2026',
      'isUsed': false, // Vencido
      'categoria': 'Social',
      'icon': Icons.ac_unit,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text(
          "HISTORIAL",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: Colors.blue.shade900,
        elevation: 0,
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.blue, Colors.lightGreen, Colors.brown],
            stops: [0.0, 0.6, 1.0],
          ),
        ),
        child: ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: _historial.length,
          itemBuilder: (context, index) {
            final item = _historial[index];
            return _buildHistoryItem(item);
          },
        ),
      ),
    );
  }

  Widget _buildHistoryItem(Map<String, dynamic> item) {
    final bool isUsed = item['isUsed'];

    return Card(
      elevation: 4,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // Icono con fondo circular suave
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isUsed ? Colors.blue.shade50 : Colors.grey.shade100,
                shape: BoxShape.circle,
              ),
              child: Icon(
                item['icon'],
                color: isUsed ? Colors.blue.shade900 : Colors.grey.shade600,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            // Información del beneficio
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item['titulo'],
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isUsed ? Colors.black87 : Colors.black45,
                      decoration: isUsed ? null : TextDecoration.lineThrough,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "${item['categoria']} • ${item['fecha']}",
                    style: TextStyle(
                      fontSize: 12,
                      color: isUsed ? Colors.grey.shade600 : Colors.grey.shade400,
                    ),
                  ),
                ],
              ),
            ),
            // Badge de estado
            _buildStatusBadge(isUsed),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(bool isUsed) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: isUsed ? Colors.green.shade50 : Colors.grey.shade200,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isUsed ? Colors.green.shade200 : Colors.grey.shade300,
        ),
      ),
      child: Text(
        isUsed ? "CANJEADO" : "VENCIDO",
        style: TextStyle(
          color: isUsed ? Colors.green.shade700 : Colors.grey.shade600,
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}
