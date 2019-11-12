class Enmey{
    constructor(name,image,scale,x,y,type,time=0){
        this.object=new GameObject(name,image,scale,x,y);
        this.velX=2;
        this.velY=0.5;
        this.type=type;
        this.myTime=time;
    }
// 更新メソッド。
update(info) {
    this._color = 'rgb(0, 0, 0)';
    switch(this.type)
    {
        case 0:
            this.EnemyStraightMove();
            break;
        case 1:  
            this.EnemyWaveMove();     
            break;
    }
    
  }
  EnemyStraightMove()
  {
      this.object.posY+=this.velY;
      if(CanvasCollider(this))
      {
          this.object.isAlive=false;
      }
  }
  EnemyWaveMove()
  {
      this.object.posX*=Math.sin(this.velX);
      this.object.posY+=this.velY;
      if(CanvasCollider(this))
      {
          this.object.isAlive=false;
      }
  }
}


