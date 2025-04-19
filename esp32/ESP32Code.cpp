#define RELAY_PIN 26  // GPIO pin for relay (green LED)
#define BUZZER_PIN 27 // GPIO pin for buzzer

// Variables to track relay state and unauthorized access attempts
bool isRelayOn = false;   // Tracks if the relay (green LED) is ON
int notMatchedCount = 0;  // Counts consecutive "NOT_MATCHED" attempts

void setup() {
  // Initialize serial communication
  Serial.begin(115200);

  // Configure relay and buzzer pins
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Initially turn off relay and buzzer
  digitalWrite(RELAY_PIN, HIGH);  // Green LED OFF
  digitalWrite(BUZZER_PIN, LOW);  // Buzzer OFF

  Serial.println("Setup complete. Waiting for commands...");
}

void loop() {
  // Check if a message is received via serial
  if (Serial.available() > 0) {
    String message = Serial.readStringUntil('\n');  // Read message

    if (message == "MATCHED") {
      Serial.println("MATCHED command received.");
      digitalWrite(RELAY_PIN, LOW);  // Turn ON relay (green LED)
      digitalWrite(BUZZER_PIN, LOW); // Ensure buzzer is OFF
      isRelayOn = true;              // Update relay state
      notMatchedCount = 0;           // Reset unmatched attempt counter
    } else if (message == "NOT_MATCHED") {
      Serial.println("NOT_MATCHED command received.");
      digitalWrite(RELAY_PIN, HIGH); // Turn OFF relay (green LED)
      digitalWrite(BUZZER_PIN, HIGH); // Activate buzzer
      delay(2000);                    // Wait for 2 seconds
      digitalWrite(BUZZER_PIN, LOW);  // Turn off buzzer
      isRelayOn = false;              // Update relay state
      notMatchedCount++;              // Increment unmatched attempt counter

      if (notMatchedCount >= 3) {
        Serial.println("Unauthorized access detected! Beeping 5 times...");
        for (int i = 0; i < 5; i++) {
          digitalWrite(BUZZER_PIN, HIGH);
          delay(500); // Buzzer ON for 500ms
          digitalWrite(BUZZER_PIN, LOW);
          delay(500); // Buzzer OFF for 500ms
        }
        notMatchedCount = 0; // Reset counter after alert
      }
    }
    else if (message == "STOP") {
      Serial.println("STOP command received.");
      digitalWrite(RELAY_PIN, HIGH);
      isRelayOn = false;
    }
  }

  // Keep relay ON if matched until explicitly turned off by NOT_MATCHED
  if (isRelayOn) {
    digitalWrite(RELAY_PIN, LOW);  // Keep relay ON
  } else {
    digitalWrite(RELAY_PIN, HIGH); // Ensure relay is OFF
  }

  delay(100);  // Add a small delay to avoid spamming the serial monitor
}
