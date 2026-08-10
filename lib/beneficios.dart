import 'package:app369/comercio.dart';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class BeneficiosPage extends StatefulWidget {
  const BeneficiosPage({super.key});

  @override
  State<BeneficiosPage> createState() => _BeneficiosPageState();
}

class _BeneficiosPageState extends State<BeneficiosPage> {
  final List<Map<String, dynamic>> _beneficiosComercios = [
    {
      'titulo': 'Casa Guau',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.brown,
      'descuento': '10% Alimentos Húmedos y Accesorios \n5% Sacos de Alimento',
      'dias': 'Lunes',
      'horario': 'Horario de Atención',
      'condiciones': 'Mayor 18 años',
      'direccion': 'Papa Juan XXIII N°1240, Padre Hurtado',
      'latlng': const LatLng(-33.57334196235139, -70.82780493383449),
    },
    {
      'titulo': 'Clínica del Sol',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.tooth,
      'color': Colors.blue.shade200,
      'descuento': '15% Prestaciones Odontológicas\n17% Tratamientos Dentales',
      'dias': 'Todos los días',
      'horario': 'Horario de Atención',
      'condiciones': 'Tarjeta Vecino',
      'direccion': 'San Ignacio N°1624 local 16 y 17, Padre Hurtado',
      'latlng': const LatLng(-33.5611360599154, -70.82747058214169),
    },
    {
      'titulo': 'Escuela del Valle',
      'categoria': 'Educación',
      'icono': Icons.directions_car_rounded,
      'color': Colors.red,
      'descuento': '30% en Clase B, C, D y Profesionales (A2 a A5)',
      'dias': 'Lunes a Viernes',
      'horario': '10:00 a 14:00 - 16:00 a 20:00',
      'condiciones': 'Mayor 18, Presencial, No acumulable, Tarjeta Vecino',
      'direccion': 'Rodolfo Jaramillo N°2523, Padre Hurtado',
      'latlng': const LatLng(-33.564232834951014, -70.82255738057556),
    },
    {
      'titulo': "Licorería Charl's",
      'categoria': 'Bebidas Alcohólicas',
      'icono': Icons.local_bar_rounded,
      'color': Colors.grey,
      'descuento': '10% Martes (Vinos/Cervezas) y Miércoles (Destilados)',
      'dias': 'Martes y Miércoles',
      'horario': 'Horario de Atención',
      'condiciones': 'Pago efectivo, Mayor 18 años',
      'direccion': 'San Genaro N°2605, local 1, Padre Hurtado',
      'latlng': const LatLng(-33.56409908847409, -70.82447630409058),
    },
    {
      'titulo': 'Optica Optik V&C',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.glasses,
      'color': Colors.deepPurpleAccent,
      'descuento':
          '15% en Productos ópticos\nPromoción lente monofocal desde \$25.000',
      'dias': 'Horario de Atención',
      'horario': 'Horario de Atención',
      'condiciones': 'Atención en local, No acumulable',
      'direccion': 'El Manzano Sur N°1261, Padre Hurtado',
      'latlng': const LatLng(-33.57384623693479, -70.80304424272943),
    },
    {
      'titulo': 'Otto Fritz',
      'categoria': 'Entretenimiento y Comida',
      'icono': Icons.local_activity_rounded,
      'color': Colors.cyan,
      'descuento':
          '15% en Restaurant (Lun-Dom)\n\$8.000 Entrada Parque Acuático (Lun-Vie)',
      'dias': 'Lunes a Domingo',
      'horario': 'Horario de Atención',
      'condiciones': 'No acumulable, Entrada solo por venta online',
      'direccion': 'Av. Caupolican N°3461, Peñaflor',
      'latlng': const LatLng(-33.597966560136605, -70.88734338817774),
    },
    {
      'titulo': 'Restobar Ibridos',
      'categoria': 'Comida y Bebida',
      'icono': Icons.nightlife_rounded,
      'color': Colors.deepOrange,
      'descuento': '10% Total consumido',
      'dias': 'Martes a Sábado',
      'horario':
          'Mar-Vie 13:00 a 17:00\nMar-Sab 13:00 - 21:00 (Func. Municipal)',
      'condiciones': 'Mayor de 18 años, No acumulable',
      'direccion': 'San Ignacio N°1180, Padre Hurtado',
      'latlng': const LatLng(-33.56495104660019, -70.82419764090052),
    },
    {
      'titulo': 'Veterinaria Rompecorreas',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.green,
      'descuento': '20% Consultas, Vacunas, Esterilización y Procedimientos',
      'dias': 'Lunes a Sábado',
      'horario': '09:00 a 19:00',
      'condiciones': 'Sin límite de uso, No válido para urgencias, Presencial',
      'direccion': 'Rodolfo Jaramillo N°894, Padre Hurtado',
      'latlng': const LatLng(-33.56717678649047, -70.82316685745141),
    },
  ];

