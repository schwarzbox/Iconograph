
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomHexi() {
    var hex = parseInt(Math.random()*0xffffff,16)
    return hex
}

function addHexi(hexi,rdt,gdt,bdt) {
    // var hexs = hexi.toString(16)
    hexi = parseInt(hexi)
    let b = hexi & 255
    let g = (hexi >> 8) & 255
    let r = (hexi >> 16) & 255

    hexi=((r+rdt) * 65536) + ((g+gdt)*256) + (b+bdt)

    return hexi
}

function makeCircle(renderer, wid, hei,filters){
    let gfx = new PIXI.Graphics();
    let texture = RenderTexture.create(wid, hei);
    gfx.beginFill(0xFFFFFF);
    gfx.filters = filters
    gfx.lineStyle(0);
    gfx.drawCircle(wid/2, hei/2, wid/2);
    gfx.endFill();

    renderer.render(gfx, texture);
    return texture
}

function makeText(app,txt,x,y,ww,wh,size) {
    var text = new PIXI.Text(txt, {
            fontWeight: 'bold',
            fontSize: size,
            fontFamily: 'Arial',
            fill: '#000000',
            align: 'center'
        }
    )
    tx = x - text.width/2
    ty = y - text.height/2

    app.stage.addChild(text);

    var tmp = app.renderer.plugins.extract.canvas(app.stage)
    var data = tmp.getContext('2d').getImageData(0,0,ww,wh)
    app.stage.removeChild(text)
    return [data,tx,ty]
}

function makeImage(app,url,x,y,ww,wh,resize,filters,invert) {
    var img = new PIXI.Sprite.fromImage(url)
    if (resize>0) {
        let scx = ww/img.width
        let scy = wh/img.height
        let scale = scx < scy ? scx : scy
        img.scale.set(scale/resize,scale/resize)
    }
    img.filters = filters
    if (invert==true) {
        img.filters[0].negative(false)
    }
    tx = x - img.width/2
    ty = y - img.height/2
    app.stage.addChild(img);

    var tmp = app.renderer.plugins.extract.canvas(app.stage)
    var data = tmp.getContext('2d').getImageData(0,0,ww,wh)
    app.stage.removeChild(img)
    return [data,tx,ty]
}

