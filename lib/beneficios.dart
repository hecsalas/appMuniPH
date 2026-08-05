import 'package:app369/comercio.dart';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class BeneficiosPage extends StatefulWidget {
  const BeneficiosPage({super.key});

  @override
  State<BeneficiosPage> createState() => _BeneficiosPageState();
}

class _BeneficiosPageState extends State<BeneficiosPage> {
  final List<Map<String, dynamic>> _beneficiosMunicipales = [
    {
      'titulo': 'Alimentos y Productos Mascota',
      'descripcion':
          'Alimentos Humedos y accesorios para mascotas.\nSacos de alimentos para Mascotas.',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.brown,
    },
    {
      'titulo': 'Salud Dental',
      'descripcion':
          'Prestaciones Odontologicas. \nTratamiento dentales.',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.tooth,
      'color': Colors.blue.shade200,
    },
    {
      'titulo': 'Escuela de Conducción',
      'descripcion': 'Cursos de Manejo en Descuento',
      'categoria': 'Educación',
      'icono': Icons.directions_car_rounded,
      'color': Colors.red,
    },
    {
      'titulo': 'Licorería',
      'descripcion': 'Destilados en Descuento',
      'categoria': 'Bebidas Alcohólicas',
      'icono': Icons.local_bar_rounded,
      'color': Colors.grey,
    },
    {
      'titulo': 'Óptica',
      'descripcion': 'Productos Ópticos en Descuento',
      'categoria': 'Salud',
      'icono': FontAwesomeIcons.glasses,
      'color': Colors.deepPurpleAccent,
    },
    {
      'titulo': 'Parque acuático y Resturant',
      'descripcion': 'Restaurant y Entrada del Parque acuático en Descuento',
      'categoria': 'Entretenimiento y Comida',
      'icono': Icons.local_activity_rounded,
      'color': Colors.cyan,
    },
    {
      'titulo': 'Restobar',
      'descripcion': 'Restaurant y Coctelería en Descuento',
      'categoria': 'Comida y Bebida',
      'icono': Icons.nightlife_rounded,
      'color': Colors.deepOrange,
    },
    {
      'titulo': 'Veterinaria',
      'descripcion': 'Atención veterinaria completa en Descuento',
      'categoria': 'Mascotas',
      'icono': Icons.pets_rounded,
      'color': Colors.lightGreenAccent,
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
          backgroundColor: Colors.blue.shade900,
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
            _buildListaBeneficios([]),
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
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
    ),
    builder: (context) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                (item['icono'] is IconData)
                    ? Icon(item['icono'], color: item['color'], size: 30)
                    : FaIcon(item['icono'], color: item['color'], size: 30),

                const SizedBox(width: 10),
                Text(
                  item['categoria'].toUpperCase(),
                  style: TextStyle(
                    color: item['color'],
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            Text(
              item['titulo'],
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              item['descripcion'],
              style: const TextStyle(fontSize: 16, color: Colors.black87),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue.shade900,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  "VER REQUISITOS",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      );
    },
  );
}
