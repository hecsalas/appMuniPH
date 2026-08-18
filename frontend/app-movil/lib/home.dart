import 'package:app369/beneficios.dart';
import 'package:app369/noticias.dart';
import 'package:app369/perfil.dart';
import 'package:app369/sos.dart';
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
    const SosPage(),
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
        child: SafeArea(
            top: false,
            child: _paginas[_currentIndex]),
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
            icon: Icon(Icons.emergency_rounded),
            label: 'SOS',
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
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(20.0, 120.0, 20.0, 100.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDigitalCard(),
          const SizedBox(height: 25),
          _buildQuickActions(),
          const Divider(color: Colors.white24, height: 30),
          Text(
            'Beneficios',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade400,
            ),
          ),
          const SizedBox(height: 6),
          _buildBeneficiosPreview(),
        ],
      ),
    );
  }
}

Widget _buildQuickActions() {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
    children: [
      _buildCircularButton(Icons.receipt_long_rounded, "Trámites"),
      _buildCircularButton(Icons.map_rounded, "Lugares"),
      _buildCircularButton(Icons.campaign_rounded, "Avisos"),
      _buildCircularButton(Icons.help_outline_rounded, "Ayuda"),
    ],
  );
}

Widget _buildCircularButton(IconData icon, String label) {
  return Column(
    children: [
      Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: IconButton(
          onPressed: () {},
          icon: Icon(icon, color: Colors.blue.shade900, size: 28),
        ),
      ),
      const SizedBox(height: 8),
      Text(
        label,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    ],
  );
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
                Text(
                  "TARJETA VECINO DIGITAL",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: Colors.blue.shade800,
                    letterSpacing: 0.5,
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
      'titulo': 'Escuela del Valle',
      'descuento': 'Licencias de\n conducir',
      'valor': '30%\nDescuento',
      'color': Colors.red,
      'img':
          'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      'titulo': 'Clínica del Sol',
      'descuento': 'Tratamientos\ndentales',
      'valor': '17%\nDescuento',
      'color': Colors.blue,
      'img':
          'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=500&q=80',
    },
    {
      'titulo': 'Casa Guau',
      'descuento': 'Sacos de \nAlimento',
      'valor': '5%\nDescuento',
      'color': Colors.brown,
      'img':
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
    },
  ];

  return SizedBox(
    height: 230,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      itemCount: items.length,
      padding: const EdgeInsets.symmetric(horizontal: 4),
      separatorBuilder: (context, index) => const SizedBox(width: 16),
      itemBuilder: (context, index) {
        final item = items[index];
        return _buildVerticalCard(
          item['titulo'] as String,
          item['descuento'] as String,
          item['valor'] as String,
          item['img'] as String,
          item['color'] as Color,
        );
      },
    ),
  );
}

Widget _buildVerticalCard(
  String title,
  String desc,
  String val,
  String imgUrl,
  Color color,
) {
  return Container(
    width: 180,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(25),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          blurRadius: 10,
          offset: const Offset(0, 5),
        ),
      ],
    ),
    child: Column(
      children: [
        // 1. Imagen Superior
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
          child: Image.network(
            imgUrl,
            height: 110,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
        ),
        // 2. Cuerpo (Título al centro)
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 5),
          child: Text(
            title,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: Colors.black87,
            ),
          ),
        ),

        const Spacer(),

        // 3. Footer (Dato a izquierda y derecha)
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 18),
          decoration: BoxDecoration(
            color: color.withOpacity(0.08),
            borderRadius: const BorderRadius.vertical(
              bottom: Radius.circular(25),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                desc.toUpperCase(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                val,
textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
