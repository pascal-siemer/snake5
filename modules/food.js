//Beinhaltet Koordinaten x,y
export function Food(x, y) {   
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = './apple.png'     //Speicherort des "Aussehens" (Das anzuzeigende Bild)
    this.relocate = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.checkPosition = function(a,b) {    //Prueft, ob sich dieses Objekt an Position a,b befindet
        if(this.x == a && this.y == b) {
            return true;
        } else {
            return false;
        }
    }

}