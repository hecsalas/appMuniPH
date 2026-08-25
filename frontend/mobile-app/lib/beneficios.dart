import 'dart:async';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class BeneficiosPage extends StatefulWidget {
  final String? initialBenefitTitle;
  final String? initialSucursal;

  const BeneficiosPage({
    super.key,
    this.initialBenefitTitle,
    this.initialSucursal,
  });

  @override
  State<BeneficiosPage> createState() => _BeneficiosPageState();
}

class _BeneficiosPageState extends State<BeneficiosPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _comerciosReal = [];
  bool _isLoading = true;

  // Estado de filtros
  String _selectedCategory = "Todas";
  bool _showOnlyAvailable = false;
  final List<String> _categories = [
    "Todas",
    "Salud",
    "Mascotas",
    "Alimentos",
    "Educación",
    "Deporte",
    "Bebidas",
    "Servicios",
    "Entretenimiento"
  ];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    try {
      final List<dynamic> data = await _supabase
          .from('comercios')
          .select('*, sucursales(*), beneficios(*)');

      setState(() {
        _comerciosReal = data.map((e) => Map<String, dynamic>.from(e)).toList();
        _isLoading = false;
      });

      if (widget.initialBenefitTitle != null) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _abrirModalPorTitulo(
            widget.initialBenefitTitle!,
            sucursal: widget.initialSucursal,
          );
        });
      }
    } catch (e) {
      debugPrint("Error fetching benefits from Supabase: $e");
      setState(() => _isLoading = false);
    }
  }

  void _abrirModalPorTitulo(String titulo, {String? sucursal}) {
    final item = _comerciosReal.firstWhere(
      (element) =>
          element['nombre_fantasia'].toString().toLowerCase() ==
          titulo.toLowerCase(),
      orElse: () => {},
    );

    if (item.isNotEmpty) {
      if (sucursal != null) {
        item['sucursal_escaneada_nombre'] = sucursal;
      }
      _mostrarDetallesBeneficio(item, context, isFromQR: true);
    }
  }

  final List<Map<String, dynamic>> _beneficiosMunicipales = [
    {
      'titulo': 'Bono por Logro Escolar Municipal',
      'categoria': 'Educación',
      'icono': Icons.school_rounded,
      'color': Colors.blue,
      'telefono': '+56 2 2810 1600',
      'beneficios': [
        {
          'titulo': 'Apoyo compra de materiales',
          'dias': 'Lunes a Viernes',
          'horario': '09:00 a 14:00',
          'condiciones': 'Residencia en PH, Certificado de notas',
        },
      ],
      'direccion': 'DIDECO - San Alberto Hurtado 3295',
    },
  ];

  String _normalizeText(String text) {
    var str = text.toLowerCase();
    const withDia = 'áéíóúü';
    const withoutDia = 'aeiouu';
    for (int i = 0; i < withDia.length; i++) {
      str = str.replaceAll(withDia[i], withoutDia[i]);
    }
    return str;
  }

  bool _isAvailableNow(String dias, String horario) {
    final normalizedDias = _normalizeText(dias);
    if (normalizedDias == 'todos los dias' ||
        normalizedDias == 'lunes a domingo' ||
        normalizedDias.isEmpty) {
      return _isWithinHorario(horario);
    }

    final now = DateTime.now();
    final weekday = now.weekday;

    final mapDias = {
      1: 'lunes',
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado',
      7: 'domingo',
    };

    final hoy = mapDias[weekday]!;

    if (normalizedDias.contains(hoy)) return _isWithinHorario(horario);

    if (normalizedDias.contains('lunes a viernes') &&
        weekday >= 1 &&
        weekday <= 5)
      return _isWithinHorario(horario);
    if (normalizedDias.contains('lunes a sabado') &&
        weekday >= 1 &&
        weekday <= 6)
      return _isWithinHorario(horario);

    return false;
  }

  bool _isWithinHorario(String horario) {
    final lowerHorario = horario.toLowerCase();
    if (lowerHorario == 'horario de atención' ||
        lowerHorario == 'todo el día' ||
        lowerHorario.isEmpty)
      return true;

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
          title: const Text(
            'BENEFICIOS',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
          ),
          centerTitle: true,
          actions: [
            IconButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const HistorialPage()),
              ),
              icon: const Icon(Icons.local_offer_rounded),
              color: Colors.white,
            ),
          ],
          bottom: const TabBar(
            indicatorColor: Colors.green,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(
                icon: Icon(Icons.account_balance_rounded),
                text: "Municipales",
              ),
              Tab(icon: Icon(Icons.storefront_rounded), text: "Comercios"),
            ],
          ),
        ),
        body: _isLoading
            ? const Center(
                child: CircularProgressIndicator(color: Colors.white),
              )
            : TabBarView(
                children: [
                  _buildListaBeneficios(
                    _beneficiosMunicipales,
                    isMunicipal: true,
                  ),
                  _buildComerciosTab(),
                ],
              ),
      ),
    );
  }

  Widget _buildComerciosTab() {
    final filteredList = _comerciosReal.where((comercio) {
      // 1. Filtro de Categoría
      final matchesCategory = _selectedCategory == "Todas" ||
          comercio['categoria'].toString().toLowerCase() ==
              _selectedCategory.toLowerCase();

      // 2. Filtro de Disponibilidad Real-Time
      bool hasAvailableBenefit = true;
      if (_showOnlyAvailable) {
        final benefits = comercio['beneficios'] as List? ?? [];
        hasAvailableBenefit = benefits.any((b) => _isAvailableNow(
              b['dias_uso'] ?? b['dias'] ?? "",
              b['horario_uso'] ?? b['horario'] ?? "",
            ));
      }

      return matchesCategory && hasAvailableBenefit;
    }).toList();

    return Column(
      children: [
        _buildFilterBar(),
        Expanded(
          child: _buildListaBeneficios(filteredList, isMunicipal: false),
        ),
      ],
    );
  }

  Widget _buildFilterBar() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        children: [
          // Filtro "Disponible Ahora" con icono de pulso
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              avatar: Icon(
                Icons.access_time_filled_rounded,
                size: 16,
                color: _showOnlyAvailable ? Colors.white : Colors.green,
              ),
              label: const Text("Disponible Ahora"),
              selected: _showOnlyAvailable,
              selectedColor: Colors.green,
              checkmarkColor: Colors.white,
              labelStyle: TextStyle(
                color: _showOnlyAvailable ? Colors.white : Colors.black87,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
              onSelected: (val) => setState(() => _showOnlyAvailable = val),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
          const VerticalDivider(width: 20, indent: 10, endIndent: 10),
          // Chips de Categorías
          ..._categories.map((cat) {
            final isSelected = _selectedCategory == cat;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(cat),
                selected: isSelected,
                selectedColor: Colors.blue.shade900,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
                onSelected: (val) {
                  if (val) setState(() => _selectedCategory = cat);
                },
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildListaBeneficios(
    List<Map<String, dynamic>> lista, {
    required bool isMunicipal,
  }) {
    if (lista.isEmpty) {
      return const Center(
        child: Text(
          "No hay beneficios disponibles",
          style: TextStyle(color: Colors.white70),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemCount: lista.length,
      itemBuilder: (context, index) {
        final item = lista[index];
        final nombre = isMunicipal ? item['titulo'] : item['nombre_fantasia'];
        final categoria = item['categoria'] ?? "General";
        final color = _getCategoryColor(categoria);
        final beneficios = item['beneficios'] as List;

        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              child: _buildIcon(
                isMunicipal ? item['icono'] : _getIconForCategory(categoria),
                color: color,
                size: 20,
              ),
            ),
            title: Text(
              nombre,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text("${beneficios.length} beneficios disponibles"),
            trailing: const Icon(Icons.chevron_right),
            onTap: () =>
                _mostrarDetallesBeneficio(item, context, isFromQR: false),
          ),
        );
      },
    );
  }

  Color _getCategoryColor(String cat) {
    switch (cat.toLowerCase()) {
      case 'mascotas':
        return Colors.brown;
      case 'salud':
        return Colors.blue;
      case 'educación':
        return Colors.red;
      case 'alimentos':
        return Colors.orange;
      case 'entretenimiento':
        return Colors.cyan;
      case 'deporte':
        return Colors.teal;
      case 'servicios':
        return Colors.blueGrey;
      case 'bebidas':
        return Colors.purple;
      default:
        return Colors.green;
    }
  }

  dynamic _getIconForCategory(String cat) {
    switch (cat.toLowerCase()) {
      case 'mascotas':
        return Icons.pets_rounded;
      case 'salud':
        return FontAwesomeIcons.heartPulse;
      case 'educación':
        return Icons.school_rounded;
      case 'alimentos':
        return Icons.restaurant_rounded;
      case 'entretenimiento':
        return Icons.local_activity_rounded;
      case 'deporte':
        return Icons.directions_bike_rounded;
      case 'servicios':
        return Icons.miscellaneous_services_rounded;
      case 'bebidas':
        return Icons.local_bar_rounded;
      default:
        return Icons.storefront_rounded;
    }
  }

  String? _getAssetPath(String nombre) {
    final n = nombre.toLowerCase();
    if (n.contains('casa guau')) return 'assets/casa-guau.png';
    if (n.contains('clinica del sol')) return 'assets/clinica-del-sol.png';
    if (n.contains('escuela del valle')) return 'assets/escuela-del-valle.png';
    if (n.contains('farmacia trebol') || n.contains('farmacia trébol'))
      return 'assets/farmacia-trebol.png';
    if (n.contains('rompecorreas')) return 'assets/rompecorreas.png';
    if (n.contains('sukatza')) return 'assets/sukatza.png';
    if (n.contains('zxtreme')) return 'assets/zxtreme.png';
    if (n.contains('fratello')) return 'assets/fratello.png';
    if (n.contains('mr. lucas') || n.contains('mr lucas'))
      return 'assets/mr-lucas.png';
    if (n.contains('odfjell')) return 'assets/odfjell.png';
    if (n.contains('gonzalez')) return 'assets/funeraria-gonzalez.png';
    return null;
  }

  void _mostrarDetallesBeneficio(
    Map<String, dynamic> item,
    BuildContext context, {
    required bool isFromQR,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
      showDragHandle: false,
      barrierColor: Colors.black54,
      builder: (context) {
        final sucursalEscaneada = item['sucursal_escaneada_nombre'] ?? "";
        final beneficios = item['beneficios'] as List;
        final categoria = item['categoria'] ?? "General";
        final color = _getCategoryColor(categoria);
        final icono = _getIconForCategory(categoria);
        final assetPath = _getAssetPath(
          item['nombre_fantasia'] ?? item['titulo'] ?? "",
        );

        return Container(
          height: MediaQuery.of(context).size.height * 0.9,
          clipBehavior: Clip.antiAlias,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(35)),
          ),
          child: Stack(
            children: [
              SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 250,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.8),
                        image: assetPath != null
                            ? DecorationImage(
                                image: AssetImage(assetPath),
                                fit: BoxFit.cover,
                                colorFilter: ColorFilter.mode(
                                  Colors.black.withOpacity(0.25),
                                  BlendMode.darken,
                                ),
                              )
                            : null,
                      ),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          if (assetPath == null)
                            Center(
                              child: _buildIcon(
                                icono,
                                size: 80,
                                color: Colors.white24,
                              ),
                            ),
                          Positioned(
                            top: 45,
                            left: 20,
                            child: CircleAvatar(
                              backgroundColor: Colors.white.withOpacity(0.3),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.close,
                                  color: Colors.white,
                                ),
                                onPressed: () => Navigator.pop(context),
                              ),
                            ),
                          ),
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
                                  ),
                                ],
                              ),
                              child: Container(
                                width: 90,
                                height: 90,
                                decoration: BoxDecoration(
                                  color: color.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: _buildIcon(
                                  icono,
                                  size: 45,
                                  color: color,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 50),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 25),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            (item['nombre_fantasia'] ?? item['titulo']) +
                                (sucursalEscaneada.isNotEmpty
                                    ? " - $sucursalEscaneada"
                                    : ""),
                            style: const TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            categoria,
                            style: TextStyle(
                              color: color,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 15),
                          Row(
                            children: List.generate(
                              5,
                              (index) => Icon(
                                Icons.star,
                                color: index < 4
                                    ? Colors.amber
                                    : Colors.grey.shade300,
                                size: 20,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 25),
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
                          _buildPremiumInfoRow(
                            Icons.location_on,
                            item['direccion_matriz'] ?? item['direccion'] ?? "",
                          ),
                          const Divider(height: 30),
                          _buildPremiumInfoRow(
                            Icons.access_time_filled,
                            "Horario Municipal Vigente",
                          ),
                          const Divider(height: 30),
                          _buildPremiumInfoRow(
                            Icons.phone,
                            item['telefono'] ?? "Sin teléfono",
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 25),
                      child: Text(
                        "Beneficios disponibles para ti",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: beneficios.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final b = beneficios[index];
                        final available = _isAvailableNow(
                          b['dias_uso'] ?? b['dias'] ?? "",
                          b['horario_uso'] ?? b['horario'] ?? "",
                        );
                        return Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: available
                                ? Colors.white
                                : Colors.grey.shade50,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: available
                                  ? Colors.grey.shade200
                                  : Colors.grey.shade100,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: available
                                      ? Colors.green.shade50
                                      : Colors.grey.shade100,
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
                                        color: available
                                            ? Colors.black87
                                            : Colors.grey,
                                      ),
                                    ),
                                    Text(
                                      b['dias_uso'] ?? b['dias'] ?? "",
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: available
                                      ? Colors.green.shade50
                                      : Colors.grey.shade200,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  available ? "Disponible" : "Cerrado",
                                  style: TextStyle(
                                    color: available
                                        ? Colors.green
                                        : Colors.grey.shade600,
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
                    if (isFromQR)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 25),
                        child: Column(
                          children: [
                            ElevatedButton(
                              onPressed: () =>
                                  _mostrarSolicitudBeneficio(item, context),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green.shade700,
                                minimumSize: const Size(double.infinity, 60),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                elevation: 5,
                                shadowColor: Colors.green.withOpacity(0.3),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.local_offer, color: Colors.white),
                                  SizedBox(width: 10),
                                  Text(
                                    "SOLICITAR BENEFICIO",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
                        ),
                      ),
                    const SizedBox(height: 50),
                  ],
                ),
              ),
              Positioned(
                top: 12,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(2.5),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _mostrarSolicitudBeneficio(
    Map<String, dynamic> item,
    BuildContext context,
  ) {
    final beneficios = item['beneficios'] as List;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
      showDragHandle: false,
      barrierColor: Colors.black54,
      builder: (context) {
        return Container(
          clipBehavior: Clip.antiAlias,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.8,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  margin: const EdgeInsets.only(top: 12, bottom: 16),
                  width: 40,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.black12,
                    borderRadius: BorderRadius.circular(2.5),
                  ),
                ),
              ),
              const Text(
                "Selecciona tu beneficio",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const ClampingScrollPhysics(),
                  itemCount: beneficios.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final b = beneficios[index];
                    final available = _isAvailableNow(
                      b['dias_uso'] ?? b['dias'] ?? "",
                      b['horario_uso'] ?? b['horario'] ?? "",
                    );
                    return InkWell(
                      onTap: available
                          ? () => _iniciarProcesoCanje(context, item, b)
                          : null,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: available ? Colors.white : Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: available
                                ? Colors.green.shade200
                                : Colors.grey.shade200,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.local_offer_rounded,
                              color: available ? Colors.green : Colors.grey,
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
                                      color: available
                                          ? Colors.black87
                                          : Colors.grey,
                                    ),
                                  ),
                                  Text(
                                    available
                                        ? "✓ Disponible ahora"
                                        : "× Fuera de horario",
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: available
                                          ? Colors.green
                                          : Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (available)
                              const Icon(
                                Icons.arrow_forward_ios,
                                size: 14,
                                color: Colors.green,
                              ),
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

  Future<void> _iniciarProcesoCanje(
    BuildContext context,
    Map<String, dynamic> comercio,
    Map<String, dynamic> beneficio,
  ) async {
    final existingResponse = await _supabase
        .from('solicitudes_canje')
        .select()
        .eq('beneficio_id', beneficio['id'])
        .eq('vecino_nombre', 'Miguel Tapia Troncoso')
        .eq('estado', 'Aprobado');

    if (existingResponse.isNotEmpty) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Este beneficio ya ha sido utilizado."),
            backgroundColor: Colors.orange,
          ),
        );
      }
      return;
    }

    final bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        title: const Text("Confirmar Solicitud"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("¿Deseas activar el beneficio de:"),
            Text(
              "${beneficio['titulo']}?",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),
            const Text(
              "Condiciones:",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            ),
            Text(
              beneficio['condiciones'] ?? "Sin condiciones adicionales",
              style: const TextStyle(fontSize: 12, color: Colors.black54),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("CANCELAR"),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade700,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              "CONFIRMAR",
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      StreamSubscription? subscription;
      String? solicitudId;

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (dialogContext) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 20),
              const Text(
                "Esperando aprobación del comercio...",
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                "Por favor, informe al cajero que ha solicitado el beneficio.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(bottom: 10, left: 10, right: 10),
              child: OutlinedButton(
                onPressed: () async {
                  await subscription?.cancel();
                  if (solicitudId != null) {
                    await _supabase
                        .from('solicitudes_canje')
                        .update({'estado': 'Cancelado'})
                        .eq('id', solicitudId);
                  }
                  if (context.mounted) Navigator.pop(dialogContext);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red,
                  side: const BorderSide(color: Colors.red),
                  minimumSize: const Size(double.infinity, 45),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  "CANCELAR OPERACIÓN",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      );

      final response = await _supabase
          .from('solicitudes_canje')
          .insert({
            'comercio_id': comercio['id'],
            'beneficio_id': beneficio['id'],
            'vecino_nombre': 'Miguel Tapia Troncoso',
            'estado': 'Pendiente',
            'fecha_solicitud': DateTime.now().toIso8601String(),
          })
          .select()
          .single();

      solicitudId = response['id'];

      final stream = _supabase
          .from('solicitudes_canje')
          .stream(primaryKey: ['id'])
          .eq('id', solicitudId!);

      subscription = stream.listen((data) {
        if (data.isNotEmpty) {
          final estado = data.first['estado'];
          if (estado != 'Pendiente' && estado != 'Cancelado') {
            Navigator.pop(context);
            _mostrarResultadoCanje(
              context,
              estado,
              data.first['motivo_rechazo'],
            );
            subscription?.cancel();
          }
        }
      });

      Future.delayed(const Duration(minutes: 2), () {
        if (subscription != null) {
          subscription!.cancel();
          if (Navigator.canPop(context)) Navigator.pop(context);
        }
      });
    } catch (e) {
      if (Navigator.canPop(context)) Navigator.pop(context);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error al conectar: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _mostrarResultadoCanje(
    BuildContext context,
    String estado,
    String? motivo,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              estado == 'Aprobado' ? Icons.check_circle : Icons.error,
              color: estado == 'Aprobado' ? Colors.green : Colors.red,
              size: 80,
            ),
            const SizedBox(height: 20),
            Text(
              estado == 'Aprobado'
                  ? "¡BENEFICIO ACTIVADO!"
                  : "SOLICITUD RECHAZADA",
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              estado == 'Aprobado'
                  ? "Ya puedes utilizar tu descuento en caja."
                  : "Motivo: ${motivo ?? 'No especificado'}",
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue.shade900,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text(
                "ENTENDIDO",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIcon(dynamic iconData, {double size = 24, Color? color}) {
    if (iconData is IconData) {
      if (iconData.fontFamily?.toLowerCase().contains('fontawesome') ?? false) {
        return FaIcon(iconData as dynamic, size: size, color: color);
      }
      return Icon(iconData, size: size, color: color);
    }
    return Icon(Icons.help_outline, size: size, color: color);
  }

  Widget _buildPremiumInfoRow(IconData icon, String text) {
    return Row(
      children: [
        _buildIcon(icon, color: Colors.blue.shade900, size: 22),
        const SizedBox(width: 15),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
        ),
      ],
    );
  }
}
