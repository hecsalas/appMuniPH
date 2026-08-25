import 'package:supabase_flutter/supabase_flutter.dart';

class BeneficiosService {
  final _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> fetchComerciosReal() async {
    final List<dynamic> data = await _supabase
        .from('comercios')
        .select('*, sucursales(*), beneficios(*)');
    return data.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  bool isAvailableNow(String dias, String horario) {
    // Aquí iría la lógica de normalización y chequeo de horario
    // que actualmente está en beneficios.dart
    return true; // Simplificado por ahora
  }

  Future<void> registrarCanje({
    required String comercioId,
    required String beneficioId,
    required String vecinoNombre,
  }) async {
    await _supabase.from('solicitudes_canje').insert({
      'comercio_id': comercioId,
      'beneficio_id': beneficioId,
      'vecino_nombre': vecinoNombre,
      'estado': 'Pendiente',
      'fecha_solicitud': DateTime.now().toIso8601String(),
    });
  }
}
