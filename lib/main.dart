import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:share_plus/share_plus.dart';

void main() {
  runApp(const APTMediaApp());
}

class APTMediaApp extends StatelessWidget {
  const APTMediaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APT Media',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: Colors.black,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}

// مۆدێلی زانیاری هەواڵەکان
class NewsItem {
  final String id;
  final String title;
  final String category; // گشتی، ناوخۆیی، وەرزشی، ئابووری
  final String mediaUrl; // لینک یان فایلی ڤیدیۆ/وێنە
  final String publisher;
  final String time;

  NewsItem({
    required this.id,
    required this.title,
    required this.category,
    required this.mediaUrl,
    required this.publisher,
    required this.time,
  });
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  // داتای نموونەیی هەواڵەکان (دواتر دەتوانی لە API بیهێنیت)
  static final List<NewsItem> allNews = [
    NewsItem(
      id: '1',
      title: 'بەرشەلۆنە سەرکەوتنێکی گەورەی لە خولی یانە پاڵەوانەکان بەدەستهێنا.',
      category: 'وەرزشی',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-news-anchor-reporting-live-42838-large.mp4',
      publisher: 'APT Sport',
      time: 'بەربل ٥ خولەک',
    ),
    NewsItem(
      id: '2',
      title: 'نرخی دۆلار لە بازاڕەکانی هەرێمی کوردستان گۆڕانکاری بەسەردا هات.',
      category: 'ئابووری',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-financial-data-41318-large.mp4',
      publisher: 'APT Economy',
      time: 'بەربل ١٥ خولەک',
    ),
    NewsItem(
      id: '3',
      title: 'حکومەتی هەرێمی کوردستان بڕیارێکی نوێی لەبارەی پڕۆژەکانی ڕێگەوبان دەرکرد.',
      category: 'ناوخۆیی',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41527-large.mp4',
      publisher: 'APT Local',
      time: 'بەربل ٣٠ خولەک',
    ),
    NewsItem(
      id: '4',
      title: 'لوپوتکەی جیهانی ئابووری لە نیویۆرک دەستی پێکرد.',
      category: 'گشتی',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-world-map-animation-with-connections-41316-large.mp4',
      publisher: 'APT World',
      time: 'بەربل ١ کاتژمێر',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          centerTitle: true,
          title: const Text(
            'APT Media',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.redAccent,
              letterSpacing: 1.2,
            ),
          ),
          bottom: const TabBar(
            isScrollable: true,
            indicatorColor: Colors.redAccent,
            indicatorWeight: 3,
            labelStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            unselectedLabelStyle: TextStyle(fontSize: 14),
            tabs: [
              Tab(text: 'گشتی'),
              Tab(text: 'ناوخۆیی'),
              Tab(text: 'وەرزشی'),
              Tab(text: 'ئابووری'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            NewsFeed(newsList: allNews),
            NewsFeed(newsList: allNews.where((n) => n.category == 'ناوخۆیی').toList()),
            NewsFeed(newsList: allNews.where((n) => n.category == 'وەرزشی').toList()),
            NewsFeed(newsList: allNews.where((n) => n.category == 'ئابووری').toList()),
          ],
        ),
      ),
    );
  }
}

// بەشی فیدی هەواڵەکان (سکرۆڵی تیک تۆکی)
class NewsFeed extends StatelessWidget {
  final List<NewsItem> newsList;

  const NewsFeed({super.key, required this.newsList});

  @override
  Widget build(BuildContext context) {
    if (newsList.isEmpty) {
      return const Center(
        child: Text(
          'هیچ هەواڵێک لەم بەشەدا نییە',
          style: TextStyle(color: Colors.white70, fontSize: 16),
        ),
      );
    }

    return PageView.builder(
      scrollDirection: Axis.vertical,
      itemCount: newsList.length,
      itemBuilder: (context, index) {
        return NewsCard(news: newsList[index]);
      },
    );
  }
}

// کارت و پلەیەر بۆ هەربەشێکی هەواڵ
class NewsCard extends StatefulWidget {
  final NewsItem news;

  const NewsCard({super.key, required this.news});

  @override
  State<NewsCard> createState() => _NewsCardState();
}

class _NewsCardState extends State<NewsCard> {
  late VideoPlayerController _controller;
  bool _isLiked = false;
  int _likeCount = 124;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(Uri.parse(widget.news.mediaUrl))
      ..initialize().then((_) {
        setState(() {});
        _controller.setLooping(true);
        _controller.play();
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ١. ڤیدیۆ یان باکگراوەند
        Positioned.fill(
          child: _controller.value.isInitialized
              ? GestureDetector(
                  onTap: () {
                    setState(() {
                      _controller.value.isPlaying
                          ? _controller.pause()
                          : _controller.play();
                    });
                  },
                  child: AspectRatio(
                    aspectRatio: _controller.value.aspectRatio,
                    child: VideoPlayer(_controller),
                  ),
                )
              : const Center(
                  child: CircularProgressIndicator(color: Colors.redAccent),
                ),
        ),

        // ٢. خستنەسەری ڕەنگی تۆخ (Overlay) بۆ باشتر خوێندنەوەی دەقەکان
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.black.withOpacity(0.8),
                  Colors.transparent,
                  Colors.black.withOpacity(0.9),
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: const [0.0, 0.5, 1.0],
              ),
            ),
          ),
        ),

        // ٣. زانیاریەکانی هەواڵ لە خوارەوە (Title & Details)
        Positioned(
          bottom: 40,
          left: 16,
          right: 80,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.redAccent,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      widget.news.category,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    widget.news.time,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                widget.news.publisher,
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Text(
                widget.news.title,
                style: const TextStyle(color: Colors.white, fontSize: 18, height: 1.3),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),

        // ٤. دوگمەکانی دەستڕاگەیشتنی خێرا (لایک، کۆمێنت، شێر) لەلای ڕاست
        Positioned(
          bottom: 40,
          right: 16,
          child: Column(
            children: [
              _buildActionButton(
                icon: _isLiked ? Icons.favorite : Icons.favorite_border,
                color: _isLiked ? Colors.red : Colors.white,
                label: '$_likeCount',
                onTap: () {
                  setState(() {
                    _isLiked = !_isLiked;
                    _isLiked ? _likeCount++ : _likeCount--;
                  });
                },
              ),
              const SizedBox(height: 20),
              _buildActionButton(
                icon: Icons.comment_rounded,
                color: Colors.white,
                label: '٤٥',
                onTap: () {
                  _showCommentsBottomSheet(context);
                },
              ),
              const SizedBox(height: 20),
              _buildActionButton(
                icon: Icons.share_rounded,
                color: Colors.white,
                label: 'شێر',
                onTap: () {
                  Share.share('${widget.news.title}\nلە APT Media بیخوێنەرەوە!');
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: color, size: 35),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }

  // دیالۆگی کۆمێنتەکان (Comments)
  void _showCommentsBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.grey[900],
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          height: 400,
          child: Column(
            children: [
              const Text(
                'کۆمێنتەکان',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const Divider(color: Colors.white24),
              const Expanded(
                child: Center(
                  child: Text(
                    'هیچ کۆمێنتێک نییە، یەکەم کەسبە کۆمێنت دەکات!',
                    style: TextStyle(color: Colors.white54),
                  ),
                ),
              ),
              TextField(
                decoration: InputDecoration(
                  hintText: 'کۆمێنتێک بنووسە...',
                  hintStyle: const TextStyle(color: Colors.white38),
                  filled: true,
                  fillColor: Colors.black26,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.send, color: Colors.redAccent),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
