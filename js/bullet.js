// 弾クラス
class Bullet{
    constructor(name,image,scale,x,y,velx,vely,paw,angele,type){
        this.object=new GameObject(name,image,scale,x,y);      // オブジェクト生成
        this.velX=velx;                                        // ベクトルX
        this.velY=vely;                                        // ベクトルy
        this.bulletPawer = paw;                                // 弾の威力
        this.angele=angele;                                    // 弾の角度
        this.bulletType=type;                                  // 弾のタイプ
    }
    // 威力のゲッター
    get BulletPawer()
    {
        return this.bulletPawer;
    }
    // 威力セッター
    set BulletPawer(paw)
    {
        this.bulletPawer = paw;
    }
      // 更新メソッド。
  update(info) {
   switch(this.bulletType) // 弾のタイプで動きを変える
   {
       case "NORMAL":
            this.BulletMove();
           break;
        case "SHIFT":
            this.BulletAngeleMove();
           break;
   }
    if(CanvasCollider(this)) // 弾が画面外に出たら消す
    {
        this.object.isAlive=false;
    }
  }
  　　// 真直ぐ飛ぶ
    BulletMove()
    {
        if(this.object.isAlive)
        {
            this.object.posX+=this.velX;
            this.object.posY+=this.velY;
            this.object.image.Draw(this.object.posX,this.object.posY,true);
        }
    }
      // 角度をつける
    BulletAngeleMove()
    {   
        if(this.object.isAlive)
        {
            this.object.posX+=this.velX*Math.cos(this.angele);//それぞれの角度を使って
            this.object.posY+=this.velY*Math.sin(this.angele);
            this.object.image.Draw(this.object.posX,this.object.posY,true);
        }
    }
}