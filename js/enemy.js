class Enmey{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);
    }
    get myName()
    {
        return this.name;
    }
    get myImage()
    {
        return this.image.src;
    }
}


console.log("別");
var enemy=new Enmey('namae',"image/nabe01.png",0,0);
var count=0;
console.log(enemy.myName);
 
