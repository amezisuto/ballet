class GameObject{
    constructor(name,image,scale,x,y,option = {collider: null}){
        this.name=name;
        this.image=new LoadImage(global.c2d,image,scale);
        this.posX=x;
        this.posY=y;
        this.alive =false;
        this._collider = option.collider;
    }
    get myName()
    {
        return this.name;
    }
    get myImage()
    {
        return this.image.src;
    }
    get isAlive()
    {
        return this.alive;
    }
    set isAlive(flag)
    {
        this.alive=flag;
    }
    set myPosX(x)
    {
        this.posX=x;
    }
    set myPosY(y)
    {
        this.posY=y;
    }
}
