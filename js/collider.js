// 当たり判定（AABB）
function Collider(objectA,objectB)
{
  if(objectA.object.left < objectB.object.right
    &&objectA.object.right> objectB.object.left
    &&objectA.object.top < objectB.object.bottom
    &&objectA.object.bottom > objectB.object.top)
    {
        return true;
    }
    return false;
}
// 画面外かどうかを判別する
function CanvasCollider(objectA)
{
  if(objectA.object.left<  global.canvas.width   
    &&objectA.object.right > 0
    &&objectA.object.top < global.canvas.height
    &&objectA.object.bottom > 0)
    {
        return false;
    }
    return true;
}
//-------------------------------------------------------------------------------
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
  addActor(gameObject) {
    const collider = gameObject;
    
    // モートン番号の計算。
    const leftTopMorton = this._calc2DMortonNumber(collider.object.left, collider.object.top);
    const rightBottomMorton = this._calc2DMortonNumber(collider.object.right, collider.object.bottom);
    
    // 左上も右下も-1（画面外）であるならば、
    // レベル0として扱う。
    // なおこの処理には気をつける必要があり、
    // 画面外に大量のオブジェクトがあるとレベル0に
    // オブジェクトが大量配置され、当たり判定に大幅な処理時間がかかる。
    // 実用の際にはここをうまく書き換えて、あまり負担のかからない
    // 処理に置き換えるといい。
    if(leftTopMorton === -1 && rightBottomMorton === -1) {
      this._addNode(gameObject, 0, 0);
      return;
    }
    
    // 左上と右下が同じ番号に所属していたら、
    // それはひとつのセルに収まっているということなので、
    // 特に計算もせずそのまま現在のレベルのセルに入れる。
    if(leftTopMorton === rightBottomMorton) {
      this._addNode(gameObject, this._currentLevel, leftTopMorton);
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
    this._addNode(gameObject, level, cellNumber);
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