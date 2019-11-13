class Bullet{
    constructor(name,image,scale,x,y,velx,vely,paw){
        this.object=new GameObject(name,image,scale,x,y);
        this.velX=velx;
        this.velY=vely;
        this.bulletPawer = paw;
    }
    get BulletPawer()
    {
        return this.bulletPawer;
    }
    set BulletPawer(paw)
    {
        this.bulletPawer = paw;
    }
      // 更新メソッド。
  update(info) {
   // this._color = 'rgb(0, 0, 0)';
    this.BulletMove();
  }
    BulletMove()
    {
        if(this.object.isAlive)
        {
            this.object.posX+=this.velX;
            this.object.posY+=this.velY;
            this.object.image.Draw(this.object.posX,this.object.posY,true);
            if(CanvasCollider(this))
            {
                this.object.isAlive=false;
                console.log("消す");
            }
        }


    }
}