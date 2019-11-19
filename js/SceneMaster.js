// マスタークラス
class MasterScene {
  constructor(width, height) {
    // canvasサイズ
    this._width = width;             
    this._height = height;
    // 現在のシーン
    this.sequence       = title_seq;
    
    // ゲームをプレイ中かのフラグ
    this.gameFlag=false;
    // 配置されているActor一覧。
    this._actors = [];
    
    // 線形四分木空間。
    // とりあえずレベル3ぐらいで。
    this._qTree = new LinearQuadTreeSpace(width, height, 3);

    // プレイ中の経過時間
    this.Gametime=0;
  }
  
  // 世界にActorを配置する。
  addActor(actor) {
    this._actors.push(actor);
  }
  // リセット
  reset()
  {
    this.Gametime=0;  // 経過時間を初期化
    this._actors = [];  // 登録されたアクターを初期化
    this._qTree.clear(); //  線形四分木をクリアする。
  }
  // 更新メソッド。Actorのupdateとは別。
  update() {
    const info = {
      world: {
        width: this._width,
        height: this._height
      }
    };
    
    // 各Actorをupdateする。
    this._actors.forEach((a) => {
      a.update(info);
    });
    
    // 線形四分木をクリアする。
    this._qTree.clear();
    
    // 各Actorを四分木に登録する。
    this._actors.forEach((a) => {
      this._qTree.addActor(a);
    });
    
    // 各Actorの当たり判定を取る。
    this._hitTest();
  }
  
