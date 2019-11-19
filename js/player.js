// プライヤークラス
class Player{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);    // オブジェクト生成
        this.velX=3;                                         // ベクトルX
        this.velY=3;                                         // ベクトルy
        this.bulletcount=0;                                  // 弾の間隔
        this.keyflag=[                                       // 押されたキーを判別するためのフラグ
            false,    // 左キー
            false,    // 右キー
            false,    // 上キー
            false,    // 下キー
            false,    // Xキー
            false     // シフトキー
        ]
    }
  // 更新メソッド。
  update(info) {
    this._color = 'rgb(0, 0, 0)';
    this.Move();
  }
  Move()
{
    // キーが押された時の処理
    document.addEventListener('keydown', (event) => {
        var keyName = event.key;
    // 対応したフラグを立たせる---------------------------
    if(keyName=='ArrowLeft')
    {
         this.keyflag[0]=true;

    }
    else if(keyName=='ArrowRight')
    {
      this.keyflag[1]=true;
        
    }
    if(keyName=='ArrowUp')
    {
      this.keyflag[2]=true;
     
    }
    else if(keyName=='ArrowDown')
    {
      this.keyflag[3]=true;
        
    }
    if(keyName=='x'||keyName=='X')
    {
     this.keyflag[4]=true;
    }
    if(keyName=='Shift')
    {
     this.keyflag[5]=true;
    }
    //---------------------------------------
      });
    //キーを離した時の処理
      document.addEventListener('keyup', (event) => {
        var keyName = event.key;
    // 対応したフラグを折る---------------------------
    if(keyName=='ArrowLeft')
    {
      this.keyflag[0]=false;

    }
    else if(keyName=='ArrowRight')
    {
      this.keyflag[1]=false;
        
    }
    if(keyName=='ArrowUp')
    {
      this.keyflag[2]=false;
     
    }
    else if(keyName=='ArrowDown')
    {
      this.keyflag[3]=false;
    }
    if(keyName=='x'||keyName=='X')
    {
      this.keyflag[4]=false;
    }
    if(keyName=='Shift')
    {
      this.keyflag[5]=false;
      this.velX=3;   // 速度を戻す
      this.velY=3;
    }
    //---------------------------------------
      });
      //
      if( this.keyflag[0]==true)
      {
        this.object.posX-=this.velX;
      }
      if( this.keyflag[1]==true)
      {
        this.object.posX+=this.velX;
      }
      if( this.keyflag[2]==true)
      {
        this.object.posY-=this.velY;
      }
      if( this.keyflag[3]==true)
      {
        this.object.posY+=this.velY;
      }
      if( this.keyflag[5]==true)
      {
        this.velX=1;   // 速度を変える
        this.velY=1;
      }
      this.canvasMax(); // 画面外に出ないようにする
}
canvasMax()
{
  if(this.object.posX<0+this.object.image.ImageW()/2)  
  {
    this.object.posX=0+this.object.image.ImageW()/2;
  }
  if(this.object.posX>global.canvas.width-this.object.image.ImageW()/2)
  {
    this.object.posX=global.canvas.width-this.object.image.ImageW()/2;
  }
  if(this.object.posY<0+this.object.image.ImageH()/2)
  {
    this.object.posY=0+this.object.image.ImageH()/2;
  }
  if(this.object.posY>global.canvas.height-this.object.image.ImageH()/2)
  {
    this.object.posY=global.canvas.height-this.object.image.ImageH()/2;
  }
}
}




