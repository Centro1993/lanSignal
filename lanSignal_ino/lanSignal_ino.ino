#include <Stepper.h>

//pin 2 und 3 müssen vertauscht werden
int pin1 = 8;
int pin3 = 9;
int pin2 = 10;
int pin4 = 11;
 
int pinButton = 5;
int lastState = 0;

int steps = 0;
 
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
  /*int buttonState = digitalRead(pinButton);
  if(buttonState == 1 && lastState != buttonState) {
    Serial.println();
  } else {
    Serial.println(buttonState);
   lastState = buttonState; 
  }*/
  
  if (Serial.available())
  {
    while(Serial.available() > 0) {
      steps += Serial.read();
    }
    stepper.step((int)steps);
    steps = 0;
  }
}