  // 当たり判定。
  _hitTest(currentIndex = 0, objList = []) {
    const currentCell = this._qTree.data[currentIndex];
    
    // 現在のセルの中と、衝突オブジェクトリストとで
    // 当たり判定を取る。
    this._hitTestInCell(currentCell, objList);

    // 次に下位セルを持つか調べる。
    // 下位セルは最大4個なので、i=0から3の決め打ちで良い。
    let hasChildren = false;
    for(let i = 0; i < 4; i++) {
      const nextIndex = currentIndex * 4 + 1 + i;
      
      // 下位セルがあったら、
      const hasChildCell = (nextIndex < this._qTree.data.length) && (this._qTree.data[nextIndex] !== null);
      hasChildren = hasChildren || hasChildCell;
      if(hasChildCell) {
        // 衝突オブジェクトリストにpushして、
        objList.push(...currentCell);
        // 下位セルで当たり判定を取る。再帰。
        this._hitTest(nextIndex, objList);
      }
    }

    // 終わったら追加したオブジェクトをpopする。
    if(hasChildren) {
      const popNum = currentCell.length;
      for(let i = 0; i < popNum; i++) {
        objList.pop();
      }
    }
  }
  // セルの中の当たり判定を取る。
  // 衝突オブジェクトリストとも取る。
  _hitTestInCell(cell, objList) {
    // セルの中。総当たり。
    const length = cell.length;
    const cellColliderCahce = new Array(length); // globalColliderのためのキャッシュ。
    if(length > 0) { cellColliderCahce[0] = cell[0]; }

    for(let i=0; i < length - 1; i++) {
      const obj1 = cell[i];
      const collider1  = cellColliderCahce[i]; // キャッシュから取ってくる。
      for(let j=i+1; j < length; j++) {
        const obj2 = cell[j];

        // キャッシュから取ってくる。
        // ループ初回は直接取得してキャッシュに入れる。
        let collider2;
        if(i === 0) {
          collider2 = obj2;
          cellColliderCahce[j] = collider2;
        } else {
          collider2 = cellColliderCahce[j];
        }
        // どちらも生きていてかつ画面に映っていれば当たり判定をとる
        if(collider1.object.isAlive&&collider2.object.isAlive&&!collider1.object.isHide&&!collider2.object.isHide)
        {
        const hit = Collider(collider1, collider2);　// 判定
        
        if(hit) {　// 当たっているので処理に入る
          if(collider1.object.myName=="player"||collider2.object.myName=="player")  // 片方がプレイヤー
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy"||collider1.object.myName=="enemyBullet"||collider2.object.myName=="enemyBullet") // 敵か敵の弾の場合
            {
            // プレイヤーを殺す
            killPlayer();
          }
        }
          if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")  // 片方がプレイヤーの弾
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy")  // 敵に当たった場合
           {
            SE2.play();                            // 敵に当たると音を鳴らす
            // 当たった敵にダメージを与える
            if(collider1.object.myName=="enemy")  
            {
              collider1.Damage(collider2.BulletPawer);
              collider2.object.isAlive=false;         // 当たった弾は要らないので消す
            }
            else{
              collider2.Damage(collider1.BulletPawer);
              collider1.object.isAlive=false;         // 当たった弾は要らないので消す
            }
          }
        }

      }
    }
  }
}
    // 衝突オブジェクトリストと。
    const objLength = objList.length;
    const cellLength = cell.length;
    for(let i=0; i<objLength; i++) {
      const obj = objList[i];
      const collider1 = obj; // 直接取得する。
      for(let j=0; j<cellLength; j++) {
        const cellObj = cell[j];
        const collider2 = cellColliderCahce[j]; // キャッシュから取ってくる。
        // どちらも生きていてかつ画面に映っていれば当たり判定をとる
        if(collider1.object.isAlive&&collider2.object.isAlive&&!collider1.object.isHide&&!collider2.object.isHide)
        {
        const hit = Collider(collider1, collider2);　// 判定
        
        if(hit) {　// 当たっているので処理に入る
          if(collider1.object.myName=="player"||collider2.object.myName=="player")  // 片方がプレイヤー
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy"||collider1.object.myName=="enemyBullet"||collider2.object.myName=="enemyBullet") // 敵か敵の弾の場合
            {
            // プレイヤーを殺す
            killPlayer();
          }
        }
          if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")  // 片方がプレイヤーの弾
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy")  // 敵に当たった場合
           {
            SE2.play();                            // 敵に当たると音を鳴らす
            // 当たった敵にダメージを与える
            if(collider1.object.myName=="enemy")  
            {
              collider1.Damage(collider2.BulletPawer);
              collider2.object.isAlive=false;         // 当たった弾は要らないので消す
            }
            else{
              collider2.Damage(collider1.BulletPawer);
              collider1.object.isAlive=false;         // 当たった弾は要らないので消す
            }
           
          }
        }

      }
    }
      }
    }
}
  Sequence()
{
  this.sequence= title_seq;
}

}
var scene = new MasterScene(global.canvas.width,global.canvas.height);             // マスター
var titleUI=new UI("titleUI","image/title.png",0.8,global.canvas.width/2,global.canvas.height/2);     // タイトルUIオブジェクト
var spaceUI=new UI("spaceUI","image/Start.png",1,global.canvas.width/2,global.canvas.height/1.3);   // タイトルスペースUIオブジェクト
var gameOverUI=new UI("gameOverUI","image/gameover.png",1,global.canvas.width/2,global.canvas.height/2);    // ゲームオーバーUIオブジェクト
var gameClearUI=new UI("gameClearUI","image/gameclear.png",1,global.canvas.width/2,global.canvas.height/2); // ゲームクリアーUIオブジェクト
var player=new Player("Mplayer","image/texture00.png",0.2,global.canvas.width/2,global.canvas.height / 1.5); // プレイヤーオブジェクト
var playerHitBox=new hitBox("player","image/hitbox.png",1,global.canvas.width/2,global.canvas.height / 1.5); // プレイヤー当たり判定オブジェクト
var enemy=[];   // エネミーオブジェクト
var bullet=[];  // 弾オブジェクト
var boss;       // ボスオブジェクト
var bossflag=false; // ボスを出現させるかのフラグ
var enemyData=GetEnemyData(); // エネミーのデータを格納
var bossData=GetBossData();   // ボスのデータを格納
var resultFlag=false; // リザルト時の生き死にフラグ
var lifeBar = $('lifeBar'); // HPバーを持たす
// BGM処理 ------------------------------------
var BGM1 = {    // BGM
 
  ready : false,
   
  play : function()
  {
    if(BGM1.ready)
    {
      BGM1.wav.play();
    }
  },
   
  stop : function()
  {
    if(BGM1.ready)
    {
      BGM1.wav.stop();
    }
  },
   
  onload : function() // body 要素の on_load 属性から呼ばれる
  {
    BGM1.wav = new Audio('sound/bgm1.wav');
    BGM1.wav.onload = function()
    {
      BGM1.ready = true;
    }
  }
   
  };
  var SE1 = { // 爆発音
 
    ready : false,
     
    play : function()
    {
      if(SE1.ready)
      {
        SE1.wav.play();
      }
    },
     
    stop : function()
    {
      if(SE1.ready)
      {
        SE1.wav.stop();
      }
    },
     
    onload : function() // body 要素の on_load 属性から呼ばれる
    {
      SE1.wav = new Audio('sound/exp.wav');
      SE1.wav.onload = function()
      {
        SE1.ready = true;
      }
    }
     
    };
    var SE2 = { // HIT音
 
      ready : false,
       
      play : function()
      {
        if(SE2.ready)
        {
          SE2.wav.play();
        }
      },
       
      stop : function()
      {
        if(SE2.ready)
        {
          SE2.wav.stop();
        }
      },
       
      onload : function() // body 要素の on_load 属性から呼ばれる
      {
        SE2.wav = new Audio('sound/hit.wav');
        SE2.wav.onload = function()
        {
          SE2.ready = true;
        }
      }
       
      };
      var SE3 = {　// 発射音
 
        ready : false,
         
        play : function()
        {
          if(SE3.ready)
          {
            SE3.wav.play();
          }
        },
         
        stop : function()
        {
          if(SE3.ready)
          {
            SE3.wav.stop();
          }
        },
         
        onload : function() // body 要素の on_load 属性から呼ばれる
        {
          SE3.wav = new Audio('sound/bullet1.wav');
          SE3.wav.onload = function()
          {
            SE3.ready = true;
          }
        }
         
        };
  //　音を読み込む----------------------------
  BGM1.onload();
  BGM1.wav.onload();
  SE1.onload();
  SE1.wav.onload();
  SE2.onload();
  SE2.wav.onload();
  SE3.onload();
  SE3.wav.onload();
  //-----------------------------------------
