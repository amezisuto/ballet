
//! システムグロ-バル変数
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

//! 座標クラス
	var Point        = function(_x,_y) {
		this.x = _x || 0;
		this.y = _y || this.x;
		return this;
	}
	Point.prototype  = {
		ToString : function() {
			return "(x="+this.x+",y="+this.y+")";
		},
		Clear : function() {
			this.x = 0;
			this.y = 0;
			return this;
		},
		Set : function(_x,_y) {
			if(_y)
			{
				this.x = _x;
				this.y = _y;
			}else{
				this.x = _x.x;
				this.y = _x.y;
			}
			return this;
		},
		Mul : function( s ) {
			this.x *= s;
			this.y *= s;
			return this;
		},
		Div : function( s ) {
			this.x /= s;
			this.y /= s;
			return this;
		},
		Add : function( p ) {
			this.x += p.x;
			this.y += p.y;
			return this;
		},
		Sub : function( p ) {
			this.x -= p.x;
			this.y -= p.y;
			return this;
		},
		Neg : function() {
			this.x = -this.x;
			this.y = -this.y;
			return this;
		},
		RMul : function( s ) {
			var res = new Point( this.x, this.y );
			return res.Mul( s );
		},
		RDiv : function( s ) {
			var res = new Point( this.x, this.y );
			return res.Div( s );
		},
		RAdd : function( p ) {
			var res = new Point( this.x, this.y );
			return res.Add( p );
		},
		RSub : function( p ) {
			var res = new Point( this.x, this.y );
			return res.Sub( p );
		},
		Lerp : function( inter, p ) {
			this.x = this.x + ( p.x - this.x ) * inter;
			this.y = this.y + ( p.y - this.y ) * inter;
			return this;
		},
		RLerp : function( inter, p ) {
			var res = new Point( this.x, this.y );
			return res.Lerp( inter, p );
		},
		Dot : function( p ) {
			return this.x * p.x + this.y * p.y;
		},
		LengthSq : function( p ) {
			if( p )
			{
				var dx = this.x - p.x;
				var dy = this.y - p.y;
				return dx * dx + dy * dy;
			}else{
				return this.x * this.x + this.y * this.y;
			}
		},
		Length : function( p ) {
			if( p )
			{
				var dx = this.x - p.x;
				var dy = this.y - p.y;
				return Math.sqrt(dx * dx + dy * dy);
			}else{
				return Math.sqrt(this.x * this.x + this.y * this.y);
			}
		},
		Normalize : function() {
			var d = 1.0/this.Length();
			this.x *= d;
			this.y *= d;
			return this;
		},
		NormalizeScale : function(s) {
			var d = s/this.Length();
			this.x *= d;
			this.y *= d;
			return this;
		},
		Refrect : function( n ) {
			var s = 2 * n.Dot( this );
			return this.Sub( n.RMul( s ) );
		},
		Angle : function( p ) {
			var v;
			if(p)
			{
				v = p.RSub( this );
			}else{
				v = this;
			}
			return Math.atan2( v.y, v.x );
		},
		GetAngleVec: function( a, s ) {
			var vec = new Point( Math.cos(a)*s, Math.sin(a)*s );
			return vec;
		},
		RandVec: function( s, o ) {
			this.x = Math.random()*s.x+o.x;
			this.y = Math.random()*s.y+o.y;
			return this;
		}
	}
