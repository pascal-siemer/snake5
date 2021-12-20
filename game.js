
//Imports aus selbstgeschriebenen Modulen
import {Snake} from './modules/snake.js';
import {Food} from './modules/food.js';
import * as HighScores from './modules/scoreManagement.js';

const content = document.getElementById('content');     //"Kurzwahl" HTML-Element mit id content
const highscorecontent = document.getElementById('highScoreContent');   //"Kurzwahl" HTML-Element mit id highScoreContent
const controls = document.getElementById('controls');   //"Kurzwahl" HTML-Element mit id controls
const canvas = document.querySelector('canvas');        //"Kurzwahl" HTML-Element canvas
const context = canvas.getContext('2d');                //Wir arbeiten in 2D   

//Basis-Werte aus Ausgangswerte zur Kalkulation. Benoetigt ausgehend der Schwierigkeitsgrade
const canvasDimensionsBase = 32;
const widthBase = 20;
const heightBase = 20;
const tickRateBase = 500;
const tickModifyerBase = 10;

var difficulty;             //aktueller Schwierigkeitsgrad
const modifyerEasy = 0.75;  //Modifzer fuer Schwierigkeitsgrad easy
const modifyerNormal = 1;   //Modifzer fuer Schwierigkeitsgrad normal
const modifyerHard = 1.25;  //Modifzer fuer Schwierigkeitsgrad hard

var end = false;            //Spielabbruchsvariable
var input;                  //Eingabe, bsp: w,a,s und d
var direction;              //Speichern der aktuellen Bewegungsrichtung der Snake / des Players
var player;                 //variable fuer Objekt Snake
var food;                   //Variable fuer Objekt Food
var canvasDimensions = 32;  //Gridmodifier in pixeln
var width = 20;             //anzahl Koordinaten in x-richtung
var height = 20;            //anzahl Koordinaten in y-Richtung
var tickRate;               //Tickrate in ms
var tickModifyer;           //Veraenderung der Tickrate nach Events in Prozent
var edgeSpawning = true;    //Gibt an, ob Food-Objekte auch am Rand des Spielfeldes positioniert werden durfen. edgeSpawning = false wird genutzt im Schwierigkeitsgrad easy


//---Ausfuehrung---------------------------------------------------------------------------------------------------------------------------------------------------------------

init();     //Parameter werden auf Startwerte gesetzt, Objekte initialisiert.
loop();     //Game-Loop



//---EventHandler---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Eventhandler fuer Button zur Uebermittelung des Schwierigkeitsgrades aus Drop Down Menue
document.getElementById('startButton').addEventListener('click', function(event) {
    difficulty = document.getElementById('difficultyList').value;       //Wert fuer Difficulty setzen aus DropDown-Menue der Website
    if(difficulty != undefined && difficulty != null) {     //Falls Eingabe gueltig
        difficulty = difficulty.toLowerCase();              //im passenden Format speichern
    }
    init();     //Spiel neustarten durch zuruecksetzen von Parametern
})

//EventHandler fuer Button am Ende des ScoreBoards, damit permanent gespeicherte LocalStorage-Eintraege geloescht werden koennen.
document.getElementById('deleteHighScores').addEventListener('click', function(event) {
    HighScores.clearAllScores();    //loeschen
    displayHighScores();            //Anzeige aktualisieren
})

//aktuellste Eingabe wird gespeichert, damit sie spaeter in setInterval verwendet werden kann
document.addEventListener('keydown', function(event) {
    //Jeweils immer die erste Eingabe speichern. Input wird im Verlauf von loop() wieder auf undefined zurueckgesetzt werden, sodass wieder der neuste Input gelesen werden kann.
    if(input == undefined) {
        input = event.keyCode;

        //Eingabeverarbeitung basierend auf input. Ebenfalls: unterbindung, dass der Player rueckwaerts laeuft.
        if( (input == 87 || input == 38) && direction != "down"){
            direction = "up";
        } else if((input == 83 || input == 40) && direction != "up") {
            direction = "down";
        } else if((input == 65 || input == 37) && direction != "right") {
            direction = "left";
        } else if((input == 68 || input == 39) && direction != "left") {
           direction = "right";
        }
    }
    if(event.keyCode == 32 && end) {    //Falls das Spiel beendet wurde: Spiel kann ueber LEER-Taste zurueckgesetzt werden, indem init() aufgerufen wird.
        init();
    }
});



