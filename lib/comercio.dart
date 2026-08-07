import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class ComercioPage extends StatefulWidget {
  final LatLng? initialLocation;

  const ComercioPage({super.key, this.initialLocation});

  @override
  State<ComercioPage> createState() => _ComercioPageState();
}

class _ComercioPageState extends State<ComercioPage> {
  GoogleMapController? _mapController;
  String _categoriaSeleccionada = 'Todos';

  // Coordenadas iniciales
  static const LatLng _center = LatLng(-33.577828251662254, -70.82479220461471);

  // Lista de comercios
  final List<Map<String, dynamic>> _comercios = [
    {
      'nombre': 'Casa Guau',
      'direccion': 'Papa Juan XXIII N°1240',
      'tipo': 'Mascotas',
      'icono': Icons.pets_rounded,
      'latlng': const LatLng(-33.57334196235139, -70.82780493383449),
    },
    {
      'nombre': 'Clínica del Sol',
      'direccion': 'San Ignacio N°1624 local 16 y 17',
      'tipo': 'Salud',
      'icono': FontAwesomeIcons.tooth,
      'latlng': const LatLng(-33.5611360599154, -70.82747058214169),
    },
    {
      'nombre': 'Escuela del Valle',
      'direccion': 'Rodolfo Jaramillo N°2523',
      'tipo': 'Educación',
      'icono': Icons.directions_car_rounded,
      'latlng': const LatLng(-33.564232834951014, -70.82255738057556),
    },
    {
      'nombre': "Licorería Charl's",
      'direccion': 'San Genaro N°2605, local 1',
      'tipo': 'Bebidas Alcohólicas',
      'icono': Icons.local_bar_rounded,
      'latlng': const LatLng(-33.56409908847409, -70.82447630409058),
    },
    {
      'nombre': 'Optica Optik V&C',
      'direccion': 'El Manzano Sur N°1261',
      'tipo': 'Salud',
      'icono': FontAwesomeIcons.glasses,
      'latlng': const LatLng(-33.57384623693479, -70.80304424272943),
    },
    {
      'nombre': 'Otto Fritz',
      'direccion': 'Av. Caupolican N° 3461, Peñaflor',
      'tipo': 'Entretenimiento y Comida',
      'icono': Icons.local_activity_rounded,
      'latlng': const LatLng(-33.597966560136605, -70.88734338817774),
    },
    {
      'nombre': 'Restobar Ibridos',
      'direccion': 'San Ignacio N°1180',
      'tipo': 'Comida y Bebida',
      'icono': Icons.nightlife_rounded,
      'latlng': const LatLng(-33.56495104660019, -70.82419764090052),
    },
    {
      'nombre': 'Veterinaria Rompecorreas',
      'direccion': 'Rodolfo Jaramillo N°894',
      'tipo': 'Mascotas',
      'icono': Icons.pets_rounded,
      'latlng': const LatLng(-33.56717678649047, -70.82316685745141),
    },
  ];

  Color _getCategoryColor(String type) {
    switch (type) {
      case 'Mascotas':
        return Colors.brown;
      case 'Salud':
        return Colors.blue.shade300;
      case 'Educación':
        return Colors.red;
      case 'Bebidas Alcohólicas':
        return Colors.blueGrey;
      case 'Entretenimiento y Comida':
        return Colors.cyan;
      case 'Comida y Bebida':
        return Colors.deepOrange;
      default:
        return Colors.orange;
    }
  }

  double _getMarkerHue(String type) {
    switch (type) {
      case 'Mascotas':
        return BitmapDescriptor.hueRose;
      case 'Salud':
        return BitmapDescriptor.hueAzure;
      case 'Educación':
        return BitmapDescriptor.hueRed;
      case 'Entretenimiento y Comida':
        return BitmapDescriptor.hueCyan;
      case 'Comida y Bebida':
        return BitmapDescriptor.hueOrange;
      default:
        return BitmapDescriptor.hueOrange;
    }
  }

