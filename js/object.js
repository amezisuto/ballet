// オブジェクトクラス  (このクラスを経由してオブジェクトを作る)
class GameObject{
    constructor(name,image,scale,x,y){
        this.name=name;         // 名前
        this.image=new LoadImage(global.c2d,image,scale);   // 画像登録
        this.posX=x;            // ポジションX
        this.posY=y;            // ポジションY
        this.alive =false;      // 生きているか(trueなら生きている)
        this.hide =true;        // 隠れているか(trueなら隠れている)
    }
    // 名前のゲッター
    get myName()
    {
        return this.name;
    }
    // イメージのゲッター
    get myImage()
    {
        return this.image.src;
    }
    // hideのゲッター
    get isHide()
    {
        return this.hide;
    }
    // aliveのゲッター
    get isAlive()
    {
        return this.alive;
    }
    // ポジションXのゲッター
    get myPosX()
    {
        return this.posX;
    }
    // ポジションYのゲッター
    get myPosY()
    {
        return this.posY;
    }
    // aliveのセッター
    set isAlive(flag)
    {
        this.alive=flag;
    }
    // hideのセッター
    set isHide(flag)
    {
        this.hide=flag;
    }
    // ポジションXのセッター
    set myPosX(x)
    {
        this.posX=x;
    }
    // ポジションYのセッター
    set myPosY(y)
    {
        this.posY=y;
    }
    // aliveとhideのリセット関数
    reset()
    {
      this.isAlive=true;
      this.isHide=false;
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
