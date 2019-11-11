// 当たり判定の基底クラス。
function Collider(objectA,objectB)
{
    console.log(objectA.object.image.src);
  if(objectA.object.posX-objectA.object.image.wight/2 < objectB.object.posX + objectB.object.image.wight/2
    &&objectA.object.posX+objectA.object.image.wight/2 > objectB.object.posX - objectB.object.image.wight/2
    &&objectA.object.posY-objectA.object.image.height/2 < objectB.object.posY+objectB.object.image.height/2
    &&objectA.object.posY+objectA.object.image.height/2 > objectB.object.posY-objectB.object.image.height/2)
    {
        return true;
    }
    return false;
}