//! マウス関連
	var Mouse          = function() {
		this.pos       = new Point(-100);
		this.click     = false;
		this.dblclick  = false;
		this.down      = false;
		this.down_pos  = new Point();
		this.up_pos    = new Point();
		this.flick     = false;
		this.flick_vec = new Point();
		this.drag      = false;
		this.count     = 0;
		this.point     = 0;
		this.buf_num   = 16;
		this.stop_cnt  = 0;
		this.xbuf      = new Array(this.buf_num);
		this.ybuf      = new Array(this.buf_num);
		return this;
	}
	Mouse.prototype = {
		ToString : function() {
			var str  = "pos       =" + this.pos.ToString() + "<br>";
				str += "click     =" + this.click          + "<br>";
				str += "dblclick  =" + this.dblclick       + "<br>";
				str += "down      =" + this.down           + "<br>";
				str += "down_pos  =" + this.down_pos.ToString() + "<br>";
				str += "up_pos    =" + this.up_pos.ToString() + "<br>";
				str += "flick     =" + this.flick          + "<br>";
				str += "flick_vec =" + this.flick_vec.ToString() + "<br>";
				str += "drag      =" + this.drag           + "<br>";
				str += "count     =" + this.count          + "<br>";
				str += "point     =" + this.point          + "<br>";
				str += "xbuf      =";
			for( var i = 0 ; i<this.buf_num ; i++ )
			{
				if( i != this.buf_num-1 )
				{
					str += this.xbuf[i]  + ",";
				}else{
					str += this.xbuf[i]  + "<br>";
				}
			}
			str += "ybuf    =";
			for( var i = 0 ; i<this.buf_num ; i++ )
			{
				if( i != this.buf_num-1 )
				{
					str += this.ybuf[i]  + ",";
				}else{
					str += this.ybuf[i]  + "<br>";
				}
			}
			return str;
		},
		FlagClear : function() {
			this.click   = false;
			this.dblclick= false;
			this.flick   = false;
			this.stop_cnt++;
		},
		DragPos : function() {
			var res = new Point( this.pos.x, this.pos.y );
			return res.Sub( this.down_pos );
		}
	}
	global.mouse           = new Mouse();
	function MouseClick(e) {
		global.mouse.click = true;
	}
	function MouseDblclick(e) {
		global.mouse.dblclick = true;
	}
	function MouseDown(e) {
		global.mouse.down    = true;
		global.mouse.down_pos.x = e.clientX-global.appScreen.offsetLeft;
		global.mouse.down_pos.y = e.clientY;
	}
	function MouseMove(e) {
		global.mouse.pos.x = e.clientX-global.appScreen.offsetLeft;
		global.mouse.pos.y = e.clientY;
		if( global.mouse.down )
		{
			global.mouse.drag = true;
			global.mouse.xbuf[ global.mouse.count ] = e.clientX-global.appScreen.offsetLeft;
			global.mouse.ybuf[ global.mouse.count ] = e.clientY;
			global.mouse.point++;
			if( global.mouse.point > global.mouse.buf_num ) global.mouse.point = global.mouse.buf_num;
			global.mouse.count++;
			if( global.mouse.count >= global.mouse.buf_num ) global.mouse.count = 0;
		}
		global.mouse.stop_cnt = 0;
	}
	function MouseUp(e) {
		global.mouse.up_pos.x = e.clientX-global.appScreen.offsetLeft;
		global.mouse.up_pos.y = e.clientY;
		MouseOut(e);
	}

	function MouseOut(e) {
		if( global.mouse.drag )
		{
			if( global.mouse.point > 4 && global.mouse.stop_cnt < 4 )
			{
				var start = global.mouse.count - global.mouse.point;
				var dx = 0;
				var dy = 0;
				var num = global.mouse.buf_num;
				if( start < 0 ) start += num;
				var next  = start + 1;
				for( var i = 0 ; i < global.mouse.point - 1 ; i++ )
				{
					if( next  >= num ) next = 0;
					dx += global.mouse.xbuf[next] - global.mouse.xbuf[start];
					dy += global.mouse.ybuf[next] - global.mouse.ybuf[start];
					next++;
					start++;
					if( start >= num ) start = 0;
				}
				global.mouse.flick_vec.x = dx * 1.3 / global.mouse.point - 1;
				global.mouse.flick_vec.y = dy * 1.3 / global.mouse.point - 1;
				global.mouse.flick   = true;
			}
		}
		global.mouse.down    = false;
		global.mouse.drag    = false;
		global.mouse.point   = 0;
	}

	global.canvas.addEventListener("mousedown", MouseDown, false);
	global.canvas.addEventListener(    "click", MouseClick, false);
	global.canvas.addEventListener( "dblclick", MouseDblclick, false);
	global.canvas.addEventListener(  "mouseup", MouseUp, false);
	global.canvas.addEventListener("mousemove", MouseMove, false);
// 画面外に出た時の処理が必要ならコメントを外す
//	global.canvas.addEventListener( "mouseout", MouseOut, false);

//! 値を0～1にクランプ
	function ClampZeroOne( n ){
		if( n<0 )return 0;
		if( n>1 )return 1;
		return n;
	}

//! 画像読み込み
	function LoadImage( canv, path )
	{
		this.img = new Image();
		this.img.src = path;
		this.canv = canv;
		this.alpha = 1.0;
		this.scale = 1.0;
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
				if( this.scale != 1 )
				{
					iwidth  *= this.scale;
					iheight *= this.scale;
					if( bCenter )
					{
						this.canv.drawImage( this.img, x-iwidth/2, y-iheight/2, iwidth, iheight );
					}else{
						this.canv.drawImage( this.img, x, y, iwidth, iheight );
					}
				}else{
					if( bCenter )
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

//! イメージを中央基点で描画
	function drawImageCenter( img, x, y )
	{
		global.c2d.drawImage( img, x - img.width * 0.5, y - img.height * 0.5 );
	}

	function drawImageCenter( img, x, y, width, height )
	{
		global.c2d.drawImage( img, x - width * 0.5, y - height * 0.5, width, height );
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
		global.mouse.FlagClear();
	})();

//! フレームアップデート関数のセット
	function SetFrameUpdateFunc( func )
	{
		global.frameUpdateFunc = func;
	}
