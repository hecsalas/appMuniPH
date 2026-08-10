import 'package:app369/home.dart';
import 'package:app369/inicio.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://lskbpiqalqckntbyyfdn.supabase.co/rest/v1/',
    anonKey: 'sb_publishable_lIJi_8HB0_BK2vYWTyFIwg_GwBrd5P1',
  );

  runApp(const MyApp());
}

final supabase = Supabase.instance.client;

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mi Padre Hurtado',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: Supabase.instance.client.auth.onAuthStateChange,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        final session = snapshot.data?.session;

        if (session != null) {
          return const HomePage();
        } else {
          return const InicioPage();
        }
      },
    );
  }
}
