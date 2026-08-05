import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ReportPage extends StatefulWidget {
  const ReportPage({super.key});

  @override
  State<ReportPage> createState() => _ReportPageState();
}

class _ReportPageState extends State<ReportPage> {
  File? _imagenSeleccionada;
  final ImagePicker _picker = ImagePicker();

  Future<void> _tomarFoto() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );

      if (photo != null) {
        setState(() {
          _imagenSeleccionada = File(photo.path);
        });
      }
    } catch (e) {
      debugPrint("Error al capturar foto: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("No se pudo abrir la cámara")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.report_problem, size: 80, color: Colors.orange),
            const SizedBox(height: 16),
            const Text(
              "Reportar Incidencia",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              "Captura una fotografía del problema para que la municipalidad pueda gestionarlo.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 32),

            // Área de previsualización de imagen
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: _imagenSeleccionada != null
                  ? ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(_imagenSeleccionada!, fit: BoxFit.cover),
              )
                  : const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.image, size: 50, color: Colors.grey),
                    Text("Sin imagen capturada", style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            ElevatedButton.icon(
              onPressed: _tomarFoto,
              icon: const Icon(Icons.camera_alt),
              label: const Text("ABRIR CÁMARA"),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),

            if (_imagenSeleccionada != null) ...[
              const SizedBox(height: 12),
              TextButton.icon(
                onPressed: () => setState(() => _imagenSeleccionada = null),
                icon: const Icon(Icons.delete, color: Colors.red),
                label: const Text("ELIMINAR Y REPETIR", style: TextStyle(color: Colors.red)),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  // No hay logica aun
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Reporte enviado con éxito")),
                  );
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text("ENVIAR REPORTE FINAL"),
              ),
            ],
          ],
        ),
      ),
    );
  }
}