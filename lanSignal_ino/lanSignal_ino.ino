#include <Stepper.h>

//pin 2 und 3 müssen vertauscht werden
int pin1 = 8;
int pin3 = 9;
int pin2 = 10;
int pin4 = 11;
 
int pinButton = 5;

Stepper stepper(2048, pin1, pin2, pin3, pin4);

boolean pressed = false;
void setup() {
  // put your setup code here, to run once:
  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
  pinMode(pin3, OUTPUT);
  pinMode(pin4, OUTPUT);
  
  //button
  pinMode(pinButton, INPUT);

  while (!Serial);
  Serial.begin(9600);
  stepper.setSpeed(10);
}

void loop()
{
  if(digitalRead(pinButton) == LOW && pressed == false) {
    Serial.println(digitalRead(pinButton));
    pressed = true;
  } 
  else if (digitalRead(pinButton) != LOW && digitalRead(pinButton) != HIGH) {
    pressed = false;
  }
  if (Serial.available())
  {
    int steps = Serial.parseInt();
    stepper.step(steps);
    Serial.println(steps);
  }
}
