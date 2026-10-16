import 'package:flutter/material.dart';

import 'screens/auth_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/shell_screen.dart';
import 'session/session_controller.dart';
import 'theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AlanYerlerApp());
}

class AlanYerlerApp extends StatefulWidget {
  const AlanYerlerApp({super.key});

  @override
  State<AlanYerlerApp> createState() => _AlanYerlerAppState();
}

class _AlanYerlerAppState extends State<AlanYerlerApp> {
  final _session = SessionController();

  @override
  void initState() {
    super.initState();
    _session.restore();
  }

  @override
  void dispose() {
    _session.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SessionScope(
      controller: _session,
      child: MaterialApp(
        title: 'Alan Yerler',
        debugShowCheckedModeBanner: false,
        theme: appTheme(),
        home: ListenableBuilder(
          listenable: _session,
          builder: (context, _) {
            if (!_session.ready) {
              return const Scaffold(
                body: Center(
                  child: Text(
                    'Alan Yerler',
                    style: TextStyle(
                      color: AppColors.blue,
                      fontWeight: FontWeight.w800,
                      fontSize: 18,
                    ),
                  ),
                ),
              );
            }
            if (_session.user != null) {
              return const ShellScreen();
            }
            if (!_session.seenOnboarding) {
              return const OnboardingScreen();
            }
            return const AuthScreen();
          },
        ),
      ),
    );
  }
}
