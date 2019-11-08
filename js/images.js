function debugLog()
{
  
}
function draw() {
    var canvas    = document.getElementById('canvas_e');
    canvas.width  = 270;   // キャンバス要素の幅
     canvas.height = 130;   // キャンバス要素の高さ
  var ctx       = canvas.getContext('2d');
            // 矩形（左）
     ctx.lineWidth = 5;
     ctx.beginPath();
     ctx.strokeRect(20, 15, 100, 100);
     ctx.stroke();
          // 塗りつぶした円
ctx.beginPath();
 ctx.fillStyle = "rgb(0, 255, 0)";
ctx.arc(70, 65, 40, 0, 2*Math.PI, false);
 ctx.fill();
         // 矩形（右）
     ctx.strokeStyle = "rgb(255, 0, 0)";
     ctx.beginPath();
   ctx.strokeRect(150, 15, 100, 100);
    ctx.stroke();

 }
 function ChangeParaToDate() {
    document.getElementById('eid_date').innerHTML = Date();
    console.log("通っている");
    }

    $(function(){
        draw();
    });
