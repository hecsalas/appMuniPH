import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:intl/intl.dart';

class HistorialPage extends StatefulWidget {
  const HistorialPage({super.key});

  @override
  State<HistorialPage> createState() => _HistorialPageState();
}

class _HistorialPageState extends State<HistorialPage> {
  final _supabase = Supabase.instance.client;
  bool _isLoading = true;
  List<Map<String, dynamic>> _historial = [];

  @override
  void initState() {
    super.initState();
    _fetchHistorial();
  }

  Future<void> _fetchHistorial() async {
    setState(() => _isLoading = true);
    try {
      final List<dynamic> data = await _supabase
          .from('solicitudes_canje')
          .select('*, comercios(nombre_fantasia, categoria), beneficios(titulo)')
          .order('created_at', ascending: false);

      setState(() {
        _historial = data.map((e) => Map<String, dynamic>.from(e)).toList();
        _isLoading = false;
      });
    } catch (e) {
      debugPrint("Error fetching history: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text(
          "MI HISTORIAL",
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
            colors: [Colors.blue, Colors.lightGreen],
          ),
        ),
        child: RefreshIndicator(
          onRefresh: _fetchHistorial,
          color: Colors.blue.shade900,
          child: _isLoading
              ? const Center(child: CircularProgressIndicator(color: Colors.white))
              : _historial.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: _historial.length,
                      itemBuilder: (context, index) {
                        final item = _historial[index];
                        return _buildHistoryItem(item);
                      },
                    ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.7,
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history_rounded, size: 80, color: Colors.white.withOpacity(0.5)),
            const SizedBox(height: 16),
            const Text(
              "Aún no tienes canjes registrados",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Text(
              "Tus beneficios usados aparecerán aquí",
              style: TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryItem(Map<String, dynamic> item) {
    final estado = item['estado'] ?? 'Pendiente';
    final comercio = item['comercios']?['nombre_fantasia'] ?? 'Comercio';
    final beneficio = item['beneficios']?['titulo'] ?? 'Beneficio';
    final categoria = item['comercios']?['categoria'] ?? 'General';
    final fechaRaw = item['created_at'];
    
    String fecha = "Reciente";
    if (fechaRaw != null) {
      try {
        final dt = DateTime.parse(fechaRaw).toLocal();
        fecha = DateFormat('dd MMM yyyy, HH:mm').format(dt);
      } catch (_) {}
    }

    return Card(
      elevation: 6,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Container(
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(
                color: _getStatusColor(estado),
                width: 6,
              ),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                // Icono decorativo
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _getStatusColor(estado).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _getCategoryIcon(categoria),
                    color: _getStatusColor(estado),
                    size: 26,
                  ),
                ),
                const SizedBox(width: 16),
                // Información
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        comercio,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.black54,
                        ),
                      ),
                      Text(
                        beneficio,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.calendar_today, size: 12, color: Colors.grey.shade600),
                          const SizedBox(width: 4),
                          Text(
                            fecha,
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Badge de estado
                _buildStatusBadge(estado),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String estado) {
    final color = _getStatusColor(estado);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        estado.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  Color _getStatusColor(String estado) {
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return Colors.green.shade700;
      case 'rechazado':
        return Colors.red.shade700;
      case 'cancelado':
        return Colors.orange.shade700;
      case 'pendiente':
        return Colors.blue.shade700;
      default:
        return Colors.grey.shade700;
    }
  }

  IconData _getCategoryIcon(String cat) {
    switch (cat.toLowerCase()) {
      case 'mascotas': return Icons.pets_rounded;
      case 'salud': return Icons.medical_services_rounded;
      case 'educación': return Icons.school_rounded;
      case 'alimentos': return Icons.restaurant_rounded;
      case 'entretenimiento': return Icons.local_activity_rounded;
      default: return Icons.local_offer_rounded;
    }
  }
}
