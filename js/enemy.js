// 敵クラス
class Enmey{
    constructor(name,image,scale,x,y,velx,vely,type,hp,time,interval,bullettype,circlesize=1){
        this.object=new GameObject(name,image,scale,x,y);   // オブジェクト生成
        this.velX=velx;                                     // ベクトルX
        this.velY=vely;                                     // ベクトルy
        this.type=type;                                     // 敵の動きのタイプ
        this.myTime=time;                                   // 敵が出現する時間
        this.count=0;                                       // 敵の動きようのカウント
        this.circlesize =circlesize;                        // 円の動きの大きさ
        this.HP = hp;                                       // 敵のHP
        this.interval = interval;                           // 敵が弾を打つ間隔
        this.bulletType=bullettype;                         // 敵の弾のタイプ
        this.bulletCount=0;                                 // 敵が弾を打つタイミングを伝えるためのカウント
    }
    // HPゲッター
    get myhp()  
    {
        return this.HP;
    }
    // ダメージを与える関数
    Damage(bulletpaw)
    {
        this.HP -= bulletpaw;
    }
// 更新メソッド。
update(info) {
    if(!this.object.isHide) // 隠れていなければ処理に入る
    {
        this.bulletCount++;     // 弾を打つためのカウント
        switch(this.type)   // 敵の動きのタイプで動きを変える
        {
            case "Straight":        // 真直ぐに動く
                this.EnemyStraightMove();
                break;
            case "Wave":            // ウェーブを描いて動く
            this.count++;           // 動きをつけるため
                this.EnemyWaveMove();     
                break;
            case "Circle":          // 途中で止まって円を描いて回る
            this.count++;           // 動きをつけるため
                this.EnemyCircleMove();     
                break;
            case "boss":            // ボス用　一定の位置まで降りてきて左右に動く
                HPupdate(this.myhp);    // HPバーにHPを渡す
                this.EnemyBossMove();     
                break;
        }
        // 敵が画面外に出たら消える
        if(CanvasCollider(this)&&!this.object.isHide)
        {
            this.object.isAlive=false;
        }
        if(this.myhp<=0){ //  敵のHPが0になったら死んだことにする
           this.object.isAlive=false; 
         }
    }
  }
  /// 動き-------------------------------------------------------------------------------
  // 真直ぐ動く
  EnemyStraightMove()
  {
     this.object.posX+=this.velX;
     this.object.posY+=this.velY;
  }
  // ウェーブを描く
  EnemyWaveMove()
  {
      this.object.posX+=Math.sin(Math.PI*this.count/40.0)*2;
      this.object.posY+=this.velY;
  }
  // 円を描く
  EnemyCircleMove()
  {
    var maxcount=300;
    if(this.count<maxcount)
    this.object.posY+=this.velY;
      if(this.count>=maxcount){
        this.object.posX+=Math.sin((Math.PI*this.count-40.0)/140)*this.circlesize;
        this.object.posY+=Math.sin((Math.PI*this.count+30.0)/140)*this.circlesize;
        }
    }
    // ボス用
    EnemyBossMove()
    {
        if(this.object.posY<global.canvas.height/2.2)
        {
            this.object.posY+=this.velY;
        }
        else
        {
            if(this.object.posX<100||this.object.posX>380)
                 this.velX=-this.velX;
            this.object.posX+=this.velX;
        }
    }
    //----------------------------------------------------------------------------------

}
// HPバーのアップデート関数
function HPupdate(hp) {
    var lifeBar = $('lifeBar');
    lifeBar.style.display="block";
    lifeBar.value=hp;    
    }
    
  







