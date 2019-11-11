var global = {};
global.canvas          = $("canvas");
global.c2d             = global.canvas.getContext("2d");
global.frameCount      = 0;
global.frameUpdateFunc = function(){};
global.appScreen       = $("appScreen");

//! IDからエレメントの参照を取得する
function $( id )
{
    return document.getElementById( id );
}

//! クラスのメソッド継承用
Function.prototype.inherit = function (baseClass) {
    function tempClass() {}
    tempClass.prototype = baseClass.prototype;
    this.prototype = new tempClass;
    this.prototype.constructor = this;
}
//! 画像読み込み
function LoadImage( canv, path ,scale)
{
    this.img = new Image();
    this.img.src = path;
    this.canv = canv;
    this.alpha = 1.0;
    this.scale = scale;
}
LoadImage.prototype = {
    IsReady : function() {
        return this.img.complete;
    },
    Image : function() {
        return this.img;
    },
    Draw : function( x, y, bCenter ) {
        this.canv.globalAlpha = ClampZeroOne( this.alpha );
        if( this.canv.globalAlpha > 0.0 )
        {
            
            var iwidth  = this.img.width;
            var iheight = this.img.height;
            //
            if( this.scale != 1 ) // スケールが1ではないなら
            {
                // 中心位置に合わせる画像の縦横比をスケールで調整
                iwidth  *= this.scale;  
                iheight *= this.scale;
                if( bCenter )                // 画像の視点を中心にするかどうか
                {
                    this.canv.drawImage( this.img, x-iwidth/2, y-iheight/2, iwidth, iheight );
                }else{
                    this.canv.drawImage( this.img, x, y, iwidth, iheight );
                }
            }else{
                if( bCenter )                // 画像の視点を中心にするかどうか
                {
                  
                    this.canv.drawImage( this.img, x-this.img.width/2, y-this.img.height/2 );
                }else{
                    this.canv.drawImage( this.img, x, y );
                }
            }
        }
        this.canv.globalAlpha = 1.0;
    }
}

//! 値を0～1にクランプ
function ClampZeroOne( n ){
    if( n<0 )return 0;
    if( n>1 )return 1;
    return n;
}
//! requestAnimFrame オーバーライド
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
        function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

    //! フレームアニメーションループ
	(function frameUpdateLoop(){
		requestAnimFrame(frameUpdateLoop);
		global.frameCount++;
		global.frameUpdateFunc();
		//global.mouse.FlagClear();
	})();
//! フレームアップデート関数のセット
function SetFrameUpdateFunc( func )
{
    global.frameUpdateFunc = func;
}
