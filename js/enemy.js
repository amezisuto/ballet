class Enmey{
    constructor(name,image,scale,x,y,velx,vely,type,hp,time,interval,bullettype,circlesize=1){
        this.object=new GameObject(name,image,scale,x,y);
        this.velX=velx;
        this.velY=vely;
        this.type=type;
        this.myTime=time;
        this.count=0;
        this.circlesize =circlesize;
        this.HP = hp;
        this.interval = interval;
        this.bulletType=bullettype;
        this.bulletCount=0;
    }
    get myhp()
    {
        return this.HP;
    }
    Damage(bulletpaw)
    {
        console.log("確認"+bulletpaw);
        this.HP -= bulletpaw;
    }
// 更新メソッド。
update(info) {
    if(!this.object.isHide)
    {
        this.bulletCount++;
        this.count++;
        switch(this.type)
        {
            case "Straight":
                this.EnemyStraightMove();
                break;
            case "Wave":  
                this.EnemyWaveMove();     
                break;
            case "Circle":  
                this.EnemyCircleMove();     
                break;
        }
        if(CanvasCollider(this)&&!this.object.isHide)
        {
            this.object.isAlive=false;
        }
    }
  }
  slowAlert() {
    console.log("確認");
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
      this.object.posX+=Math.sin(Math.PI*this.count/40.0)*2;
      this.object.posY+=this.velY;

  }
  EnemyCircleMove()
  {
     var maxcount=300;
    if(this.count<maxcount)
    this.object.posY+=this.velY;
      if(this.count>=maxcount){
        this.object.posX+=Math.sin((Math.PI*this.count-40.0)/140)*this.circlesize;
        this.object.posY+=Math.sin((Math.PI*this.count+30.0)/140)*this.circlesize;
        }
    }
}







