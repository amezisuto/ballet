class Player{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);
        //this.funcP=new 
        this.mo=Move;
        this.keyflag=[
            false,
            false,
            false,
            false,
            false
        ]
    }
    get myName()
    {
        return this.object.name;
    }
    get myImage()
    {
        return this.image.src;
    }
}
var bullet=[new Bullet("bullet","image/bullet.png",1,global.canvas.width/2,global.canvas.height / 2)];
var count =0;
function Move()
{
    // keydown
    document.addEventListener('keydown', (event) => {
        var keyName = event.key;
       var keyCode=event.keyCode;
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
       var keyCode=event.keyCode;
       if(keyName=='x')
       {
        this.keyflag[4]=true;
          
       }
        });  // keyUp
      document.addEventListener('keyup', (event) => {
        var keyName = event.key;
       var keyCode=event.keyCode;
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
        this.object.posX-=1;
      }
      if( this.keyflag[1]==true)
      {
        this.object.posX+=1;
      }
      if( this.keyflag[2]==true)
      {
        this.object.posY-=1;
      }
      if( this.keyflag[3]==true)
      {
        this.object.posY+=1;
      }
      if(this.keyflag[4]==true)
      {
        count--
        if(count<0)
        {
         bullet.push(new Bullet("bullet","image/bullet.png",1,this.object.posX,this.object.posY));
         bullet[bullet.length-1].object.isAlive=true;
         count=15;
        }
      }
      for(i=0;i<bullet.length;i++)
      {
        if(bullet[i].object.isAlive)
        {
          bullet[i].object.myPosY=bullet[i].object.posY-1;
          bullet[i].object.image.Draw(bullet[i].object.posX,bullet[i].object.posY,true);
          if(bullet[i].object.posY + 16<0)
          {
              bullet.splice(i,1);
              console.log("消す");
          }
        }
      }
  
}

