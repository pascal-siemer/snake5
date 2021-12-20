export var maxHighScores = 10;  //Anzahl, wie viele Scores gespeichert werden sollen

//String aus getScores() bauen, damit das Array als String auf der Website dargestellt werden kann.
export function scoresToHTML(entryName) {
    return valuesToString(getScores(entryName), '<br>');

}


export function saveScore(value, entryName) {
    //saveScore speichert einen Score-Wert value in einem LocalStorage-Eintrag mit Namen entryName
    //obwohl LocalStorage nur Strings speichert, arbeiten wir hier mit Arrays, damit wir unsere Scores sortieren koennen.

    //Eingangsparameter value verarbeiten: Wenn es noch keine gueltigen bestehenden Scores gibt, neuen Score als einzelnen Array-Eintrag speichern, sonst: value an Array mit bestehenden Scores anhaengen.
    var scoresArray = getScores(entryName);
    if(scoresArray == undefined || scoresArray == [] || scoresArray.includes(NaN)) {
        scoresArray = [value];
    } else {
        scoresArray.push(value);
    }
    scoresArray = sortValues(scoresArray);      //Sortiert Scores in absteigender Reihenfolge
    scoresArray = limitEntries(scoresArray, maxHighScores);   //Limitiert Scores auf maxHighScores-Anzahl Eintraege. Dies muss nach dem Sortieren geschehen, da wir die hoechsten Werte verarbeiten wollen.

    //Setzen des LocalStorage-Eintrages
    window.localStorage.setItem(entryName, valuesToString(scoresArray, ','));
}

//HighScores aus dem LocalStorage auslesen und als Array aus Zahlen bereitstellen
export function getScores(entryName) {
    var scoresString = window.localStorage.getItem(entryName);  //Liest String aus LocalStorage mit Identifyer entryName aus und speichert diesen in scoresString
    if(scoresString == undefined || scoresString == null) {     //Ungueltige Werte verarbeiten: "Leere" Werte werden zu leerem String ''
        scoresString = '';
    }
    return stringToValues(scoresString, ',');   //Rueckgabewert: Array aus String scoresString.
}

//Loeschen des LocalStorage, da Eintraege permanent gespeichert sind
export function clearAllScores() {
    window.localStorage.clear();
}


//Zusatzmethoden -------------------------------------------------------------------
//Werden nur innerhalb dieses Modules gebraucht/verwendet.


//Baut String nach Art 'name=value, value, value' in Array [value, value, value] um
function stringToValues(string, separator) {
    if(string == undefined || string == null || string == '') { //Ungueltige Werte: leeres Array wird ausgegeben
        return [];
    }
    string = string.split(separator);   //Eingabe an seperator in Array mit Inhalt String spalten
    
    //Werte aus Array mit Strings in neues Array mit Zahlen speichern
    var array = [];
    for(var i = 0; i < string.length; i++) {
        var n = parseInt(string[i]);    //Strings werden zu Zahlen
        if(!isNaN(n)) {                 //Werte filtern, die nicht erfolgreich in Zahlen umgewandelt werden konnten
            array.push(n);              //Array aus Zahlen bauen, je ein Element pro Durchlauf von for
        }
    }
    return array;
}

//Baut einen String aus Werten des array, dabei werden die Elemente aus array im entstehenden String durch separator getrent
function valuesToString(array, separator) {
    if(array == undefined || array == null || array == [] || array.length < 1) {    //"Leere Werte" geben leeren String aus
        return '';
    }

    //Mit for-Schleife werden die Werte aus dem Array als String gespeichert
    var string = '';
    for(var i = 0; i < array.length; i++) {
        if(i == 0) {
            string = array[i];
        } else {
            string += separator + '' + array[i];        //Werte durch separator im String voneinander getrennt
        }
    }
    return string;      //Ausgabe string
}


//Bestimmung der hoechsten Zahl in array, wird benoetigt fuer sortValues(). Ueber for-Schleife wird der hoechste Eintrag des array bestimmt.
function hightestValue(array) {
    var highestValue;
    for(var i = 0; i < array.length; i++) {
        if(i == 0) {
            highestValue = array[i];
        } else if(array[i] > highestValue) {
            highestValue = array[i];
        }

    }
    return highestValue;
}

//Sortiert Zahlen im Array values in absteigender Reihenfolge
function sortValues(array) {
    var sortedArray = [];
    for(var i = hightestValue(array); i >= 0; i--) {    //For-Schleife absteigend ausgehend vom hoechsten Wert in values

        //Es wird vom Hoechsten Wert des Arrays heruntergezaehlt. Wenn Zahl i im zu sortierenden Array enthalten ist: Wert wird in neuem Array abgespeichert
        while(array.includes(i)) {                         //Hier while, da mehrere gleiche Werte nich uebersehen werden durfen. IF wuerde dopplung aufheben
            array.splice(array.indexOf(i), 1);
            sortedArray.push(i);
        }
    }
    return sortedArray;  //sortiertes Array ausgeben
}

//Reduziert array auf Laenge length. Nur die Ersten Werte werden dabei verwendert. Da vorher in der Regel das array sortiert wird, sind die Werte ueber length irrelevant und koennen geloescht werden.
function limitEntries(array, length) {
    if(array.length > length) {     
        var outputArray = [];
        for(var i = 0; i < length; i++) {
            outputArray.push(array[i]);
        }
        return outputArray;
    }
    return array;
}
