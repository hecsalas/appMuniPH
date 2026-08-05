import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart' as geo;

class ComercioPage extends StatefulWidget {
  const ComercioPage({super.key});

  @override
  State<ComercioPage> createState() => _ComercioPageState();
}

class _ComercioPageState extends State<ComercioPage> {
  GoogleMapController? _mapController;

  // Coordenadas iniciales
  static const LatLng _center = LatLng(-33.577828251662254, -70.82479220461471);

  // Lista de comercios de ejemplo con coordenadas reales
  final List<Map<String, dynamic>> _comercios = [
    {
      'nombre': 'Dulce Reino Cafetería & Pasteleria',
      'direccion': 'Av. Papa Juan Pablo II 1644',
      'tipo': 'Alimentos',
      'icono': Icons.bakery_dining,
      'distancia': '200m',
      'latlng': const LatLng(-33.57592914393441, -70.82714594011577),
    },
    {
      'nombre': 'Farmacia "Ibiza"',
      'direccion': 'Av. San Ignacio 1005',
      'tipo': 'Salud',
      'icono': Icons.local_pharmacy,
      'distancia': '450m',
      'latlng': const LatLng(-33.56594927233234, -70.8227955239937),
    },
    {
      'nombre': 'Supermercado Tottus',
      'direccion': 'Cmo. a Melipilla 2436',
      'tipo': 'Abastos',
      'icono': Icons.shopping_cart,
      'distancia': '1.2km',
      'latlng': const LatLng(-33.57161255578461, -70.817826515072),
    },
    {
      'nombre': 'Ferretería "El Martillo"',
      'direccion': 'Pasaje Los Olivos 78',
      'tipo': 'Hogar',
      'icono': Icons.hardware,
      'distancia': '800m',
      'latlng': const LatLng(-33.4590, -70.6460),
    },
  ];

  Color _getCategoryColor(String type) {
    switch (type) {
      case 'Alimentos':
        return Colors.orange.shade700;
      case 'Salud':
        return Colors.green.shade600;
      case 'Abastos':
        return Colors.blue.shade600;
      case 'Hogar':
        return Colors.purple.shade600;
      default:
        return Colors.grey;
    }
  }

  double _getMarkerHue(String type) {
    switch (type) {
      case 'Alimentos':
        return BitmapDescriptor.hueOrange;
      case 'Salud':
        return BitmapDescriptor.hueGreen;
      case 'Abastos':
        return BitmapDescriptor.hueAzure;
      case 'Hogar':
        return BitmapDescriptor.hueViolet;
      default:
        return BitmapDescriptor.hueRed;
    }
  }

  Set<Marker> _getMarkers() {
    return _comercios.map((comercio) {
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
      );
    }).toSet();
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
                    child: Icon(comercio['icono'], color: colorCategoria),
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
                icon: const Icon(Icons.directions),
                label: const Text("VER EN EL MAPA"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorCategoria,
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

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  Future<void> _actualizarUbicacion() async {
    bool serviceEnabled;
    geo.LocationPermission permission;

    serviceEnabled = await geo.Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Los servicios de ubicación están desactivados.'),
          ),
        );
      }
      return;
    }

    permission = await geo.Geolocator.checkPermission();
    if (permission == geo.LocationPermission.denied) {
      permission = await geo.Geolocator.requestPermission();
      if (permission == geo.LocationPermission.denied) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Permiso de ubicación denegado.')),
          );
        }
        return;
      }
    }

    // Obtener ubicación real y mover cámara
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
    return Scaffold(
      body: Column(
        children: [
          Stack(
            children: [
              // MAPA
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.78,
                child: GoogleMap(
                  onMapCreated: _onMapCreated,
                  initialCameraPosition: const CameraPosition(
                    target: _center,
                    zoom: 14.0,
                  ),
                  markers: _getMarkers(),
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                ),
              ),

              Positioned(
                top: 45,
                left: 15,
                child: CircleAvatar(
                  backgroundColor: Colors.white.withOpacity(0.7),
                  child: IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.black87,
                    ),
                  ),
                ),
              ),

              Positioned(
                left: 16,
                bottom: 28,
                child: FloatingActionButton(
                  onPressed: _actualizarUbicacion,
                  backgroundColor: Colors.orange,
                  mini: true,
                  child: const Icon(Icons.my_location, color: Colors.white),
                ),
              ),
            ],
          ),
          // Banner
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.orange.shade50,
            child: const Row(
              children: [
                Icon(Icons.storefront, color: Colors.orange),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    "Negocios locales registrados en tu sector",
                    style: TextStyle(
                      color: Colors.orange,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          //LISTA DE COMERCIOS
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _comercios.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final comercio = _comercios[index];
                final colorCategoria = _getCategoryColor(comercio['tipo']);

                return Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: colorCategoria.withOpacity(0.1),
                      child: Icon(comercio['icono'], color: colorCategoria),
                    ),
                    title: Text(
                      comercio['nombre'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      "${comercio['tipo']} • ${comercio['direccion']}",
                    ),
                    trailing: Icon(Icons.chevron_right, color: colorCategoria),
                    onTap: () {
                      _mostrarDetallesComercio(comercio);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