//---------------------------------------------
// プレイヤー関連をアクター登録
player.object.reset();
playerHitBox.object.reset();
scene.addActor(player);
scene.addActor(playerHitBox);
//----------------------------------------------------------------------------
// 敵をデータを元に登録しておく
for(i=0;i<enemyData.length;i++) // 通常敵
{

  var name=enemyData[i].name;
  var image=enemyData[i].image;
  var scale=enemyData[i].scale;
  var posX=enemyData[i].posX;  var velX=enemyData[i].velX;
  var posY=enemyData[i].posY;  var velY=enemyData[i].velY;
  var type=enemyData[i].type;  var bulletType=enemyData[i].bulletType;
  var HP = enemyData[i].HP;
  var time =enemyData[i].time; var interval=enemyData[i].interval;
  enemy.push(new Enmey(name,image,scale,posX,posY,velX,velY,type,HP,time,interval,bulletType));
  enemy[i].object.isAlive=true;
  scene.addActor(enemy[i]); 
}
for(i=0;i<bossData.length;i++)  // ボス
{
  var name=bossData[i].name;
  var image=bossData[i].image;
  var scale=bossData[i].scale;
  var posX=bossData[i].posX;  var velX=bossData[i].velX;
  var posY=bossData[i].posY;  var velY=bossData[i].velY;
  var type=bossData[i].type;  var bulletType=bossData[i].bulletType;
  var HP = bossData[i].HP;
  var time =bossData[i].time; var interval=bossData[i].interval;
  this.boss=new Enmey(name,image,scale,posX,posY,velX,velY,type,HP,time,interval,bulletType);
  boss.object.isAlive=true;
  scene.addActor(boss); 
  
}
//----------------------------------------------------------------------------

