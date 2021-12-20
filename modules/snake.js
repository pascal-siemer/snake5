//Beinhaltet Koordinaten x,y und es kann eine Instanz von sich selbst an sich anhaengen (Variable next).
export function Snake(x, y) {
    this.x = x;
    this.y = y;
    var next;
    this.move = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.addNext = function(a, b) { //Instanz Snake an letze Instanz von Snake anhaengen ueber Variable next.
        if(this.next === undefined) {
            this.next = new Snake(a, b);
        } else {
            this.next.addNext(a, b);
        }
    }
    this.checkPosition = function(a, b) {   //true oder false. Prueft, ob sich an angegebener Position a,b eine Instanz von Snake befindet
        var occupied = (this.x == a && this.y == b);
        if(occupied) {
            return true
        } else if((this.next !== undefined)){
            return this.next.checkPosition(a, b);
        } else {
            return false;
        }
    }
    this.recursiveMove = function(a, b) {   //Bewegt alle Instanzen der Snake. Die erste Instanz wird an die neue Position a,b bewegt, die anderen Instanzen werden auf die Position ihres "vorgaengers" bewegt.
        if(this.next !== undefined) {
            this.next.recursiveMove(this.x, this.y);
        }
        this.x = a;
        this.y = b;
    }
    this.getLength = function() {           //Gibt die Anzahl aller Elemente der Snake aus.
        if(this.next === undefined) {
            return 1;
        } else {
            return this.next.getLength() + 1;
        }
    }
}