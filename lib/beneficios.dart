import 'package:app369/comercio.dart';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
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
      'telefono': '+56 2 1234 5678',
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
      'telefono': '+56 9 9876 5432',
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
      'telefono': '+56 2 2222 3333',
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
      'telefono': '+56 2 4444 5555',
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
      'telefono': '+56 2 6666 7777',
      'beneficios': [
        {'titulo': '15% en Productos ópticos', 'dias': 'Lunes a Sábado', 'horario': 'Horario de Atención', 'condiciones': 'Atención en local, No acumulable'},
        {'titulo': 'Lente monofocal desde \$25.000', 'dias': 'Lunes a Sábado', 'horario': 'Horario de Atención', 'condiciones': 'Atención en local'},
      ],
      'direccion': 'El Manzano Sur N°1261, Padre Hurtado',
      'latlng': const LatLng(-33.57334196235139, -70.82780493383449),
    },
    {
      'titulo': 'Otto Fritz',
      'categoria': 'Entretenimiento y Comida',
      'icono': Icons.local_activity_rounded,
      'color': Colors.cyan,
      'telefono': '+56 2 8888 9999',
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
      'telefono': '+56 2 1111 2222',
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
      'telefono': '+56 2 3333 4444',
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
      'telefono': '+56 2 2810 1600',
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
      backgroundColor: Colors.transparent,
      builder: (context) {
        final sucursal = item['sucursal_seleccionada'] ?? "";
        final beneficios = item['beneficios'] as List;

        return Container(
          height: MediaQuery.of(context).size.height * 0.9,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(35)),
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. HEADER CON FONDO DE COLOR Y ICONO
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: item['color'].withOpacity(0.8),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(35)),
                      ),
                      child: Center(
                        child: _buildIcon(item['icono'], size: 80, color: Colors.white24),
                      ),
                    ),
                    Positioned(
                      top: 20,
                      left: 20,
                      child: CircleAvatar(
                        backgroundColor: Colors.white.withOpacity(0.3),
                        child: IconButton(icon: const Icon(Icons.close, color: Colors.white), onPressed: () => Navigator.pop(context)),
                      ),
                    ),
                    // Logo "flotante" por encima de la unión
                    Positioned(
                      bottom: -40,
                      left: 25,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 15,
                              offset: const Offset(0, 8),
                            )
                          ],
                        ),
                        child: Container(
                          width: 90,
                          height: 90,
                          decoration: BoxDecoration(
                            color: item['color'].withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: _buildIcon(item['icono'], size: 45, color: item['color']),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 50),

                // 2. TÍTULO Y INFO BÁSICA
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['titulo'] + (sucursal.isNotEmpty ? " - $sucursal" : ""),
                        style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        item['categoria'],
                        style: TextStyle(color: item['color'], fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 15),
                      
                      // RATING SIMULADO
                      Row(
                        children: List.generate(5, (index) => Icon(Icons.star, color: index < 4 ? Colors.amber : Colors.grey.shade300, size: 20)),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 25),

                // 3. BLOQUE DE INFORMACIÓN (DIRECCIÓN, HORARIO, TELÉFONO)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(color: Colors.grey.shade100),
                  ),
                  child: Column(
                    children: [
                      _buildPremiumInfoRow(Icons.location_on, item['direccion'] ?? ""),
                      const Divider(height: 30),
                      _buildPremiumInfoRow(Icons.access_time_filled, "Horario de Atención"),
                      const Divider(height: 30),
                      _buildPremiumInfoRow(Icons.phone, item['telefono'] ?? "Sin teléfono"),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // 4. BENEFICIOS DISPONIBLES
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 25),
                  child: Text("Beneficios disponibles para ti", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 15),

                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: beneficios.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final b = beneficios[index];
                    final available = _isAvailableNow(b['dias'] ?? "", b['horario'] ?? "");
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: available ? Colors.white : Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: available ? Colors.grey.shade200 : Colors.grey.shade100),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: available ? Colors.green.shade50 : Colors.grey.shade100,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.local_offer,
                              color: available ? Colors.green : Colors.grey,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  b['titulo'],
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: available ? Colors.black87 : Colors.grey,
                                  ),
                                ),
                                Text(
                                  b['dias'],
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: available ? Colors.green.shade50 : Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              available ? "Disponible" : "Cerrado",
                              style: TextStyle(
                                color: available ? Colors.green : Colors.grey.shade600,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),

                const SizedBox(height: 30),

                // 5. BOTÓN PRINCIPAL
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: Column(
                    children: [
                      ElevatedButton(
                        onPressed: () => _mostrarSolicitudBeneficio(item, context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green.shade700,
                          minimumSize: const Size(double.infinity, 60),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          elevation: 5,
                          shadowColor: Colors.green.withOpacity(0.3),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.local_offer, color: Colors.white),
                            SizedBox(width: 10),
                            Text("SOLICITAR BENEFICIO", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (item['latlng'] != null)
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ComercioPage(initialLocation: item['latlng']),
                              ),
                            );
                          },
                          icon: const Icon(Icons.map_rounded, color: Colors.black87),
                          label: const Text(
                            "VER UBICACIÓN EN MAPA",
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey.shade200,
                            minimumSize: const Size(double.infinity, 55),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                            elevation: 0,
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 50),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildIcon(dynamic iconData, {double size = 24, Color? color}) {
    if (iconData is IconData) {
      // Intentamos detectar si es un icono de FontAwesome por su tipo de dato o familia
      // En la mayoría de las versiones, FaIcon es necesario para renderizar correctamente
      if (iconData.fontFamily?.toLowerCase().contains('fontawesome') ?? false) {
        return FaIcon(iconData as dynamic, size: size, color: color);
      }
      return Icon(iconData, size: size, color: color);
    }
    return Icon(Icons.help_outline, size: size, color: color);
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
              const Text("Selecciona tu beneficio", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: beneficios.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final b = beneficios[index];
                    final available = _isAvailableNow(b['dias'] ?? "", b['horario'] ?? "");
                    return InkWell(
                      onTap: available ? () => _confirmarCanje(context, b) : null,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: available ? Colors.white : Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: available ? Colors.green.shade200 : Colors.grey.shade200),
                          boxShadow: available ? [BoxShadow(color: Colors.green.withOpacity(0.05), blurRadius: 10)] : null,
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.local_offer_rounded, color: available ? Colors.green : Colors.grey),
                            const SizedBox(width: 15),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(b['titulo'], style: TextStyle(fontWeight: FontWeight.bold, color: available ? Colors.black87 : Colors.grey)),
                                  Text(available ? "✓ Disponible ahora" : "× Fuera de horario", 
                                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: available ? Colors.green : Colors.grey)),
                                ],
                              ),
                            ),
                            if (available)
                              const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.green),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 30),
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
            const Text("¿Deseas activar el beneficio:"),
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
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade700, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
            child: const Text("CONFIRMAR", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumInfoRow(IconData icon, String text) {
    return Row(
      children: [
        _buildIcon(icon, color: Colors.blue.shade900, size: 22),
        const SizedBox(width: 15),
        Expanded(child: Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87))),
      ],
    );
  }
}
