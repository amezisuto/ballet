  // 敵のデータ管理
  var data=[
    {
        "name": "enemy",
        "image":"image/texture01.png",
        "scale": 0.5,
        "posX": 100,
        "posY": 100,
        "velX": 2,
        "velY": 0.5,
        "type":  "Straight",
        "time": 1,
        "HP"  : 1,
        "interval":2,
        "bulletType":"Straight",
    },
    {
        "name": "enemy",
        "image":"image/texture00.png",
        "scale": 0.5,
        "posX": 100,//Math.floor( Math.random() * global.canvas.width ),
        "posY": 100,//Math.floor( Math.random() * global.canvas.height ),
        "velX": 2,
        "velY": 0.5,
        "type": "Wave",
        "time": 1,
        "HP"  : 1,
        "interval":1,
        "bulletType":"Circle",
    },
    {
        "name": "enemy",
        "image":"image/texture02.png",
        "scale": 0.5,
        "posX": 240,
        "posY": 0,
        "velX": 2,
        "velY": 1,
        "type":  "Circle",
        "time": 1,
        "HP"  : 10,
        "interval":4,
        "bulletType":"Straight",
    }
  ]
  function GetEnemyData()
  {
    return this.data;
  }