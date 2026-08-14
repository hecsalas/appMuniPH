import 'dart:async';
import 'package:app369/home.dart';
import 'package:app369/inicio.dart';
import 'package:app369/comercio.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:app_links/app_links.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://lskbpiqalqckntbyyfdn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxza2JwaXFhbHFja250Ynl5ZmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzODczNzIsImV4cCI6MjEwMTk2MzM3Mn0.1jaSh4KtLwHnW9RCVrbRdsRnGXCO6akBX3JM_QsadOo',
  );

  runApp(const MyApp());
}

final supabase = Supabase.instance.client;

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _navigatorKey = GlobalKey<NavigatorState>();
  late AppLinks _appLinks;
  StreamSubscription<Uri>? _linkSubscription;

  @override
  void initState() {
    super.initState();
    _initDeepLinks();
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  void _initDeepLinks() {
    _appLinks = AppLinks();

    // Maneja enlaces cuando la app ya está abierta
    _linkSubscription = _appLinks.uriLinkStream.listen((uri) {
      _handleDeepLink(uri);
    });

    // Maneja el enlace inicial (cuando la app se abre desde cero)
    _appLinks.getInitialLink().then((uri) {
      if (uri != null) _handleDeepLink(uri);
    });
  }

  void _handleDeepLink(Uri uri) {
    debugPrint('Deep Link recibido: $uri');

    // miph-app://beneficios?target=Escuela del Valle&sucursal=Padre Hurtado
    if (uri.scheme == 'miph-app' && uri.host == 'beneficios') {
      final target = uri.queryParameters['target'];
      final sucursal = uri.queryParameters['sucursal'];
      _navigatorKey.currentState?.pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => HomePage(
            initialIndex: 1,
            initialBenefitTitle: target,
            initialSucursal: sucursal,
          ),
        ),
        (route) => false,
      );
    }

    // Compatibilidad con la ruta anterior de comercio
    if (uri.scheme == 'miph-app' && uri.host == 'comercio') {
      _navigatorKey.currentState?.push(
        MaterialPageRoute(builder: (context) => const ComercioPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'MiPH',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: const InicioPage(),
    );
  }
}
