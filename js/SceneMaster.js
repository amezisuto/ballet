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
        if(collider1.object.isAlive&&collider2.object.isAlive)
        {
        const hit = Collider(collider1, collider2);
        if(hit) {
          if(!(collider1.object.myName=="bullet"&&collider2.object.myName=="bullet"))
          {
            if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")
            {
              if(collider1.object.myName=="player"||collider2.object.myName=="player")
              {
              console.log("プレイヤーに当たった");
              }
              else
              {
                collider1.object.isAlive=false;
                collider2.object.isAlive=false;
                console.log("敵に当たった");
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
        if(collider1.object.isAlive&&collider2.object.isAlive)
        {
          const hit = Collider(collider1, collider2);
        
          if(hit) {
            if(!(collider1.object.myName=="bullet"&&collider2.object.myName=="bullet"))
            {
            if(collider1.object.myName=="bullet"||collider2.object.myName=="bullet")
            {
              if(collider1.object.myName=="player"||collider2.object.myName=="player")
            {
              console.log("プレイヤーに当たった");
            }
            else
            {
              collider1.object.isAlive=false;
              collider2.object.isAlive=false;
              console.log("敵に当たった");
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

var enemy=new Enmey('namae',"image/nabe01.png",0.5,global.canvas.width/2,global.canvas.height);
var player =new Player("player","image/texture00.png",0.5,global.canvas.width/2,global.canvas.height / 2);
var playerE=[new Enmey("enemy","image/nabe01.png",0.5,Math.floor( Math.random() * global.canvas.width ),Math.floor( Math.random() * global.canvas.height ),0)];
var bullet=[new Bullet("bullet","image/bullet.png",1,global.canvas.width/2,global.canvas.height / 2)];
var count =0;
bullet.pop();
playerE.pop();
scene.addActor(enemy);
scene.addActor(player);
player.object.isAlive=true;
for(i=0;i<100;i++)
{
playerE.push(new Enmey("enemy"+i,"image/texture01.png",0.5,Math.floor( Math.random() * global.canvas.width ),Math.floor( Math.random() * global.canvas.height ),Math.floor( Math.random() *2)));
playerE[playerE.length-1].object.isAlive=true;
scene.addActor(playerE[i]);
}

function title_seq()
	{
    if(player.keyflag[4]==true)
    {
      //count--
      if(count<=0)
      {
        bullet.push(new Bullet("bullet","image/bullet.png",1,player.object.posX,player.object.posY-player.object.image.ImageH()/2));
        bullet[bullet.length-1].object.isAlive=true;
        //count=5;
        scene.addActor(bullet[bullet.length-1]);
      }
    }
    scene.update();

    enemy.object.image.Draw(enemy.object.posX,enemy.object.posY,true);
    //Move(player);
    if(player.object.isAlive)
    {
      player.object.image.Draw(player.object.posX,player.object.posY,true);
    }
  
    for(i=0;i<playerE.length;i++)
    {
      if(playerE[i].object.isAlive)
      {
        playerE[i].object.image.Draw(playerE[i].object.posX,playerE[i].object.posY,true);
      }  
    }
    for(i=0;i<playerE.length;i++)
    {
      if(!playerE[i].object.isAlive)
      {
        playerE.splice(i,1);
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
//CSVファイルを読み込む関数getCSV()の定義
function getCSV(){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", "test.csv", true); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行
  console.log("cheak");
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onload = function(){
convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
  }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for(var i=0;i<tmp.length;++i){
      result[i] = tmp[i].split(',');
  }

  alert(result[1][2]); // 300yen
}

getCSV(); //最初に実行される
  
  //! フレームアップデートメソッド
	SetFrameUpdateFunc( frameUpdate );
	function frameUpdate()
	{
    global.c2d.clearRect( 0, 0, global.canvas.width, global.canvas.height );
    scene.sequence();
    }
