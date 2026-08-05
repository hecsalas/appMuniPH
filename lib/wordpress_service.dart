import 'dart:convert';
import 'package:http/http.dart' as http;

class WordPressService {
  // URL actualizada a la ruta oficial compatible con la Municipalidad
  final String _baseUrl = "https://saludmph.cl/wp-json/wp/v2/posts?_embed";

  Future<List<dynamic>> fetchNews() async {
    try {
      final response = await http.get(Uri.parse(_baseUrl));
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Error al cargar noticias');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}