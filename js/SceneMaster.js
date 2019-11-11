function Scene()
{
    this.sequence       = title_seq;
}
var scene =new Scene;
var enemy=new Enmey('namae',"image/nabe01.png",0.5,global.canvas.width/2,global.canvas.height / 2);
var player =new Player("player","image/texture00.png",0.5,global.canvas.width/2,global.canvas.height / 2);
var count=0.0;
function title_seq()
	{
          enemy.object.image.Draw(enemy.object.posX,enemy.object.posY,true);
          player.mo();
          player.object.image.Draw(player.object.posX,player.object.posY,true);
          if(Collider(player,enemy))
          {
              console.log("hit");
          }
    }
    

  //! フレームアップデートメソッド
	SetFrameUpdateFunc( frameUpdate );
	function frameUpdate()
	{
		global.c2d.clearRect( 0, 0, global.canvas.width, global.canvas.height );
		scene.sequence();
    }
