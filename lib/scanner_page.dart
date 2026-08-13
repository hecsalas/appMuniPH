import 'package:app369/home.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class ScannerPage extends StatefulWidget {
  const ScannerPage({super.key});

  @override
  State<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  MobileScannerController controller = MobileScannerController();
  bool isScanCompleted = false;

  void _processScannedCode(String code) {
    setState(() => isScanCompleted = true);
    final uri = Uri.tryParse(code);

    if (uri != null && uri.scheme == 'miph-app' && uri.host == 'beneficios') {
      final target = uri.queryParameters['target'];
      final sucursal = uri.queryParameters['sucursal'];

      // Navegación directa al modal de beneficios
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => HomePage(
            initialIndex: 1,
            initialBenefitTitle: target,
            initialSucursal: sucursal,
          ),
        ),
        (route) => false,
      );
    } else {
      // Acción para QRs no municipales
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Código QR no reconocido por Mi Padre Hurtado"),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text(
          "ESCANEAR COMERCIO",
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new_rounded,
            color: Colors.white,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          // Botón para prender el Flash
          IconButton(
            color: Colors.white,
            icon: ValueListenableBuilder(
              valueListenable: controller,
              builder: (context, state, child) {
                switch (state.torchState) {
                  case TorchState.off:
                    return const Icon(
                      Icons.flash_off_rounded,
                      color: Colors.grey,
                    );
                  case TorchState.on:
                    return const Icon(
                      Icons.flash_on_rounded,
                      color: Colors.amber,
                    );
                  case TorchState.unavailable:
                    return const Icon(
                      Icons.flash_off_rounded,
                      color: Colors.red,
                    );
                  case TorchState.auto:
                    return const Icon(
                      Icons.flash_auto_rounded,
                      color: Colors.blue,
                    );
                  default:
                    return const Icon(
                      Icons.flash_off_rounded,
                      color: Colors.grey,
                    );
                }
              },
            ),
            onPressed: () => controller.toggleTorch(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. VISOR DE LA CÁMARA
          MobileScanner(
            controller: controller,
            onDetect: (capture) {
              if (!isScanCompleted) {
                final List<Barcode> barcodes = capture.barcodes;
                for (final barcode in barcodes) {
                  final String code = barcode.rawValue ?? "---";
                  _processScannedCode(code);
                }
              }
            },
          ),

          // 2. MARCO VISUAL (OVERLAY)
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.lightGreen, width: 4),
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),

          const Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: Text(
              "Apunta al código QR del comercio",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
