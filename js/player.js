class Player{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);
        //this.funcP=new 
        this.velX=3;
        this.keyflag=[
            false,
            false,
            false,
            false,
            false
        ]
    }
  // 更新メソッド。
  update(info) {
    this._color = 'rgb(0, 0, 0)';
    this.Move();
  }
  Move()
{
    // keydown
    document.addEventListener('keydown', (event) => {
        var keyName = event.key;
    if(keyName=='ArrowLeft')
    {
         this.keyflag[0]=true;

    }
    else if(keyName=='ArrowRight')
    {
      this.keyflag[1]=true;
        
    }
    if(keyName=='ArrowUp')
    {
      this.keyflag[2]=true;
     
    }
    else if(keyName=='ArrowDown')
    {
      this.keyflag[3]=true;
        
    }
   
      });
      document.addEventListener('keypress', (event) => {
        var keyName = event.key;
       if(keyName=='x')
       {
        this.keyflag[4]=true;
          
       }
        });  // keyUp
      document.addEventListener('keyup', (event) => {
        var keyName = event.key;
    if(keyName=='ArrowLeft')
    {
      this.keyflag[0]=false;

    }
    else if(keyName=='ArrowRight')
    {
      this.keyflag[1]=false;
        
    }
    if(keyName=='ArrowUp')
    {
      this.keyflag[2]=false;
     
    }
    else if(keyName=='ArrowDown')
    {
      this.keyflag[3]=false;
    }
    if(keyName=='x')
    {
      this.keyflag[4]=false;
    }
      });
      //
      if( this.keyflag[0]==true)
      {
        this.object.posX-=this.velX;
      }
      if( this.keyflag[1]==true)
      {
        this.object.posX+=this.velX;
      }
      if( this.keyflag[2]==true)
      {
        this.object.posY-=this.velX;
      }
      if( this.keyflag[3]==true)
      {
        this.object.posY+=this.velX;
      }
      if(this.keyflag[4]==true)
      {

      }
     // BulletMove(bullet);
}
get GetBullet()
{
  return this.bullet;
}
}




