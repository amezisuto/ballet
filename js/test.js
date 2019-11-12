
// 線形四分木空間。
// 空間階層のことをレベル、
// 各小空間のことをセルと呼ぶことにする。
class LinearQuadTreeSpace {
  constructor(width, height, level) {
    this._width = width;
    this._height = height;
    this.data = [null];
    this._currentLevel = 0;
    
    // 入力レベルまでdataを伸長する。
    while(this._currentLevel < level) {
      this._expand();
    }
  }
  
  // dataをクリアする。
  clear() {
    this.data.fill(null);
  }
  
  // 要素をdataに追加する。
  // 必要なのは、要素と、レベルと、レベル内での番号。
  _addNode(node, level, index) {
    // オフセットは(4^L - 1)/3で求まる。
    // それにindexを足せば線形四分木上での位置が出る。
    const offset = ((4 ** level) - 1) / 3;
    const linearIndex = offset + index;

    // もしdataの長さが足りないなら拡張する。
    while(this.data.length <= linearIndex) {
      this._expandData();
    }

    // セルの初期値はnullとする。
    // しかし上の階層がnullのままだと面倒が発生する。
    // なので要素を追加する前に親やその先祖すべてを
    // 空配列で初期化する。
    let parentCellIndex = linearIndex;
    while(this.data[parentCellIndex] === null) {
      this.data[parentCellIndex] = [];

      parentCellIndex = Math.floor((parentCellIndex - 1) / 4);
      if(parentCellIndex >= this.data.length) {
        break;
      }
    }

    // セルに要素を追加する。
    const cell = this.data[linearIndex];
    cell.push(node);
  }
  
  // Actorを線形四分木に追加する。
  // Actorのコリジョンからモートン番号を計算し、
  // 適切なセルに割り当てる。
  addActor(actor) {
    const collider = actor.globalCollider;
    
    // モートン番号の計算。
    const leftTopMorton = this._calc2DMortonNumber(collider.left, collider.top);
    const rightBottomMorton = this._calc2DMortonNumber(collider.right, collider.bottom);
    
    // 左上も右下も-1（画面外）であるならば、
    // レベル0として扱う。
    // なおこの処理には気をつける必要があり、
    // 画面外に大量のオブジェクトがあるとレベル0に
    // オブジェクトが大量配置され、当たり判定に大幅な処理時間がかかる。
    // 実用の際にはここをうまく書き換えて、あまり負担のかからない
    // 処理に置き換えるといい。
    if(leftTopMorton === -1 && rightBottomMorton === -1) {
      this._addNode(actor, 0, 0);
      return;
    }
    
    // 左上と右下が同じ番号に所属していたら、
    // それはひとつのセルに収まっているということなので、
    // 特に計算もせずそのまま現在のレベルのセルに入れる。
    if(leftTopMorton === rightBottomMorton) {
      this._addNode(actor, this._currentLevel, leftTopMorton);
      return;
    }
    
    // 左上と右下が異なる番号（＝境界をまたいでいる）の場合、
    // 所属するレベルを計算する。
    const level = this._calcLevel(leftTopMorton, rightBottomMorton);
    
    // そのレベルでの所属する番号を計算する。
    // モートン番号の代表値として大きい方を採用する。
    // これは片方が-1の場合、-1でない方を採用したいため。
    const larger = Math.max(leftTopMorton, rightBottomMorton);
    const cellNumber = this._calcCell(larger, level);
    
    // 線形四分木に追加する。
    this._addNode(actor, level, cellNumber);
  }
  
  // 線形四分木の長さを伸ばす。
  _expand() {
    const nextLevel = this._currentLevel + 1;
    const length = ((4 ** (nextLevel+1)) - 1) / 3;

    while(this.data.length < length) {
      this.data.push(null);
    }

    this._currentLevel++;
  }
  
  // 16bitの数値を1bit飛ばしの32bitにする。
  _separateBit32(n) {
    n = (n|(n<<8)) & 0x00ff00ff;
    n = (n|(n<<4)) & 0x0f0f0f0f;
    n = (n|(n<<2)) & 0x33333333;
    return (n|(n<<1)) & 0x55555555;
  }
  