  Set<Marker> _getMarkers() {
    return _comercios
        .where(
          (c) =>
              _categoriaSeleccionada == 'Todos' ||
              c['tipo'] == _categoriaSeleccionada,
        )
        .map((comercio) {
          return Marker(
            markerId: MarkerId(comercio['nombre']),
            position: comercio['latlng'],
            infoWindow: InfoWindow(
              title: comercio['nombre'],
              snippet: comercio['direccion'],
            ),
            icon: BitmapDescriptor.defaultMarkerWithHue(
              _getMarkerHue(comercio['tipo']),
            ),
            onTap: () => _mostrarDetallesComercio(comercio),
          );
        })
        .toSet();
  }

  void _mostrarDetallesComercio(Map<String, dynamic> comercio) {
    final colorCategoria = _getCategoryColor(comercio['tipo']);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: colorCategoria.withOpacity(0.1),
                    child: (comercio['icono'] is IconData)
                        ? Icon(comercio['icono'], color: colorCategoria)
                        : FaIcon(
                            comercio['icono'],
                            color: colorCategoria,
                            size: 20,
                          ),
                  ),
                  const SizedBox(width: 15),
                  Text(
                    comercio['tipo'].toUpperCase(),
                    style: TextStyle(
                      color: colorCategoria,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                comercio['nombre'],
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    size: 18,
                    color: Colors.grey,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    comercio['direccion'],
                    style: const TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                ],
              ),
              const SizedBox(height: 30),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  _mapController?.animateCamera(
                    CameraUpdate.newLatLngZoom(comercio['latlng'], 17.0),
                  );
                },
                icon: const Icon(Icons.map_outlined),
                label: const Text("VER EN EL MAPA"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey.shade200,
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () => _abrirNavegacion(comercio['latlng']),
                icon: const Icon(Icons.directions),
                label: const Text("CÓMO LLEGAR"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue.shade900,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Future<void> _abrirNavegacion(LatLng destino) async {
    final lat = destino.latitude;
    final lng = destino.longitude;

    // URL para Google Maps (Funciona en Android e iOS si está instalada)
    final googleMapsUrl = Uri.parse(
      "https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving",
    );
    // URL para Apple Maps (Respaldo oficial para iPhone)
    final appleMapsUrl = Uri.parse("https://maps.apple.com/?daddr=$lat,$lng");

    if (await canLaunchUrl(googleMapsUrl)) {
      await launchUrl(googleMapsUrl, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(appleMapsUrl)) {
      await launchUrl(appleMapsUrl, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("No se pudo abrir una aplicación de mapas."),
          ),
        );
      }
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  Future<void> _actualizarUbicacion() async {
    bool serviceEnabled = await geo.Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    geo.LocationPermission permission = await geo.Geolocator.checkPermission();
    if (permission == geo.LocationPermission.denied) {
      permission = await geo.Geolocator.requestPermission();
      if (permission == geo.LocationPermission.denied) return;
    }

    geo.Position position = await geo.Geolocator.getCurrentPosition();
    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(
        LatLng(position.latitude, position.longitude),
        15.0,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final categorias = [
      'Todos',
      'Salud',
      'Mascotas',
      'Comida y Bebida',
      'Educación',
      'Bebidas Alcohólicas',
    ];

    return Scaffold(
      body: Stack(
        children: [
          // MAPA
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(
              target: widget.initialLocation ?? _center,
              zoom: widget.initialLocation != null ? 17.0 : 12.0,
            ),
            markers: _getMarkers(),
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            zoomControlsEnabled: false,
          ),

          // BOTÓN VOLVER
          Positioned(
            top: 45,
            left: 15,
            child: CircleAvatar(
              backgroundColor: Colors.white.withOpacity(0.9),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.black87),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          // BOTÓN MI UBICACIÓN
          Positioned(
            right: 16,
            bottom: 120,
            child: FloatingActionButton(
              onPressed: _actualizarUbicacion,
              backgroundColor: Colors.white,
              foregroundColor: Colors.blue.shade900,
              mini: true,
              child: const Icon(Icons.my_location),
            ),
          ),

          // BANNER INFERIOR
          Positioned(
            bottom: 50,
            left: 15,
            right: 15,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: Row(
                children: categorias.map((cat) {
                  final isSelected = _categoriaSeleccionada == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      onSelected: (bool selected) {
                        setState(() => _categoriaSeleccionada = cat);
                      },
                      selectedColor: Colors.orange,
                      backgroundColor: Colors.white.withOpacity(0.9),
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : Colors.black87,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                        fontSize: 13,
                      ),
                      elevation: 2,
                      pressElevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
