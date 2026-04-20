// Removed unused material.dart import
import 'package:flutter_test/flutter_test.dart';

import 'package:etelligenz_webview_app/main.dart';

void main() {
  testWidgets('WebView smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const EtelligenzApp());

    // Verify that the app builds and starts with the splash screen logic (or at least doesn't crash)
    expect(find.byType(EtelligenzApp), findsOneWidget);
  });
}