//---Methoden------------------------------------------------------------------------------------------------------------------------------------------------------------------

function init() {
    
    //Setzen der Parameter auf ihre Startwerte fuer die jeweilige Schwierigkeit
    if(difficulty == 'easy') {
        width = Math.round(widthBase / modifyerEasy);           //Anzahl Koordinaten anpassen
        height = Math.round(heightBase / modifyerEasy);
        canvasDimensions = canvasDimensionsBase * modifyerEasy; //Spielfeldskalierung anpassen
        canvas.height = width * canvasDimensions;               //Fenstergroesse des Canvas setzen
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;                     //breite des HTML-Objektes mit id "content" auf breite des Canvas setzen, damit Website "zentrierter" ist.
        tickRate = tickRateBase / modifyerEasy;                 //Anpassen der Spielgeschwindigkeit
        tickModifyer = tickModifyerBase * modifyerEasy;         //Anpassen der Spielbeschleunigung
        edgeSpawning = false;                                   //Verhindert, dass Food-Objekte an den Rand des Spielfeldes gesetzt werden. Mach das Spiel einfacher
        canvas.style.display = "block";                         //Macht das Canvas sichtbar
        highscorecontent.style.display = "block";               //Macht das Highscore-Board sichtbar
        controls.style.display = "block";                       //Macht den Paragraphen mit der Steuerung sichtbar
                               
    } else if(difficulty == 'normal') {             //Siehe "if(difficulty == 'easy')". EdgeSpawning hier aktiviert, macht Spiel schwieriger.
        width = Math.round(widthBase / modifyerNormal);
        height = Math.round(heightBase / modifyerNormal);
        canvasDimensions = canvasDimensionsBase;
        canvas.height = width * canvasDimensions;
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;
        tickRate = tickRateBase / modifyerNormal;
        tickModifyer = tickModifyerBase * modifyerNormal;
        edgeSpawning = true;
        canvas.style.display = "block";
        highscorecontent.style.display = "block";
        controls.style.display = "block";
    } else if(difficulty == 'hard') {               //Siehe "if(difficulty == 'easy')". EdgeSpawning hier aktiviert, macht Spiel schwieriger.
        width = Math.round(widthBase / modifyerHard);
        height = Math.round(heightBase / modifyerHard);
        canvasDimensions = canvasDimensionsBase;
        canvas.height = width * canvasDimensions;
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;
        tickRate = tickRateBase / modifyerHard;
        tickModifyer = tickModifyerBase * modifyerHard;
        edgeSpawning = true;
        canvas.style.display = "block";
        highscorecontent.style.display = "block";
        controls.style.display = "block";
    } else {
        //Wenn keine Schwierigkeit angegeben: mache das Spiel/Elemente unsichtbar
        canvas.style.display = "none";              
        highscorecontent.style.display = "none";
        controls.style.display = "none";
    }

    //Schwierigkeitsunabhaengige Parameter setzen
    end = false;
    input = undefined;
    direction = undefined;
    
    //zufaellige Positionen fuer Snake und Food
    let startX = random(width);
    let startY = random(height);
    player = new Snake(startX, startY);   //Instanz der Snake.
    if(!edgeSpawning) {     //Solange edgeSpawning durch den Easy-Mode deaktiviert ist
        do {
            startX = random(width - 2) + 1;      // -2, da zwei Koordinaten rausgerechnet werden muessen und +1, damit der Zahlenbereich entsprechend verschoben wird, damit die aeussersten Koordinaten nicht errechnet werden koennen.
            startY = random(height  - 2) + 1;
        } while(player.checkPosition(startX, startY));
    } else {
        do {
            startX = random(width);
            startY = random(height);
        } while(player.checkPosition(startX, startY));
    }
    food = new Food(startX, startY);  //Instanz des Foods

    drawGame();             //Neue Positionen anzeigen
    displayHighScores();    //HighScores anzeigen
}

//"Clock", welche pro Tick run() aufruft, solange die Snake sich nicht selbst gefressen hat (true/False in Variable end).
function loop() {
    setTimeout(function() {     //Uber das Rekursive aufrufen einer Funktion, welche setTimeout beinhaltet, kann die Spielgeschwindigkeit veraendert werden. setIntervall() bietet diese Moeglichkeit nicht
        if(!end && difficulty != undefined) {
            run();
            input = undefined;      //Zuruecksetzen von input, damit der EventHandler die naechste Eingabe speichern kann.   
        } 
        loop();                     //Rekursives Aufrufen der loop() setzt das Spiel fort. Eine Taktung ist durch setTimeout() gegeben.     
    }, tickRate);
}

