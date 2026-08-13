import 'package:app369/comercio.dart';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class BeneficiosPage extends StatefulWidget {
  final String? initialBenefitTitle;
  final String? initialSucursal;
  const BeneficiosPage({super.key, this.initialBenefitTitle, this.initialSucursal});

  @override
  State<BeneficiosPage> createState() => _BeneficiosPageState();
}

class _BeneficiosPageState extends State<BeneficiosPage> {
  @override
  void initState() {
    super.initState();
    if (widget.initialBenefitTitle != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _abrirModalPorTitulo(widget.initialBenefitTitle!, sucursal: widget.initialSucursal);
      });
    }
  }

  void _abrirModalPorTitulo(String titulo, {String? sucursal}) {
    final item = [..._beneficiosComercios, ..._beneficiosMunicipales].firstWhere(
      (element) => element['titulo'].toString().toLowerCase() == titulo.toLowerCase(),
      orElse: () => {},
    );

    if (item.isNotEmpty) {
      if (sucursal != null) {
        item['sucursal_seleccionada'] = sucursal;
      }
      _mostrarDetallesBeneficio(item, context);
    }
  }

  final List<Map<String, dynamic>> _beneficiosComercios = [
    {
      'titulo': 'Casa Guau',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.brown,
      'beneficios': [
        {'titulo': '10% Alimentos Húmedos y Accesorios', 'dias': 'Lunes', 'horario': 'Horario de Atención', 'condiciones': 'Mayor 18 años'},
        {'titulo': '5% Sacos de Alimento', 'dias': 'Lunes', 'horario': 'Horario de Atención', 'condiciones': 'Mayor 18 años'},
      ],
      'direccion': 'Papa Juan XXIII N°1240, Padre Hurtado',
      'latlng': const LatLng(-33.57334196235139, -70.82780493383449),
    },
    {
      'titulo': 'Clínica del Sol',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.tooth,
      'color': Colors.blue.shade200,
      'beneficios': [
        {'titulo': '15% Prestaciones Odontológicas', 'dias': 'Todos los días', 'horario': 'Horario de Atención', 'condiciones': 'Tarjeta Vecino'},
        {'titulo': '17% Tratamientos Dentales', 'dias': 'Todos los días', 'horario': 'Horario de Atención', 'condiciones': 'Tarjeta Vecino'},
      ],
      'direccion': 'San Ignacio N°1624 local 16 y 17, Padre Hurtado',
      'latlng': const LatLng(-33.5611360599154, -70.82747058214169),
    },
    {
      'titulo': 'Escuela del Valle',
      'categoria': 'Educación',
      'icono': Icons.directions_car_rounded,
      'color': Colors.red,
      'beneficios': [
        {'titulo': '30% en Clase B, C, D', 'dias': 'Lunes a Viernes', 'horario': '10:00 a 14:00 - 16:00 a 20:00', 'condiciones': 'Mayor 18, Presencial, Tarjeta Vecino'},
        {'titulo': '30% en Clases Profesionales (A2 a A5)', 'dias': 'Lunes a Viernes', 'horario': '10:00 a 14:00 - 16:00 a 20:00', 'condiciones': 'Mayor 18, Presencial, Tarjeta Vecino'},
      ],
      'direccion': 'Rodolfo Jaramillo N°2523, Padre Hurtado',
      'latlng': const LatLng(-33.564232834951014, -70.82255738057556),
    },
    {
      'titulo': "Licorería Charl's",
      'categoria': 'Bebidas Alcohólicas',
      'icono': Icons.local_bar_rounded,
      'color': Colors.grey,
      'beneficios': [
        {'titulo': '10% en Vinos y Cervezas', 'dias': 'Martes', 'horario': 'Horario de Atención', 'condiciones': 'Pago efectivo, Mayor 18 años'},
        {'titulo': '10% en Destilados', 'dias': 'Miércoles', 'horario': 'Horario de Atención', 'condiciones': 'Pago efectivo, Mayor 18 años'},
      ],
      'direccion': 'San Genaro N°2605, local 1, Padre Hurtado',
      'latlng': const LatLng(-33.56409908847409, -70.82447630409058),
    },
    {
      'titulo': 'Optica Optik V&C',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.glasses,
      'color': Colors.deepPurpleAccent,
      'beneficios': [
        {'titulo': '15% en Productos ópticos', 'dias': 'Lunes a Sábado', 'horario': 'Horario de Atención', 'condiciones': 'Atención en local, No acumulable'},
        {'titulo': 'Lente monofocal desde \$25.000', 'dias': 'Lunes a Sábado', 'horario': 'Horario de Atención', 'condiciones': 'Atención en local'},
      ],
      'direccion': 'El Manzano Sur N°1261, Padre Hurtado',
      'latlng': const LatLng(-33.57384623693479, -70.80304424272943),
    },
    {
      'titulo': 'Otto Fritz',
      'categoria': 'Entretenimiento y Comida',
      'icono': Icons.local_activity_rounded,
      'color': Colors.cyan,
      'beneficios': [
        {'titulo': '15% en Restaurant', 'dias': 'Lunes a Domingo', 'horario': 'Horario de Atención', 'condiciones': 'No acumulable'},
        {'titulo': '\$8.000 Entrada Parque Acuático', 'dias': 'Lunes a Viernes', 'horario': 'Horario de Atención', 'condiciones': 'Entrada solo por venta online'},
      ],
      'direccion': 'Av. Caupolican N°3461, Peñaflor',
      'latlng': const LatLng(-33.597966560136605, -70.88734338817774),
    },
    {
      'titulo': 'Restobar Ibridos',
      'categoria': 'Comida y Bebida',
      'icono': Icons.nightlife_rounded,
      'color': Colors.deepOrange,
      'beneficios': [
        {'titulo': '10% Total consumido', 'dias': 'Martes a Sábado', 'horario': '13:00 a 17:00', 'condiciones': 'Mayor de 18 años, No acumulable'},
        {'titulo': '10% Beneficio Funcionario Municipal', 'dias': 'Martes a Sábado', 'horario': '13:00 a 21:00', 'condiciones': 'Presentar credencial municipal'},
      ],
      'direccion': 'San Ignacio N°1180, Padre Hurtado',
      'latlng': const LatLng(-33.56495104660019, -70.82419764090052),
    },
    {
      'titulo': 'Veterinaria Rompecorreas',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.green,
      'beneficios': [
        {'titulo': '20% Consultas y Vacunas', 'dias': 'Lunes a Sábado', 'horario': '09:00 a 19:00', 'condiciones': 'Sin límite de uso'},
        {'titulo': '20% Esterilización y Procedimientos', 'dias': 'Lunes a Sábado', 'horario': '09:00 a 19:00', 'condiciones': 'No válido para urgencias'},
      ],
      'direccion': 'Rodolfo Jaramillo N°894, Padre Hurtado',
      'latlng': const LatLng(-33.56717678649047, -70.82316685745141),
    },
  ];

  final List<Map<String, dynamic>> _beneficiosMunicipales = [
    {
      'titulo': 'Bono por Logro Escolar Municipal',
      'categoria': 'Educación',
      'icono': Icons.school_rounded,
      'color': Colors.blue,
      'beneficios': [
        {'titulo': 'Apoyo compra de materiales', 'dias': 'Lunes a Viernes', 'horario': '09:00 a 14:00', 'condiciones': 'Residencia en PH, Certificado de notas'},
      ],
      'direccion': 'DIDECO - San Alberto Hurtado 3295',
    },
  ];

  bool _isAvailableNow(String dias, String horario) {
    final lowerDias = dias.toLowerCase();
    if (lowerDias == 'todos los días' || lowerDias == 'lunes a domingo') return _isWithinHorario(horario);

    final now = DateTime.now();
    final weekday = now.weekday; // 1 = Monday, 7 = Sunday

    if (lowerDias.contains('lunes') && weekday == 1) return _isWithinHorario(horario);
    if (lowerDias.contains('martes') && weekday == 2) return _isWithinHorario(horario);
    if (lowerDias.contains('miércoles') && weekday == 3) return _isWithinHorario(horario);
    if (lowerDias.contains('jueves') && weekday == 4) return _isWithinHorario(horario);
    if (lowerDias.contains('viernes') && weekday == 5) return _isWithinHorario(horario);
    if (lowerDias.contains('sábado') && weekday == 6) return _isWithinHorario(horario);
    if (lowerDias.contains('domingo') && weekday == 7) return _isWithinHorario(horario);

    if (lowerDias == 'lunes a viernes' && weekday >= 1 && weekday <= 5) return _isWithinHorario(horario);
    if (lowerDias == 'lunes a sábado' && weekday >= 1 && weekday <= 6) return _isWithinHorario(horario);

    return false;
  }

  bool _isWithinHorario(String horario) {
    final lowerHorario = horario.toLowerCase();
    if (lowerHorario == 'horario de atención' || lowerHorario == 'todo el día') return true;

    try {
      final now = DateTime.now();
      final currentTime = now.hour * 60 + now.minute;
      final cleanHorario = horario.replaceAll(' - ', ' a ');
      final parts = cleanHorario.split(' a ');
      if (parts.length == 2) {
        final startParts = parts[0].trim().split(':');
        final endParts = parts[1].trim().split(':');
        final start = int.parse(startParts[0]) * 60 + int.parse(startParts[1]);
        final end = int.parse(endParts[0]) * 60 + int.parse(endParts[1]);
        return currentTime >= start && currentTime <= end;
      }
    } catch (e) {
      debugPrint("Error parsing horario: $e");
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: Colors.transparent,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          title: const Text('BENEFICIOS', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          centerTitle: true,
          actions: [
            IconButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ComercioPage())),
              icon: const Icon(Icons.storefront_outlined),
              color: Colors.white,
            ),
            IconButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const HistorialPage())),
              icon: const Icon(Icons.local_offer_rounded),
              color: Colors.white,
            ),
          ],
          bottom: const TabBar(
            indicatorColor: Colors.green,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(icon: Icon(Icons.account_balance_rounded), text: "Municipales"),
              Tab(icon: Icon(Icons.storefront_rounded), text: "Comercios"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildListaBeneficios(_beneficiosMunicipales),
            _buildListaBeneficios(_beneficiosComercios),
          ],
        ),
      ),
    );
  }

  Widget _buildListaBeneficios(List<Map<String, dynamic>> lista) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemCount: lista.length,
      itemBuilder: (context, index) {
        final item = lista[index];
        final totalBeneficios = (item['beneficios'] as List).length;
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: item['color'].withOpacity(0.1),
              child: (item['icono'] is IconData)
                  ? Icon(item['icono'], color: item['color'])
                  : FaIcon(item['icono'], color: item['color'], size: 20),
            ),
            title: Text(item['titulo'], style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text("$totalBeneficios beneficios disponibles"),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => _mostrarDetallesBeneficio(item, context),
          ),
        );
      },
    );
  }

  void _mostrarDetallesBeneficio(Map<String, dynamic> item, BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
      builder: (context) {
        final sucursal = item['sucursal_seleccionada'] ?? "";
        final beneficios = item['beneficios'] as List;
        return Container(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                item['titulo'] + (sucursal.isNotEmpty ? " → $sucursal" : ""),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                item['categoria'].toUpperCase(),
                style: TextStyle(color: item['color'], fontWeight: FontWeight.w900, letterSpacing: 1.2),
              ),
              const Divider(height: 40),
              
              // RESUMEN DE BENEFICIOS
              ...beneficios.map((b) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16, color: Colors.green),
                    const SizedBox(width: 10),
                    Expanded(child: Text(b['titulo'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
                  ],
                ),
              )),

              const Divider(height: 40),
              _buildInfoRow(Icons.location_on_rounded, "Dirección", item['direccion'] ?? ""),
              const SizedBox(height: 30),
              
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    _mostrarSolicitudBeneficio(item, context);
                  },
                  icon: const Icon(Icons.check_circle_outline_rounded, color: Colors.white),
                  label: const Text("SOLICITAR BENEFICIO", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade700,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              if (item['latlng'] != null)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(context, MaterialPageRoute(builder: (context) => ComercioPage(initialLocation: item['latlng'])));
                    },
                    icon: const Icon(Icons.map_rounded, color: Colors.black87),
                    label: const Text("VER UBICACIÓN EN MAPA", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade200,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  void _mostrarSolicitudBeneficio(Map<String, dynamic> item, BuildContext context) {
    final beneficios = item['beneficios'] as List;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24.0),
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Beneficios disponibles para ti", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: beneficios.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final b = beneficios[index];
                    final available = _isAvailableNow(b['dias'] ?? "", b['horario'] ?? "");
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: available ? Colors.green.shade50 : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: available ? Colors.green.shade200 : Colors.grey.shade300),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.local_offer_rounded, color: available ? Colors.green : Colors.grey),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(b['titulo'], style: TextStyle(fontWeight: FontWeight.bold, color: available ? Colors.green.shade900 : Colors.grey.shade600)),
                                Text(available ? "✓ Disponible ahora" : "× Fuera de horario", 
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: available ? Colors.green : Colors.grey)),
                              ],
                            ),
                          ),
                          if (available)
                            ElevatedButton(
                              onPressed: () => _confirmarCanje(context, b),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade700, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                              child: const Text("Solicitar", style: TextStyle(color: Colors.white)),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              const Text("Selecciona el beneficio que deseas utilizar.", style: TextStyle(fontSize: 13, color: Colors.black45)),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  void _confirmarCanje(BuildContext context, Map<String, dynamic> beneficio) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        title: const Text("Confirmar uso"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("¿Deseas activar el beneficio:"),
            Text("${beneficio['titulo']}?", style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            const Text("Condiciones:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            Text(beneficio['condiciones'] ?? "Sin condiciones adicionales", style: const TextStyle(fontSize: 12)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("CANCELAR")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // Cerrar dialogo
              Navigator.pop(context); // Cerrar modal solicitud
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Beneficio solicitado: ${beneficio['titulo']}. Muestra tu pantalla en caja."), backgroundColor: Colors.green),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade700),
            child: const Text("CONFIRMAR", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    if (value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey.shade600),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                Text(value, style: const TextStyle(fontSize: 14)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
