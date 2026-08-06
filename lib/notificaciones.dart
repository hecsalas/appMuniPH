import 'package:flutter/material.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  // 1. Datos de ejemplo corregidos
  final List<Map<String, dynamic>> _notificaciones = [
    {
      'id': '1',
      'titulo': 'Corte de agua programado',
      'mensaje': 'Sector Sta. Rosa de Chena, desde las 15:00 hrs.',
      'hora': 'Hace 2 horas',
      'icon': Icons.water_drop,
      'color': Colors.blue,
    },
    {
      'id': '2',
      'titulo': 'Operativo de Salud',
      'mensaje': 'Vacunación mascotas en Plaza de Armas mañana.',
      'hora': 'Ayer',
      'icon': Icons.pets,
      'color': Colors.green,
    },
    {
      'id': '3',
      'titulo': 'Alerta de Clima',
      'mensaje': 'Se esperan fuertes lluvias para este fin de semana.',
      'hora': 'Hace 2 días',
      'icon': Icons.warning_amber_rounded,
      'color': Colors.red,
    },
  ];

  // 2. Funciones de lógica
  void _borrarNotificacion(int index) {
    setState(() {
      _notificaciones.removeAt(index);
    });
  }

  void _borrarTodo() {
    setState(() {
      _notificaciones.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text(
          "NOTIFICACIONES",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: Colors.blue.shade900,
        centerTitle: true,
        foregroundColor: Colors.white,
        actions: [
          if (_notificaciones.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_rounded),
              onPressed: _borrarTodo,
              tooltip: "Borrar todo",
            ),
        ],
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.blue, Colors.lightGreen],
          ),
        ),
        child: _notificaciones.isEmpty
            ? _buildEstadoVacio()
            : _buildListaNotificaciones(),
      ),
    );
  }

  // 3. Widgets de soporte (Ahora todos dentro de la clase)
  Widget _buildListaNotificaciones() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _notificaciones.length,
      itemBuilder: (context, index) {
        final item = _notificaciones[index];

        return Dismissible(
          key: Key(item['id']),
          direction: DismissDirection.endToStart,
          onDismissed: (direction) => _borrarNotificacion(index),
          background: Container(
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 20),
            margin: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: Colors.red.shade400,
              borderRadius: BorderRadius.circular(15),
            ),
            child: const Icon(
              Icons.delete_outline,
              color: Colors.white,
              size: 30,
            ),
          ),
          child: Card(
            elevation: 2,
            margin: const EdgeInsets.symmetric(vertical: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: item['color'].withOpacity(0.1),
                child: Icon(item['icon'], color: item['color']),
              ),
              title: Text(
                item['titulo'],
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(item['mensaje']),
              trailing: Text(
                item['hora'],
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildEstadoVacio() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 100,
            color: Colors.white.withOpacity(0.5),
          ),
          const SizedBox(height: 20),
          const Text(
            "¡Estás al día!",
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Text(
            "No tienes notificaciones pendientes",
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }
}