  // x, y座標からモートン番号を算出する。
  _calc2DMortonNumber(x, y) {
    // 空間の外の場合-1を返す。
    if(x < 0 || y < 0) {
      return -1;
    }

    if(x > this._width || y > this._height) {
      return -1;
    }

    // 空間の中の位置を求める。
    const xCell = Math.floor(x / (this._width / (2 ** this._currentLevel)));
    const yCell = Math.floor(y / (this._height / (2 ** this._currentLevel)));

    // x位置とy位置をそれぞれ1bit飛ばしの数にし、
    // それらをあわせてひとつの数にする。
    // これがモートン番号となる。
    return (this._separateBit32(xCell) | (this._separateBit32(yCell)<<1));
  }
  
  // オブジェクトの所属レベルを算出する。
  // XORを取った数を2bitずつ右シフトして、
  // 0でない数が捨てられたときのシフト回数を採用する。
  _calcLevel(leftTopMorton, rightBottomMorton) {
    const xorMorton = leftTopMorton ^ rightBottomMorton;
    let level = this._currentLevel - 1;
    let attachedLevel = this._currentLevel;

    for(let i = 0; level >= 0; i++) {
      const flag = (xorMorton >> (i * 2)) & 0x3;
      if(flag > 0) {
        attachedLevel = level;
      }

      level--;
    }

    return attachedLevel;
  }
  
  // 階層を求めるときにシフトした数だけ右シフトすれば
  // 空間の位置がわかる。
  _calcCell(morton, level) {
    const shift = ((this._currentLevel - level) * 2);
    return morton >> shift;
  }
}

// 当たり判定の基底クラス。
// このクラスを直接は使わない。
class Collider {
  constructor(type, x, y) {
    this._type = type;
    this.x = x;
    this.y = y;
  }
  
  get type() { return this._type; }
}

// 矩形（四角形）の当たり判定。
// 今回はこれだけを使う。
class RectangleCollider extends Collider {
  constructor(x, y, width, height) {
    super('rectangle', x, y);
    this.width = width;
    this.height = height;
  }
  
  // 位置の平行移動。
  // ローカル空間からグローバル空間への変換に使う。
  translate(dx, dy) {
    return new RectangleCollider(this.x + dx, this.y + dy, this.width, this.height);
  }
  
  // 各種getter。
  // なくてもいいが、あったほうが楽。
  get top() { return this.y; }
  get bottom() { return this.y + this.height; }
  get left() { return this.x; }
  get right() { return this.x + this.width; }
}

// Actor（役者）クラス。
// これを継承したオブジェクトが
// 実際のゲームオブジェクトとなる。
class Actor {
  constructor(option = {collider: null}) {
    this.x = 0;
    this.y = 0;
    this._collider= option.collider;
  }
  
  // フレームごとに状態を更新するためのメソッド。
  // ここでは実装せず、子クラス側で実装する。
  update(info) {}
  
  // グラフィックをレンダリングするメソッド。
  // 子クラス側で実装する。
  // canvasのコンテキストを受け取る。
  render(context) { }
  
  // 他のオブジェクトに衝突したときのメソッド。
  // 子クラス側で実装する。
  // 本来はメソッドにするよりも、もう少し回りくどい方法を
  // 取るべきだが、ここでは簡単のためこうしている。
  hit(other) {}
  
  get collider() { return this._collider; }
  
  // 今回、当たり判定はActorからの相対位置で
  // 配置するので、実際の当たり判定時には
  // グローバルな位置を取得する必要がある。
  // そのためのgetter。
  get globalCollider() {
    return this._collider.translate(this.x, this.y)
  }
}

// 今回使用する具体的なオブジェクト。
// 単純な四角形のActor。
class RectangleActor extends Actor {
  constructor(x, y, width, height) {
    // 当たり判定はActorからの相対位置なので、
    // Actorと当たり判定が同じ位置の場合、xとyは0。
    const collider = new RectangleCollider(0, 0, width, height);
    super({collider});
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this._color = 'rgb(0, 0, 0)';
    
    // 移動速度。ランダム。
    this._vx = Math.random() * 10 - 5;
    this._vy = Math.random() * 10 - 5;
  }
  