  final List<Map<String, dynamic>> _beneficiosMunicipales = [
    {
      'titulo': 'Bono por Logro Escolar Municipal',
      'descripcion':
          'Incentivo económico para estudiantes con rendimiento destacado.\nApoyo para la compra de útiles y materiales educativos.',
      'categoria': 'Educación',
      'icono': Icons.school_rounded,
      'color': Colors.blue,
      'descuento': 'Monto fijo anual según tramo',
      'dias': 'Lunes a Viernes (Postulación)',
      'horario': '09:00 a 14:00',
      'condiciones': 'Certificado de notas, Residencia en PH',
      'direccion': 'DIDECO - San Alberto Hurtado 3295',
    },
  ];

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
            'Beneficios',
            style: TextStyle(color: Colors.white),
          ),
          centerTitle: true,
          actions: [
            IconButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => ComercioPage()),
                );
              },
              icon: const Icon(Icons.storefront_outlined),
              color: Colors.white,
            ),
            IconButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => HistorialPage()),
                );
              },
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
        body: TabBarView(
          children: [
            _buildListaBeneficios(_beneficiosMunicipales),
            _buildListaBeneficios(_beneficiosComercios),
          ],
        ),
      ),
    );
  }
}

Widget _buildListaBeneficios(List<Map<String, dynamic>> lista) {
  return ListView.separated(
    padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
    separatorBuilder: (context, index) => SizedBox(height: 12),
    itemCount: lista.length,
    itemBuilder: (context, index) {
      final item = lista[index];
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
          title: Text(
            item['titulo'],
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text(item['categoria']),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => _mostrarDetallesBeneficio(item, context),
        ),
      );
    },
  );
}

void _mostrarDetallesBeneficio(
  Map<String, dynamic> item,
  BuildContext context,
) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
    ),
    builder: (context) {
      return Container(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "ESCANEA EL QR PARA USAR EL DESCUENTO",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(15),
              ),
              child: QrImageView(
                data: "VALIDAR:${item['titulo']}",
                version: QrVersions.auto,
                size: 150.0,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              item['titulo'],
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              item['categoria'].toUpperCase(),
              style: TextStyle(
                color: item['color'],
                fontWeight: FontWeight.w900,
              ),
            ),

            const Divider(height: 40),

            _buildInfoRow(
              Icons.local_offer_rounded,
              "Descuento",
              item['descuento'] ?? "",
            ),
            _buildInfoRow(
              Icons.calendar_month_rounded,
              "Días",
              item['dias'] ?? "",
            ),
            _buildInfoRow(
              Icons.access_time_rounded,
              "Horario",
              item['horario'] ?? "",
            ),
            _buildInfoRow(
              Icons.info_outline_rounded,
              "Condiciones",
              item['condiciones'] ?? "",
            ),
            _buildInfoRow(
              Icons.location_on_rounded,
              "Dirección",
              item['direccion'] ?? "",
            ),

            const SizedBox(height: 30),
            if (item['direccion'] != null &&
                item['direccion'].toString().isNotEmpty && item['latlng'] != null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            ComercioPage(initialLocation: item['latlng']),
                      ),
                    );
                  },
                  icon: const Icon(Icons.map_rounded, color: Colors.white),
                  label: const Text(
                    "VER UBICACIÓN EN MAPA",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade900,
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
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

Widget _buildInfoRow(IconData icon, String label, String value) {
  if (value.isEmpty)
    return const SizedBox.shrink(); // No dibuja nada si está vacío

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
              Text(
                label,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              Text(value, style: const TextStyle(fontSize: 14)),
            ],
          ),
        ),
      ],
    ),
  );
}

Future<void> _abrirMapa(String direccion) async {
  final url = Uri.parse(
    "https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(direccion)}",
  );
  if (await canLaunchUrl(url)) {
    await launchUrl(url);
  } else {
    throw 'No se pudo abrir el mapa';
  }
}
