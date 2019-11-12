class GameObject{
    constructor(name,image,scale,x,y){
        this.name=name;
        this.image=new LoadImage(global.c2d,image,scale);
        this.posX=x;
        this.posY=y;
        this.alive =false;
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
      // フレームごとに状態を更新するためのメソッド。
  // ここでは実装せず、子クラス側で実装する。
  update(info) {}
     // 各種getter。
  // なくてもいいが、あったほうが楽。
  get top() { return this.posY - this.image.ImageH()/2; }
  get bottom() { return this.posY + this.image.ImageH()/2; }
  get left() { return this.posX - this.image.ImageW()/2;  }
  get right() { return this.posX + this.image.ImageW()/2; }

}
