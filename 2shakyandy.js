function initShakyAndy() {
    clearAtoms()
    let ww = app.screen.width
    let wh = app.screen.height
    set.ImageX = ww/2
    set.ImageY = wh/2

    if (!resources[AW]) {
        loader.add(AW).add(MY).add(KC).add(JH).add(DV).load(setup)
    } else {
        setup()
    }
    function setup() {
        data = makeImage(app,set.URL,set.ImageX,set.ImageY,ww,wh,set.Resize,
                         [colorFilter])
        let dataImage=data[0],tx=data[1],ty=data[2]

        let atomtexture = makeCircle(app.renderer,set.Width,set.Height,[])
        for(var i=0; i<ww; i++){
            for(var j=0;j<wh; j++){
                if (dataImage.data[((i + j*ww)*4)]){
                    if (Math.random()<set.ChanceToBorn) {
                        var clr = set.Tint
                        if (set.RandomTint==true) {
                            clr = randomHexi()
                        }
                        new Atom(app,atomtexture,i+tx,j+ty,clr);
                    }
                }
            }
        }
    }
}

var AW = 'https://bloximages.newyork1.vip.townnews.com/wisconsingazette.com/content/tncms/assets/v3/editorial/8/08/80862b88-9b47-11e8-868c-97ebae208fbd/5b6b4f931a453.image.jpg'
var MY = 'https://lh5.googleusercontent.com/proxy/vMZSKcv9Nn1rOflLPfkzSWQbE1NdQVYIM3fbim2lWScpDYCaw6oK8yzj33FkA70uUl5tECTQc492JFMnGMtyEtEmIv1Tv5GZq3zyewmMa-sH8U42yPhF9Zg89fyW6gAU0XXd39qEV2Uv2g=s0'

var KC = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwEZ4D9ar8IQKMYXrGfFYJ9mO8qCskgnoovyRmI_lfZLLQIq0'

var JH = 'https://i.pinimg.com/originals/e2/6b/bb/e26bbb18503340beaa026f4ef753a00f.png'

var DV = 'https://i.pinimg.com/originals/a5/85/80/a58580a691acb1bc7b6d441d6eb41a1c.jpg'

function ShakyAndy (app) {
    set = {URL: AW, ImageX: app.screen.width/2, ImageY: app.screen.height/2,
        RandomOrigin: false, Resize: 1.4,
        Atoms: 50000,Width: 2,Height: 2,ScaleX: 0.7,ScaleY: 0.7,
        RandomScale:true,
        Timer: 0,Gravity: 0, Acceleration: 0.05, LinearDamp: true,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: true,
        AnimateImpulse: true, Step: 0.001,
        Alpha: 1, RandomAlpha: false, Tint: 0xFFFFFF, RandomTint: false,
        TripleTint: false,
        Disappear: false,

        ChanceToBorn: 0.3,
        Make: function() {initShakyAndy()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('ShakyAndy')
    folder.add(set,'URL',{AndyWarhol:AW,MasterYoda:MY,
        KurtCobain:KC,JimiHendrix: JH, DarthVader: DV}).onChange(
                                        function() {initShakyAndy()})
    folder.add(set, 'RandomOrigin')
    folder.add(set, 'Resize',0.5, 2)
    folder.add(set, 'ImageX',0, app.screen.width)
    folder.add(set, 'ImageY',0, app.screen.height)

    folder.add(set, 'Atoms', 0, 50000).listen()
    folder.add(set, 'Width', 2, 64)
    folder.add(set, 'Height', 2, 64)
    folder.add(set, 'ScaleX',0,4)
    folder.add(set, 'ScaleY',0,4)

    folder.add(set, 'Gravity', 0, 10)
    folder.add(set, 'Acceleration',0,128).listen()
    folder.add(set, 'ApplyImpulse')
    folder.add(set, 'AutoImpulse')
    folder.add(set, 'AnimateImpulse')

    folder.add(set, 'Alpha', 0, 1)
    folder.add(set, 'RandomAlpha')
    folder.addColor(set, 'Tint').listen()

    folder.add(set, 'RandomTint')
    folder.add(set, 'Disappear')
    folder.add(set, 'ChanceToBorn', 0, 1)
    folder.add(set, 'Make')
    folder.add(set, 'Clear')

    update = function(dt) {
        c = 0
        for (var id in atoms) {
            c++
            atoms[id].update(dt)
        }
        set.Atoms = c

        if (set.AnimateImpulse==true) {
            set.Acceleration += set.Step
            if (set.Acceleration < 0) {
                set.Acceleration = 0
                set.Step = -set.Step
            }
            if (set.Acceleration > 1) {
                set.Acceleration = 1
                set.Step = -set.Step
            }
        }
    }

    function onKeyDown(event) {
        if (event.key==' ') {
            set.ApplyImpulse()
        }
    }

    function onResize(){
        initShakyAndy()
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("keydown", onKeyDown)

    initShakyAndy()
}

