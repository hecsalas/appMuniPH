import 'package:app369/beneficios.dart';
import 'package:app369/noticias.dart';
import 'package:app369/notificaciones.dart';
import 'package:app369/perfil.dart';
import 'package:app369/scanner_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_snake_navigationbar/flutter_snake_navigationbar.dart';
import 'package:qr_flutter/qr_flutter.dart';

class HomePage extends StatefulWidget {
  final int initialIndex;
  final String? initialBenefitTitle;
  final String? initialSucursal;

  const HomePage({
    super.key,
    this.initialIndex = 0,
    this.initialBenefitTitle,
    this.initialSucursal,
  });

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  List<Widget> get _paginas => [
    const InicioContent(),
    BeneficiosPage(
      initialBenefitTitle: widget.initialBenefitTitle,
      initialSucursal: widget.initialSucursal,
    ),
    const ScannerPage(),
    const NewsPage(),
    const PerfilPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,

      appBar: _currentIndex == 0
          ? AppBar(
              automaticallyImplyLeading: false,
              backgroundColor: Colors.transparent,
              elevation: 0,
              surfaceTintColor: Colors.transparent,
              foregroundColor: Colors.white,
              toolbarHeight: 100,
              title: Padding(
                padding: const EdgeInsets.only(top: 20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hola, Miguel',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Bienvenido a Mi Padre Hurtado',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withAlpha(200),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 15.0),
                  child: IconButton(
                    icon: const Icon(
                      Icons.notifications_none_rounded,
                      size: 32,
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => NotificationsPage(),
                        ),
                      );
                    },
                  ),
                ),
              ],
            )
          : null,

      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.green.shade800, Colors.blue.shade800],
          ),
        ),
        child: SafeArea(top: false, child: _paginas[_currentIndex]),
      ),

      bottomNavigationBar: SnakeNavigationBar.color(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
        },

        behaviour: SnakeBarBehaviour.floating,
        snakeShape: SnakeShape.circle,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        padding: const EdgeInsets.all(12),

        backgroundColor: Colors.white,
        snakeViewColor: Colors.lightGreen,
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.black,

        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Inicio',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.card_giftcard_rounded),
            label: 'Beneficios',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner_rounded),
            label: 'Scanner',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.newspaper_rounded),
            label: 'Noticias',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}

class InicioContent extends StatelessWidget {
  const InicioContent({super.key});

  @override
  Widget build(BuildContext context) {
    final double topPadding = MediaQuery.of(context).padding.top + 20.0;
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.fromLTRB(20.0, topPadding, 20.0, 80.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDigitalCard(),
          const SizedBox(height: 12),
          const Divider(color: Colors.white24, height: 16),
          Text(
            'Beneficios',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade400,
            ),
          ),
          const SizedBox(height: 8),
          _buildBeneficiosPreview(),
        ],
      ),
    );
  }
}

Widget _buildDigitalCard() {
  return Card(
    elevation: 8,
    shadowColor: Colors.blue.withOpacity(0.2),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
    child: Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.white, Colors.blue.shade50],
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    "TARJETA VECINO DIGITAL",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1565C0),
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                Text(
                  'ID: PH-2026-45821',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: Colors.grey.shade400,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Miguel Tapia Troncoso',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Colors.black87,
                  ),
                ),
                const Text(
                  '12.345.678-9',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'VIGENTE HASTA 31/12/2026',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: Colors.grey.shade400,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.check_circle_rounded,
                        color: Colors.green.shade600,
                        size: 16,
                      ),
                      const SizedBox(width: 5),
                      Text(
                        'VECINO ACTIVO',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.green.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 15),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: QrImageView(
              data: "PH-2026-45821",
              version: QrVersions.auto,
              size: 90.0,
              gapless: false,
            ),
          ),
        ],
      ),
    ),
  );
}

Widget _buildBeneficiosPreview() {
  final items = [
    {
      'titulo': 'Viña Odfjell',
      'subtitulo': 'Venta Directa',
      'valor': '10%',
      'categoria': 'Bebidas',
      'color': Colors.purple,
      'img': 'assets/odfjell.png',
    },
    {
      'titulo': 'Zxtreme',
      'subtitulo': 'Mantención Pro',
      'valor': '15%',
      'categoria': 'Deporte',
      'color': Colors.teal,
      'img': 'assets/zxtreme.png',
    },
    {
      'titulo': 'Fratello',
      'subtitulo': 'Heladería',
      'valor': '3x2',
      'categoria': 'Alimentos',
      'color': Colors.pinkAccent,
      'img': 'assets/fratello.png',
    },
    {
      'titulo': 'Escuela del Valle',
      'subtitulo': 'Conductores',
      'valor': '30%',
      'categoria': 'Educación',
      'color': Colors.red,
      'img': 'assets/escuela-del-valle.png',
    },
    {
      'titulo': 'Clínica del Sol',
      'subtitulo': 'Dental',
      'valor': '17%',
      'categoria': 'Salud',
      'color': Colors.blue,
      'img': 'assets/clinica-del-sol.png',
    },
    {
      'titulo': 'Casa Guau',
      'subtitulo': 'Veterinaria',
      'valor': '5%',
      'categoria': 'Mascotas',
      'color': Colors.brown,
      'img': 'assets/casa-guau.png',
    },
  ];

  return SizedBox(
    height: 335,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      itemCount: items.length,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      separatorBuilder: (context, index) => const SizedBox(width: 16),
      itemBuilder: (context, index) {
        final item = items[index];
        return _buildVerticalCard(
          item['titulo'] as String,
          item['subtitulo'] as String,
          item['img'] as String,
          item['valor'] as String,
          item['color'] as Color,
          item['categoria'] as String,
        );
      },
    ),
  );
}

Widget _buildVerticalCard(
  String title,
  String subtitle,
  String imgPath,
  String val,
  Color color,
  String category,
) {
  return Container(
    width: 210,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(35),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.08),
          blurRadius: 15,
          offset: const Offset(0, 8),
        ),
      ],
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(35),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Área de Imagen (Proporcional y Completa)
          Stack(
            children: [
              Container(
                height: 160,
                width: double.infinity,
                color: Colors.grey.shade50,
                padding: const EdgeInsets.all(15),
                child: imgPath.startsWith('http')
                    ? Image.network(imgPath, fit: BoxFit.contain)
                    : Image.asset(imgPath, fit: BoxFit.contain),
              ),
              // Badge de Descuento
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Text(
                    val.contains('%') ? val : "$val OFF",
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // 2. Información del Comercio (Sobre fondo blanco)
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  category.toUpperCase(),
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    color: color,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 18,
                    color: Color(0xFF1A237E),
                    height: 1.1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
