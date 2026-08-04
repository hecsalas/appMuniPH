import 'dart:convert';
import 'package:http/http.dart' as http;

class WeatherService {
  // Coordenadas de Padre Hurtado
  final String lat = "-33.5683";
  final String lon = "-70.8353";
  final String apiKey = "bfba5f72d6f06e12fac7dde994f7814c";

  Future<Map<String, dynamic>> fetchWeather() async {
    final url = 'https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=metric&lang=es';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Error al cargar el clima');
      }
    } catch (e) {
      throw Exception('Sin conexión al clima');
    }
  }
}