/**
 * 画像アニメーションクラス
 *
 * このクラスは画像の指定の仕方が少し特殊になっています。
 * 例えば、以下のように引数を指定した場合、
 *
 * var effect = new Effect("effect1", "image/effect.gif", 10);
 *
 * "image/effect.gif"という画像自体を読み込むのではなく、
 * 指定のパスに連番で画像が保存されていると想定して処理を行います。
 * (この場合はimageフォルダ内にある effect0.gif 〜 effect9.gif までの
 *  画像を使用するように指定した、ということになります。)
 *
 * @param {string}  name     エフェクトの名前（何でもOKですが、idとして使用するため完全に一意な名前を指定してください。）
 * @param {string}  filename 画像までのパス
 * @param {integer} all      アニメーションに使う画像の枚数
 */
class Effect  {
    constructor(filename,all)
    {
// 拡張子と連番を除いたファイルのパス
this.path = filename.substr(0,filename.lastIndexOf("."));
// 画像の拡張子
this.extension = filename.substr(filename.lastIndexOf("."));
    /** 画像オブジェクト */
    this.images = new Array(all);
    for( var i = 0; i < this.images.length; ++i ){
        // 名前と番号を組み合わせて一意のIDとする
        this.images[i] = new LoadImage(global.c2d,this.path+i+this.extension,1);
    }
    /** 繰り返すかどうか */
    this.repeat = false;

    /** 現在描画している画像番号 */
    this.animIndex = 0;
    
    /** setInterval用のID */
    this.timerID = 0;

    // ポジション保管
    this.posX=0;
    this.posY=0;
    // hide
    this.hide=false;
    }
get IsHide()
{
    return this.hide;
}
set IsHide(hide)
{
    this.hide=hide;
}
    
    /**
 * アニメーションをスタートします。
 * @param {integer} x,y    描画位置
 * @param {number}  sec    何秒で1周アニメーションするか(省略すると1秒)
 * @param {boolean} repeat アニメーションを繰り返すか（省略すると繰り返しなし）
 * @return {boolean} 正常にスタートできれば true
 */
start(x,y,sec,repeat) {
    if( this.timerID ) return false;        
    if(typeof sec == 'undefined') sec = 1;
    this.repeat = (typeof repeat == 'undefined' ? false : repeat);
    var self = this;
    this.timerID = setInterval(function(){self.update()},sec*1000/this.images.length);
    for( var i = 0; i < this.images.length; ++i ){
        this.images[i].posX=x;
        this.images[i].posY=y;
    }
    this.images[0].IsHide=true;
    return true;
}

/** 
 * アニメーションを更新します。
 * 自動的に呼び出されます。
 */
update() {
    this.images[this.animIndex].IsHide=false;
    if( ++this.animIndex > this.images.length - 1 ){
        this.animIndex = 0;
        if( !this.repeat ){
            clearInterval(this.timerID);
            this.timerID = 0;
            return;
        }
    }
    this.images[this.animIndex].IsHide=true;
    console.log(this.images[this.animIndex].Image());
    this.Draw();
}

/**
 * アニメーションをリセットします。
 */
reset() {
    if( this.timerID ){
        clearInterval(this.timerID);
        this.timerID = 0;
    }
    this.animIndex = 0;
    for( var i = 0; i < this.images.length; ++i ){
        this.images[i].IsHide=false;
    }
}
Draw()
{
    console.log(this.images[this.animIndex].Image());
    this.images[this.animIndex].Draw(this.images[this.animIndex].posX,this.images[this.animIndex].posY,true);
}

}

