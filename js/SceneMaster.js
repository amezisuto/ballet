
class MasterScene {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this.sequence       = title_seq;
    
    // 配置されているActor一覧。
    this._actors = [];
    
    // 線形四分木空間。
    // とりあえずレベル3ぐらいで。
    this._qTree = new LinearQuadTreeSpace(width, height, 3);
    this.Gametime=0;
  }
  
  // 世界にActorを配置する。
  addActor(actor) {
    this._actors.push(actor);
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
        if(collider1.object.isAlive&&collider2.object.isAlive&&!collider1.object.isHide&&!collider2.object.isHide)
        {
        const hit = Collider(collider1, collider2);
        
        if(hit) {
          if(collider1.object.myName=="player"||collider2.object.myName=="player")
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy"||collider1.object.myName=="enemyBullet"||collider2.object.myName=="enemyBullet")
            {
            if(collider1.object.myName=="player")
            {
              collider1.object.isAlive=false;
              console.log("hit");
            }
            else{
              collider2.object.isAlive=false;
              console.log("hit");
            }
          }
        }
          if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")
          {
            if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy")
           {
            if(collider1.object.myName=="enemy")
            {
              collider1.Damage(collider2.BulletPawer);
              collider2.object.isAlive=false;
            }
            else{
              collider2.Damage(collider1.BulletPawer);
              collider1.object.isAlive=false;
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
        if(collider1.object.isAlive&&collider2.object.isAlive&&!collider1.object.isHide&&!collider2.object.isHide)
        {
          const hit = Collider(collider1, collider2);
        
          if(hit) {
            if(collider1.object.myName=="player"||collider2.object.myName=="player")
            {
              if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy"||collider1.object.myName=="enemyBullet"||collider2.object.myName=="enemyBullet")
              {
              if(collider1.object.myName=="player")
              {
                collider1.object.isAlive=false;
                console.log("hit");
              }
              else{
                collider2.object.isAlive=false;
                console.log("hit");
              }
            }
          }
            if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")
            {
              if(collider1.object.myName=="enemy"||collider2.object.myName=="enemy")
             {
              if(collider1.object.myName=="enemy")
              {
                collider1.Damage(collider2.BulletPawer);
                collider2.object.isAlive=false;
              }
              else{
                collider2.Damage(collider1.BulletPawer);
                collider1.object.isAlive=false;
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


var scene =new MasterScene(global.canvas.width,global.canvas.height);

var player =new Player("player","image/texture00.png",0.1,global.canvas.width/2,global.canvas.height / 1.5);
var enemy=[];
var bullet=[];
var count =0;
var enemyData=GetEnemyData();
player.object.isAlive=true;
player.object.isHide=false;
scene.addActor(player);
//----------------------------------------------------------------------------
// 敵をデータを元に登録しておく
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
//----------------------------------------------------------------------------
function title_seq()
	{
    this.Gametime++;
    if(player.keyflag[4]==true)
    {
      count--;
      if(count<=0)
      {
        bullet.push(new Bullet("bullet","image/bullet.png",1,player.object.posX,player.object.posY-(player.object.image.ImageH()/2+32),0,-5,1));
        bullet[bullet.length-1].object.isAlive=true;
        bullet[bullet.length-1].object.isHide=false;
        count=5;
        scene.addActor(bullet[bullet.length-1]);
      }
    }
    scene.update();
    //Move(player);
    if(player.object.isAlive)
    {
      player.object.image.Draw(player.object.posX,player.object.posY,true);
    }
  
    for(i=0;i<enemy.length;i++)
    {
      if(enemy[i].object.isHide)
      {
        //setTimeout( function(){enemy[i].object.SetHide(false);}, enemy[i].myTime*1000);
        if(scene.Gametime/60>enemy[i].myTime)
        {
          enemy[i].object.SetHide(false);
        }
      }
      if(enemy[i].myhp<=0){enemy[i].object.isAlive=false;}//  敵のHPが0になったら死んだことにする
      if(enemy[i].bulletCount/60>enemy[i].interval)
      {
        shootCircularBullets(45,2,enemy[i]);
        enemy[i].bulletCount=0;
      }
      if(enemy[i].object.isAlive&&!enemy[i].object.isHide)
      {
        enemy[i].object.image.Draw(enemy[i].object.posX,enemy[i].object.posY,true);
      }  
      if(!enemy[i].object.isAlive&&!enemy[i].object.isHide)
      {
        enemy.splice(i,1);
      }  
    }
    for(i=0;i<enemy.length;i++)
    {
      if(!enemy[i].object.isAlive&&!enemy[i].object.isHide)
      {
        enemy.splice(i,1);
      }  
    }
    for(i=0;i<bullet.length;i++)
    {
      if(bullet[i].object.isAlive == false)
      {
        bullet.splice(i,1);
      }
    }

  }
      // degree度の方向にspeedの速さで弾を発射する
     function shootBullet(degree, speed,enemy) {
        const rad = degree / 180 * Math.PI;
        const velocityX = Math.cos(rad) * speed;
        const velocityY = Math.sin(rad) * speed;
        bullet.push(new Bullet("enemyBullet","image/bullet.png",1,enemy.object.posX, enemy.object.posY,velocityX,velocityY,1));
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
  
  //! フレームアップデートメソッド
	SetFrameUpdateFunc( frameUpdate );
	function frameUpdate()
	{
    global.c2d.clearRect( 0, 0, global.canvas.width, global.canvas.height );
    scene.sequence();
    }