// ゲームを再度始めるために初期化
function gameStart()
{
  // プレイヤーの位置の入れ直しとアクターに登録しなおす-----------------------------
  player.object.myPosX=global.canvas.width/2;
  player.object.myPosY=global.canvas.height / 1.5;
  player.object.reset();
  playerHitBox.object.myPosX=player.object.myPosX;
  playerHitBox.object.myPosY=player.object.myPosY;
  playerHitBox.object.reset();
  scene.addActor(player);
  scene.addActor(playerHitBox);
  //----------------------------------------------------------------------------
  // 敵を再度入れなおす-----------------------------------------------------------
  for(i=0;i<enemyData.length;i++)
  {

    var name=enemyData[i].name;
    var image=enemyData[i].image;
    var scale=enemyData[i].scale;
    var posX=enemyData[i].posX;  var velX=enemyData[i].velX;
    var posY=enemyData[i].posY;  var velY=enemyData[i].velY;
    var type=enemyData[i].type;  var bulletType=enemyData[i].bulletType;
    var HP = enemyData[i].HP;
    var time =enemyData[i].time; var interval=enemyData[i].interval;
    enemy.push(new Enmey(name,image,scale,posX,posY,velX,velY,type,HP,time,interval,bulletType));
    enemy[i].object.isAlive=true;
    scene.addActor(enemy[i]); 
  }
  for(i=0;i<bossData.length;i++)
  {
    var name=bossData[i].name;
    var image=bossData[i].image;
    var scale=bossData[i].scale;
    var posX=bossData[i].posX;  var velX=bossData[i].velX;
    var posY=bossData[i].posY;  var velY=bossData[i].velY;
    var type=bossData[i].type;  var bulletType=bossData[i].bulletType;
    var HP = bossData[i].HP;
    var time =bossData[i].time; var interval=bossData[i].interval;
    this.boss=new Enmey(name,image,scale,posX,posY,velX,velY,type,HP,time,interval,bulletType);
    boss.object.isAlive=true;
    scene.addActor(boss); 
  }
  //------------------------------------------------------------------------------
}
// タイトルシーン
function title_seq()
	{
    lifeBar.style.display="none"; // HPバーを隠す
    titleUI.object.image.Draw(titleUI.object.posX,titleUI.object.posY,true);  // タイトルの描画
    spaceUI.Flashing();   // UIの点滅
    if(spaceUI.object.isHide) // 隠れていなければ描画
    {
      spaceUI.object.image.Draw(spaceUI.object.posX,spaceUI.object.posY,true); // UIの描画
    }

     // キーが押されていた時の処理
       document.addEventListener('keydown', (event) => {
        var keyCode = event.keyCode;
        if(this.sequence==title_seq&&this.gameFlag==false)  // 他のシーンで呼ばれないようにする
        {
          if(keyCode=='32') //  スペースキーが押されたら
          {
            BGM1.play();    // BGMを再生する
            this.gameFlag=true;   // ゲーム中に変える
            bossflag=false; // ボスが出ていない状態にしておく
            this.sequence =gameplay_seq;  // ゲームシーンに遷移
          }
        }
      });
      // キーを離した時の処理
      document.addEventListener('keyup', (event) => {
        var keyCode = event.keyCode;
        if(this.sequence==title_seq)
        {
          if(keyCode=='32') //  スペースキーが一度離れるまでリザルトからそのまま行かないようにする
          {
          this.gameFlag=false;
          }
        }
      });
}
// ゲームシーン
function gameplay_seq()
	{
    this.Gametime++;    // 開始と同時に経過時間をとる
    scene.update();     // アクターのアップデート
    if(player.keyflag[4]==true)    // プレイヤーのキーフラグのXが立っていたら
    {
      player.bulletcount--; // 弾の間隔を使って弾を作って撃つ
      if(player.bulletcount<=0)
      {
        StraightBullet(0,-5,player,"bullet","image/bullet.png");  // 弾を作る
        SE3.play();         // 発射音
        player.bulletcount=5;   // 5フレーム間隔
      }
    }
    if(player.object.isAlive) // プレイヤーが生きている間の処理
    {
      // 当たり判定をプレイヤーに追従させる
      playerHitBox.object.myPosX=player.object.posX;  
      playerHitBox.object.myPosY=player.object.posY;
      player.object.image.Draw(player.object.posX,player.object.posY,true);      // プレイヤーの描画
      if(player.keyflag[5]==true)   // シフトが押されている間当たり判定描画
      {
        playerHitBox.object.image.Draw(playerHitBox.object.posX,playerHitBox.object.posY,true); 
      }
    }

    if(boss.object.isHide)  // ボスが隠れていてボスの出現フラグが立ったら出現
    {
      if(bossflag)
      {
        boss.object.isHide=false;
      }
    }
    for(i=0;i<enemy.length;i++) // 通常の敵が全員死んでいたらボス出現
    {
      bossflag=true;
      if(enemy[i].object.isAlive)
      {
        bossflag=false;
        break;
      }
    }
    if(boss.object.isAlive&&!boss.object.isHide) // ボスが出現している時の処理
    {
      if(boss.bulletCount/60>boss.interval) //  ボスが弾を撃つ
      {
        StraightBullet(0,7,boss,"enemyBullet","image/enemybullet1.png");
        shootCircularBullets(45,3,boss);
        EnemyShotPattern3(3,3,player,boss);
        boss.bulletCount=0;
      }
      boss.object.image.Draw(boss.object.posX,boss.object.posY,true); // ボスの描画
    }
    // 通常敵の処理
    for(i=0;i<enemy.length;i++)
    {
      if(enemy[i].object.isHide)  // 隠れている間経過時間を元に出現
      {
        if(scene.Gametime/60>enemy[i].myTime)
        {
          enemy[i].object.isHide=false;
        }
      }
      if(enemy[i].object.isAlive) // 生きている間
      {
        if(enemy[i].bulletCount/60>enemy[i].interval) // それぞれの弾の間隔で自分の弾を撃つ
        {
          switch(enemy[i].bulletType)
          {
            case "Straight":  // 真直ぐ
                StraightBullet(0,5,enemy[i],"enemyBullet","image/enemybullet1.png");
              break;
            case "Circle":    // 周囲に
                shootCircularBullets(45,2,enemy[i]);
                  break;
            case "OneFollow": // プレイヤーを狙って
                EnemyShotPattern3(2,2,player,enemy[i]);
                      break;
          }
          enemy[i].bulletCount=0;
      }
      }
      if(!enemy[i].object.isAlive&&!enemy[i].object.isHide) // 敵が死んだら配列から消す
      {
        enemy.splice(i,1);
      }  
      if(enemy[i]!==undefined)
      {
        if(enemy[i].object.isAlive&&!enemy[i].object.isHide)
        {
          enemy[i].object.image.Draw(enemy[i].object.posX,enemy[i].object.posY,true);　// 敵の描画
        }  
      }
  

    }
    for(i=0;i<bullet.length;i++)  // 消えていえる弾は配列から消す
    {
      if(bullet[i].object.isAlive == false)
      {
        bullet.splice(i,1);
      }
    }
    if(!boss.object.isAlive)  // ボスが死んだら
    {

        // 配列初期化
        enemy.splice(0,enemy.length);
        bullet.splice(0,bullet.length);
        // シーンをリザルトに
        this.sequence =result_seq;
        this.gameFlag=false;
        resultFlag=true;
        gameClearUI.object.isHide=resultFlag;
    }
    if(player.object.isAlive==false)　// プレイヤーが死んだら
    {
      // 配列初期化
      enemy.splice(0,enemy.length);
      bullet.splice(0,bullet.length);
      // シーンをリザルトに
      this.sequence =result_seq;
      this.gameFlag=false;
      resultFlag=false;
      gameOverUI.object.isHide=resultFlag;
    }
  }
  // リザルトシーン
  function result_seq()
  {
    // HPバーを消す
    lifeBar.style.display="none";
    if(resultFlag)
    {
      gameClearUI.Flashing(); // 点滅処理
      if(gameClearUI.object.isHide)
      {
        gameClearUI.object.image.Draw(gameClearUI.object.posX,gameClearUI.object.posY,true);  // リザルト描画(ゲームクリア)
      }
    }
    else 
    {
      gameOverUI.Flashing(); // 点滅処理
      if(gameOverUI.object.isHide)
      {
        gameOverUI.object.image.Draw(gameOverUI.object.posX,gameOverUI.object.posY,true);  // リザルト描画(ゲームオーバー)
       
      }
    }
   
     // キーを押したときの処理
     document.addEventListener('keydown', (event) => {
      var keyCode = event.keyCode;
      if(this.sequence==result_seq)
      {
        if(keyCode=='32') //  スペースキーが押されたら
        {
          scene.reset();  
          gameStart();
          BGM1.play();  // BGMを流す
          this.gameFlag=true;
          this.sequence =title_seq; // シーンをタイトルに
        }
      }
    });
      
  }

  function killPlayer()
  {
    player.object.isAlive=false;
  }

      // degree度の方向にspeedの速さで弾を発射する
     function shootBullet(degree, speed,enemy) {
        const rad = degree / 180 * Math.PI;
        const velocityX = Math.cos(rad) * speed;
        const velocityY = Math.sin(rad) * speed;
        bullet.push(new Bullet("enemyBullet","image/enemybullet2.png",1,enemy.object.posX, enemy.object.posY,velocityX,velocityY,1,0,"NORMAL"));
        bullet[bullet.length-1].object.isAlive=true;
        bullet[bullet.length-1].object.isHide=false;
        scene.addActor(bullet[bullet.length-1]);
    }
  
    // num個の弾を円形に発射する
   function shootCircularBullets(num, speed,enemy) {
        const degree = 360 / num;
        for(let i = 0; i < num; i++) {
            this.shootBullet(degree * i, speed,enemy);
        }
    }
    // プレイヤーに向けて打つ弾を作る
    function EnemyShotPattern3(speedX,speedY,player,enemy){

      //現在のプレイヤーの座標と、弾の初期座標からそれぞれ角度を計算する。
      const angele = Math.atan2(player.object.posY-enemy.object.posY,player.object.posX-enemy.object.posX);
      const velocityX = speedX;
      const velocityY = speedY;
      bullet.push(new Bullet("enemyBullet","image/enemybullet3.png",1,enemy.object.posX, enemy.object.posY,velocityX,velocityY,1,angele,"SHIFT"));
      bullet[bullet.length-1].object.isAlive=true;
      bullet[bullet.length-1].object.isHide=false;
      scene.addActor(bullet[bullet.length-1]);
}
// 真直ぐ飛ぶ弾を作る
  function StraightBullet(speedX,speedY,obj,name,image){
  const velocityX = speedX;
  const velocityY = speedY;
  bullet.push(new Bullet(name,image,1,obj.object.posX, obj.object.posY,velocityX,velocityY,1,0,"NORMAL"));
  bullet[bullet.length-1].object.isAlive=true;
  bullet[bullet.length-1].object.isHide=false;
  scene.addActor(bullet[bullet.length-1]);
}
  
  //! フレームアップデートメソッド
	SetFrameUpdateFunc( frameUpdate );
	function frameUpdate()
	{
    global.c2d.clearRect( 0, 0, global.canvas.width, global.canvas.height );
    scene.sequence();
    }
