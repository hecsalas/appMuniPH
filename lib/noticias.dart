import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'wordpress_service.dart';

class NewsPage extends StatefulWidget {
  const NewsPage({super.key});

  @override
  State<NewsPage> createState() => _NewsPageState();
}

class _NewsPageState extends State<NewsPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue.shade900, Colors.green.shade800],
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        extendBody: false,
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text('Noticias'),
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          foregroundColor: Colors.white,
        ),
        body: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.blue.shade900, Colors.green.shade800],
                ),
              ),
            ),
            SafeArea(child: _buildNewsPage()),
          ],
        ),
      ),
    );
  }

  Widget _buildNewsPage() {
    return RefreshIndicator(
      onRefresh: () async {
        setState(() {});
      },
      child: FutureBuilder<List<dynamic>>(
        future: WordPressService().fetchNews(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: Colors.white),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      color: Colors.white,
                      size: 48,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "No pudimos conectar con las noticias.\n${snapshot
                          .error}",
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white),
                    ),
                    TextButton(
                      onPressed: () => setState(() {}),
                      child: const Text(
                        "REINTENTAR",
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text(
                "No hay noticias disponibles",
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              final post = snapshot.data![index];
              return _buildNewsCard(post);
            },
          );
        },
      ),
    );
  }

  Widget _buildNewsCard(dynamic post) {
    String imageUrl = "";
    if (post['_embedded'] != null &&
        post['_embedded']['wp:featuredmedia'] != null &&
        post['_embedded']['wp:featuredmedia'].isNotEmpty) {
      imageUrl = post['_embedded']['wp:featuredmedia'][0]['source_url'] ?? "";
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.only(bottom: 20),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: InkWell(
        onTap: () => launchUrl(Uri.parse(post['link'])),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (imageUrl.isNotEmpty)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  imageUrl,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) =>
                      _buildPlaceholder(),
                ),
              )
            else
              _buildPlaceholder(),
            Padding(
              padding: const EdgeInsets.all(15),
              child: Text(
                post['title']['rendered']
                    .toString()
                    .replaceAll("&nbsp;", " ")
                    .replaceAll("&#8211;", "-")
                    .replaceAll("&#8217;", "'")
                    .replaceAll(RegExp(r'<[^>]*>'), ''),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      height: 180,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade300, Colors.blue.shade900],
        ),
      ),
      child: Center(
        child: Opacity(
          opacity: 0.5,
          child: Image.asset(
              'assets/logo_ph.png', width: 100),
        ),
      ),
    );
  }
}