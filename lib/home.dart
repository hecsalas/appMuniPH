import 'package:app369/beneficios.dart';
import 'package:app369/noticias.dart';
import 'package:app369/perfil.dart';
import 'package:app369/sos.dart';
import 'package:app369/tramites.dart';
import 'package:app369/weather_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_snake_navigationbar/flutter_snake_navigationbar.dart';
import 'inicio.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  final List<Widget> _paginas = [
    const InicioContent(),
    const BeneficiosPage(),
    const SosPage(),
    const NewsPage(),
    const PerfilPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: false,
      appBar:_currentIndex == 0 ?
      AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.blue.shade900,
        elevation: 0,
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Hola, Benjamín',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Text(
              '¡Que bueno tenerte aquí!',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withAlpha(204),
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => InicioPage()),
              );
            },
            icon: const Icon(Icons.logout_rounded),
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
            colors: [Colors.blue.shade900, Colors.green.shade800],
          ),
        ),
        child: _paginas[_currentIndex],
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
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FutureBuilder<Map<String, dynamic>>(
            future: WeatherService().fetchWeather(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return const Text("Clima no disponible");
              } else {
                final temp = snapshot.data!['main']['temp'].toStringAsFixed(0);
                final feelsLike = snapshot.data!['main']['feels_like']
                    .toStringAsFixed(0);
                final humidity = snapshot.data!['main']['humidity'];
                final wind = snapshot.data!['wind']['speed'];
                final desc = snapshot.data!['weather'][0]['description'];
                final iconCode = snapshot.data!['weather'][0]['icon'];

                return Card(
                  elevation: 10,
                  shadowColor: Colors.blue.withOpacity(0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(25),
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Colors.blue.shade400, Colors.blue.shade900],
                      ),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Padre Hurtado",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                  ),
                                ),
                                Text(
                                  "$temp°C",
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 45,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "${desc[0].toUpperCase()}${desc.substring(1)}",
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            Image.network(
                              "https://openweathermap.org/img/wn/$iconCode@4x.png",
                              width: 80,
                              height: 80,
                            ),
                          ],
                        ),
                        const Divider(color: Colors.white24, height: 30),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildWeatherDetail(
                              Icons.thermostat,
                              "$feelsLike°C",
                              "Sensación",
                            ),
                            _buildWeatherDetail(
                              Icons.water_drop,
                              "$humidity%",
                              "Humedad",
                            ),
                            _buildWeatherDetail(
                              Icons.air,
                              "${wind}km/h",
                              "Viento",
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              }
            },
          ),
          const SizedBox(height: 20),
          _buildTramites(context),
        ],
      ),

    );
  }
}

Widget _buildWeatherDetail(IconData icon, String value, String label) {
  return Column(
    children: [
      Icon(icon, color: Colors.white70, size: 20),
      const SizedBox(height: 5),
      Text(
        value,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      Text(label, style: const TextStyle(color: Colors.white60, fontSize: 10)),
    ],
  );
}

Widget _buildTramites(BuildContext context) {
  return Card(
    elevation: 4,
    margin: const EdgeInsets.symmetric(vertical: 8),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadiusGeometry.circular(20),
    ),
    child: InkWell(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) => TramitesPage()),
        );
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Colors.blue.shade50],
          ),
        ),
        child: Row(
          children: [
            const SizedBox(width: 20),
            Expanded(
              child: Text('Trámites',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          ],
        ),
      ),
    ),
  );
}
