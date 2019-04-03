function initShakyAndy() {
    clearAtoms()
    let ww = app.screen.width
    let wh = app.screen.height
    set.AtomX = ww/2
    set.AtomY = wh/2

    if (!resources[AW]) {
        loader.add(AW).add(MY).load(setup)

    } else {
        setup()
    }
    function setup() {
        data = makeImage(app,set.URL,set.AtomX,set.AtomY,ww,wh,set.Resize,
                         [colorFilter])
        let dataImage=data[0],tx=data[1],ty=data[2]

        let atomtexture = makeCircle(app.renderer,set.Width,set.Height,[])
        for(var i=0; i<ww; i++){
            for(var j=0;j<wh; j++){
                if (dataImage.data[((i + j*ww)*4)+3]){
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

function ShakyAndy (app) {
    set = {URL: AW, AtomX: app.screen.width/2, AtomY: app.screen.height/2,
        RandomOrigin: false, Resize: 1.4, NumberAtoms: 0,
        Atoms: 50000,Width: 2,Height: 2,ScaleX: 0.7,ScaleY: 0.7,
        RandomScale:true,
        Nodes: 9, NodeLength: app.screen.width/16, NodeSwitch: false,
        Timer: 0,Gravity: 0,
        MouseReact: 1,
        Acceleration: 0.05, LinearDamp: true,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: true,
        AnimateImpulse: true, Step: 0.001,
        ImpulseRadius: 0, BulbImpulse: false,
        AlphaRadius: 0, Alpha: 1, RandomAlpha: false,
        Tint: 0xFFFFFF, RandomTint: false, TripleTint: false,
        Disappear: false,
        ChanceToBorn: 0.3,
        Make: function() {initShakyAndy()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('ShakyAndy')
    folder.add(set,'URL',{AndyWarhol:AW,MasterYoda:MY}).onChange(
                                        function() {initShakyAndy()})
    folder.add(set, 'RandomOrigin')
    folder.add(set, 'Resize',0.5, 2)
    folder.add(set, 'NumberAtoms').listen()
    // folder.add(set, 'Atoms', 0, 50000)
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
        set.NumberAtoms = c

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

    function onkeydown(event) {
        if (event.key==' ') {
            set.ApplyImpulse()
        }
    }

    function onresize(){
        initShakyAndy()
    }

    addEvent("resize",onresize)
    addEvent("keydown",onkeydown)

    initShakyAndy()
}

