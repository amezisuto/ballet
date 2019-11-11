class Bullet{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);
        //this.funcP=new 
        this.mo=Move;
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
function Move()
{
   this.object.myposX+=1;
   this.object.image.Draw(this.object.posX,this.object.posY,true);
   console.log("通っている");
}