//run() ist die Spieldurchfuehrung pro Tick, quasi "eine Runde".
function run() {

    //Mit x und y wird im folgenden kalkuliert. Diese muessen zunaechst auf die Werte x,y der ersten Player-Instanz Player ("Schlangenkopf") gesetzt werden, damit von da ausgehend Positionsveraenderungen berechnet werden koennen.
    var x = player.x;
    var y = player.y;
    
    //Positionsveraenderungen an x, y ausgehend von direction
    if(direction == "up") {
        y--;
    } else if(direction == "down") {
        y++;
    } else if(direction == "left") {
        x--;
    } else if(direction == "right") {
        x++;
    }

    //Falls ausserhalb des Spielfelds: Tod
    if(x < 0 || x >= width || y < 0 || y >= height) {
        gameOver();   //aktuelles Spiel wird durch gameOver-Methode beendet.
        return undefined; //run-Methode abbrechen;
    }

    //Spielregeln ausfuehren
    if(x == player.x && y == player.y) {
        // do nothing
    } else if(!player.checkPosition(x,y))  {   //wenn die neue Position nicht zu player gehoert
        if(food.checkPosition(x,y)) {   //Wenn player auf neuer Position frisst: player verlaengern und auf neue Position bewegen.
            player.addNext(player.x, player.y);
            player.recursiveMove(x, y);

            //Neue Position fuer Food berechnen
            let a, b;
            if(!edgeSpawning) {     //Solange edgeSpawning durch den Easy-Mode deaktiviert ist
                do {
                    a = random(width - 2) + 1;      // -2, da zwei Koordinaten rausgerechnet werden muessen und +1, damit der Zahlenbereich entsprechend verschoben wird, damit die aeussersten Koordinaten nicht errechnet werden koennen.
                    b = random(height  - 2) + 1;
                } while(player.checkPosition(a, b));
            } else {
                do {
                    a = random(width);
                    b = random(height);
                } while(player.checkPosition(a, b));
            }
            food.relocate(a, b);

            // Tickrate anpassen und das Spiel beschleunigen
            tickRate = Math.round(tickRate - (tickRate * (tickModifyer / 100)));

        } else {    //Wenn neue Position leer: player auf Position bewegen
            player.recursiveMove(x, y);
        }
    } else {    //Wenn neue Position = Instanz des Players: Player frisst sich selbst und das Spiel wird beendet.
        gameOver();   //aktuelles Spiel wird durch gameOver-Methode beendet.
        return undefined;   //run-Methode abbrechen;
    }
    drawGame();     //aktuelles Spielfeld darstellen.
    setText("Score: " + player.getLength() + ", Tickrate: " + tickRate + ", Schwierigkeitsgrad: " + difficulty);    //Score anzeigen
}

//Darstellung des Spielst auf HTML-Element Canvas
function drawGame() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < width; y++) {
        for(let x = 0; x < width; x++) {
            if(player.x == x && player.y == y) {    //Wenn erste Instanz von Player ("Schlangenkopf") an Position x,y
                context.fillStyle = 'lightgreen';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(player.checkPosition(x, y)) { //Wenn weitere Instanzen von Player an Position x,y an Position x,y
                context.fillStyle = 'green';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(food.checkPosition(x,y)) {    //Wenn Instanz von Food an Position x,y
                //Bild statt farbiges Rect anzeigen.
                context.drawImage(food.img, (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            }
        }
    }
}

//Funktion beendet das Spiel, speichert den Score und aktualisiert das UI
function gameOver() {
    end = true;
    setText("Ende! Druecke LEER fuer eine neue Runde. Score: " + player.getLength());
    HighScores.saveScore(player.getLength(), difficulty, ',');
    displayHighScores();
}

//HTML-Elemente aktualisieren: HighScores darstellen
function displayHighScores() {
    document.getElementById('highScoreHeadline').innerHTML = "Highscores (" + difficulty + "):";
    document.getElementById('highScore').innerHTML = HighScores.scoresToHTML(difficulty);
}

//Funktion zum ausgeben von Text unterhalb des Canvas
function setText(text) {
    document.getElementById('output').innerHTML = text;
}

//Braucht keinen Kommentar
function random(n) {
    return Math.floor(Math.random() * n);
}