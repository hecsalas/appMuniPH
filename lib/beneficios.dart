import 'package:app369/comercio.dart';
import 'package:app369/historialBeneficios.dart';
import 'package:flutter/material.dart';

class BeneficiosPage extends StatefulWidget {
  const BeneficiosPage({super.key});

  @override
  State<BeneficiosPage> createState() => _BeneficiosPageState();
}

class _BeneficiosPageState extends State<BeneficiosPage> {
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
            IconButton(onPressed: (){
              Navigator.push(context, MaterialPageRoute(builder: (context) => HistorialPage()),
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
        body: const TabBarView(
          children: [
            Center(
              child: Text('Municipales', style: TextStyle(color: Colors.white)),
            ),
            Center(
              child: Text(
                'Comercios Afiliados',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
