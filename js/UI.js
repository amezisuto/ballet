// UIクラス
class UI{
    constructor(name,image,scale,x,y){
        this.object=new GameObject(name,image,scale,x,y);     // オブジェクト生成
        this.count=30;          // 点滅用
    }
    // 点滅処理
    Flashing()
    {
        this.count++;
        if(this.count>30) // カウントが30超えるたびhideを変える
        {
            this.object.isHide=!this.object.isHide;
            this.count=0;
        }
    }
}