  // 更新メソッド。
  update(info) {
    this._color = 'rgb(0, 0, 0)';
    
    // 速度分だけ移動する。
    this.x += this._vx;
    this.y += this._vy;
    
    // 画面から外れたら、速度を反転する。
    if(this.x < 0 || this.x > info.world.width) {
      this._vx = -this._vx;
    }
    
    if(this.y < 0 || this.y > info.world.height) {
      this._vy = -this._vy;
    }
  }
  
  // 描画メソッド。
  render(context) {
    context.fillStyle = this._color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  
  // 衝突メソッド
  hit(other) {
    this._color = 'rgb(255, 0, 0)';
  }
}

// 当たり判定の検出器。
class CollisionDetector {
    // 当たり判定を検出する。
    detectCollision(collider1, collider2) {
      if(collider1.type == 'rectangle' && collider2.type=='rectangle') {
        return this.detectRectangleCollision(collider1, collider2);
      }
      
      return false;
    }
    
    // 矩形同士の当たり判定を検出する。
    detectRectangleCollision(rect1, rect2) {
      const horizontal = (rect2.left < rect1.right) && (rect1.left < rect2.right);
      const vertical = (rect2.top < rect1.bottom) && (rect1.top < rect2.bottom);
  
      return (horizontal && vertical);
    }
  }


// Actorが配置される世界。
class World {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    
    // 配置されているActor一覧。
    this._actors = [];
    
    // 線形四分木空間。
    // とりあえずレベル3ぐらいで。
    this._qTree = new LinearQuadTreeSpace(width, height, 3);
    
    this._detector = new CollisionDetector();
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
    if(length > 0) { cellColliderCahce[0] = cell[0].globalCollider; }

    for(let i=0; i < length - 1; i++) {
      const obj1 = cell[i];
      const collider1  = cellColliderCahce[i]; // キャッシュから取ってくる。
      for(let j=i+1; j < length; j++) {
        const obj2 = cell[j];

        // キャッシュから取ってくる。
        // ループ初回は直接取得してキャッシュに入れる。
        let collider2;
        if(i === 0) {
          collider2 = obj2.globalCollider;
          cellColliderCahce[j] = collider2;
        } else {
          collider2 = cellColliderCahce[j];
        }

        const hit = this._detector.detectCollision(collider1, collider2);

        if(hit) {
          obj1.hit(obj2);
          obj2.hit(obj1);
        }
      }
    }

    // 衝突オブジェクトリストと。
    const objLength = objList.length;
    const cellLength = cell.length;
    for(let i=0; i<objLength; i++) {
      const obj = objList[i];
      const collider1 = obj.globalCollider; // 直接取得する。
      for(let j=0; j<cellLength; j++) {
        const cellObj = cell[j];
        const collider2 = cellColliderCahce[j]; // キャッシュから取ってくる。
        const hit = this._detector.detectCollision(collider1, collider2);
        
        if(hit) {
          obj.hit(cellObj);
          cellObj.hit(obj);
        }
      }
    }
  }
  // レンダリング。
  render(context) {
    this._actors.forEach((a) => {
      a.render(context);
    });
  }
}

// Worldを作る。サイズは500x500ぐらいで。
const worldSize = 500;
const world = new World(worldSize, worldSize);

// Wolrd内にRectangleActorをランダム配置。
const actors = 1000;
for(let i=0; i<actors; i++) {
  const x = Math.random() * worldSize;
  const y = Math.random() * worldSize;
  const rect = new RectangleActor(x, y, 10, 10);
  world.addActor(rect);
}

// canvasの設置。
const canvas = document.createElement('canvas');
canvas.width = worldSize;
canvas.height = worldSize;
const context = canvas.getContext('2d');
document.body.appendChild(canvas);

// 時間表示の設置。
const timeCounter = document.createElement('div');
document.body.appendChild(timeCounter);

// メインループ。
function loop(timestamp) {
  // update()にかかる時間を測る。
  const start = performance.now();
  world.update();
  const end = performance.now();
  const timeStr = (end - start).toPrecision(4);
  timeCounter.innerText = `${timeStr}ms`;
  
  // 一度まっさらにしてからレンダリング。
  context.clearRect(0, 0, worldSize, worldSize);
  world.render(context);
  
  // 次のフレームを要求する。
  requestAnimationFrame((timestamp) => loop(timestamp));
}

// アニメーションを開始する。
requestAnimationFrame((timestamp) => loop(timestamp));