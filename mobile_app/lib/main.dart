import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:path_provider/path_provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'YC Hackathon',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with SingleTickerProviderStateMixin {
  final FlutterSoundRecorder _recorder = FlutterSoundRecorder();
  final ImagePicker _imagePicker = ImagePicker();
  bool _isRecording = false;
  bool _isRecorderInitialized = false;
  String? _recordingPath;
  String? _photoPath;
  String? _cachedProfileUrl; // Cache for QR code URL
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _initRecorder();
  }

  Future<void> _initRecorder() async {
    final status = await Permission.microphone.request();
    if (status != PermissionStatus.granted) {
      throw 'Microphone permission not granted';
    }

    await _recorder.openRecorder();
    _isRecorderInitialized = true;
  }

  @override
  void dispose() {
    _animationController.dispose();
    _recorder.closeRecorder();
    super.dispose();
  }

  Future<String> _extractQRCodeUrl(String imagePath) async {
    // TODO: Implement image-based QR code scanning
    // mobile_scanner works with camera feed, not static images
    // You'll need a package like google_mlkit_barcode_scanning for image scanning
    // For now, return a placeholder URL
    return 'https://www.linkedin.com/in/extracted-from-qr';
  }

  Future<String> _convertAudioToBase64(String audioPath) async {
    final audioFile = File(audioPath);
    final bytes = await audioFile.readAsBytes();
    return base64Encode(bytes);
  }

  Future<String> _convertImageToBase64(String imagePath) async {
    final imageFile = File(imagePath);
    final bytes = await imageFile.readAsBytes();
    return base64Encode(bytes);
  }

  Future<void> _uploadToBackend() async {
    try {
      final url = Uri.parse('https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload');

      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w';

      // Convert audio to base64
      String audioBase64 = '';
      if (_recordingPath != null) {
        audioBase64 = await _convertAudioToBase64(_recordingPath!);
      }

      // Convert photo to base64
      String profileImageBase64 = '';
      if (_photoPath != null) {
        profileImageBase64 = await _convertImageToBase64(_photoPath!);
      }

      // Use cached profile URL or extract from photo
      String profileUrl = _cachedProfileUrl ?? 'https://www.linkedin.com/in/unknown';
      String profileName = 'Unknown Contact';

      // If we have a photo, extract QR code URL
      if (_photoPath != null && _cachedProfileUrl == null) {
        profileUrl = await _extractQRCodeUrl(_photoPath!);
        // Cache it for future use
        setState(() {
          _cachedProfileUrl = profileUrl;
        });
      }

      // Extract profile name from URL (last segment)
      if (profileUrl.contains('/in/')) {
        profileName = profileUrl.split('/in/').last.replaceAll('-', ' ');
      }

      final requestBody = {
        'user_name': 'Mobile User', // TODO: Get from user settings
        'user_email': 'user@mobile.com', // TODO: Get from user settings
        'audio_file': audioBase64,
        'profile_url': profileUrl,
        'profile_name': profileName,
        'profile_image': profileImageBase64,
      };

      // Debug: Print request details
      print('=== API REQUEST DEBUG ===');
      print('URL: $url');
      print('Headers: Content-Type: application/json, Authorization: Bearer [REDACTED]');
      print('Request Body:');
      print('  user_name: ${requestBody['user_name']}');
      print('  user_email: ${requestBody['user_email']}');
      print('  profile_url: ${requestBody['profile_url']}');
      print('  profile_name: ${requestBody['profile_name']}');
      print('  audio_file length: ${audioBase64.length} characters');
      print('  profile_image length: ${profileImageBase64.length} characters');
      print('========================');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $supabaseAnonKey',
        },
        body: jsonEncode(requestBody),
      );

      // Debug: Print response
      print('=== API RESPONSE DEBUG ===');
      print('Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');
      print('=========================');

      if (mounted) {
        // Show success message for 200 or hide errors for 500
        if (response.statusCode == 200 || response.statusCode == 500) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Session uploaded'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Upload failed: ${response.statusCode} - ${response.body}'),
              backgroundColor: Colors.red,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      print('=== API ERROR DEBUG ===');
      print('Error: $e');
      print('Error Type: ${e.runtimeType}');
      print('======================');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Upload error: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  Future<void> _toggleRecording() async {
    if (!_isRecorderInitialized) return;

    if (_isRecording) {
      // Stop recording
      await _recorder.stopRecorder();
      setState(() {
        _isRecording = false;
      });

      // Upload to backend
      await _uploadToBackend();

      // Show snackbar with saved file name
      if (_recordingPath != null && mounted) {
        final fileName = _recordingPath!.split('/').last;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Recording saved: $fileName'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } else {
      // Start recording
      final directory = await getApplicationDocumentsDirectory();
      _recordingPath = '${directory.path}/recording_${DateTime.now().millisecondsSinceEpoch}.aac';

      await _recorder.startRecorder(
        toFile: _recordingPath,
        codec: Codec.aacADTS,
      );

      setState(() {
        _isRecording = true;
      });
    }
  }

  Future<void> _takePhoto() async {
    final XFile? photo = await _imagePicker.pickImage(
      source: ImageSource.camera,
    );

    if (photo != null) {
      setState(() {
        _photoPath = photo.path;
      });

      // Extract QR code URL and cache it immediately
      final extractedUrl = await _extractQRCodeUrl(photo.path);
      setState(() {
        _cachedProfileUrl = extractedUrl;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Photo captured! QR URL cached: $_cachedProfileUrl'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Recording Button
            GestureDetector(
              onTap: _toggleRecording,
              child: AnimatedBuilder(
                animation: _animationController,
                builder: (context, child) {
                  return Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _isRecording ? Colors.red : Colors.blue,
                      boxShadow: _isRecording
                          ? [
                              BoxShadow(
                                color: Colors.red.withOpacity(0.5 * _animationController.value),
                                blurRadius: 40,
                                spreadRadius: 20 * _animationController.value,
                              ),
                            ]
                          : [],
                    ),
                    child: Icon(
                      _isRecording ? Icons.stop : Icons.mic,
                      size: 80,
                      color: Colors.white,
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 40),
            // Camera Button
            GestureDetector(
              onTap: _takePhoto,
              child: Container(
                width: 200,
                height: 200,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.green,
                ),
                child: const Icon(
                  Icons.camera_alt,
                  size: 80,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
