int yellow = 2;
int button = 13;
int buttonState = 0;


//사운드센서(Layer2)
int sound = 11;
int sound_LED=12;
int sound_value;


//초음파센서(Layer3)
int trig= 8; 
int echo= 9;
int Active_Ultra=10;
unsigned long check;
float checkDistance;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(yellow, OUTPUT);
  pinMode(button, INPUT);

  //사운드센서
  pinMode(sound,INPUT);

  //초음파센서
  pinMode(trig,OUTPUT);
  pinMode(echo,INPUT);
  //핀설치안함
  pinMode(Active_Ultra,OUTPUT);
 
}


void loop() {
  // read the state of the pushbutton value:
  buttonState = digitalRead(button);
  int checkLayer=0;
  
  //Layer2
  sound_value=analogRead(sound);
  if(sound_value>0){
    sound_value=1;
    Serial.print("Layer2 : ");
    Serial.print(sound_value);
    checkLayer=1;
  }

  if(checkLayer==0){
    Serial.print("Layer2 : ");
    Serial.print("0");
  }
      
  if(sound_value>0){
    digitalWrite(sound_LED,HIGH);
  }
  
  //Layer3
  digitalWrite(trig,LOW);
  digitalWrite(echo,LOW);
  delayMicroseconds(2);
  digitalWrite(trig,HIGH);
  delayMicroseconds(10);
  digitalWrite(trig,LOW);
  checkLayer=0;
  
  //check cm 단위로 -> 활용하든가
  check=pulseIn(echo,HIGH);
  checkDistance = check / 29.0 / 2.0;
  if(checkDistance > 0){
    checkDistance=1;
    Serial.print(" Layer 3 : ");
    Serial.println(int(checkDistance));
    checkLayer=1;
  }
  if(checkLayer==0){
    Serial.print(" Layer 3 : ");
    Serial.println("0");
  }
  delay(1000);
  if(checkDistance==0){
    digitalWrite(Active_Ultra,HIGH);
  }
}
