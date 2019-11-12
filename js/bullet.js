class Bullet{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);
        //this.funcP=new 
    }
    get myName()
    {
        return this.name;
    }
    get myImage()
    {
        return this.image.src;
    }
      // 更新メソッド。
  update(info) {
    this._color = 'rgb(0, 0, 0)';
    this.BulletMove();
  }
    BulletMove()
    {
        if(this.object.isAlive)
        {
            this.object.myPosY=this.object.posY-5;
            this.object.image.Draw(this.object.posX,this.object.posY,true);
            if(CanvasCollider(this))
            {
                this.object.isAlive=false;
                console.log("消す");
            }
        }


    }
}