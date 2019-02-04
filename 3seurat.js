function initSeurat() {
    clearAtoms()
    let ww = app.screen.width
    let wh = app.screen.height
    set.AtomX = ww/2
    set.AtomY = wh/2
    if (!resources[set.URL]) {
        loader.add(set.URL).load(setup)
    } else {
        setup()
    }
    function setup() {
        data = makeImage(app,set.URL,set.AtomX,set.AtomY,ww,wh,set.Resize)
        let dataImage=data[0],tx=data[1],ty=data[2],rad = data[3]
        let atomtexture = makeCircle(app.renderer,set.Width,set.Height,[])

        for(var i=0; i<ww; i+=parseInt(set.Width)){
            for(var j=0;j<wh; j+=parseInt(set.Height)){
                if (dataImage.data[((i + j*ww)*4)]>0){
                    var color = [
                        dataImage.data[((i + j*ww)*4)],
                        dataImage.data[((i + j*ww)*4)+1],
                        dataImage.data[((i + j*ww)*4)+2],
                        dataImage.data[((i + j*ww)*4)+3]
                    ]
                    var clr = PIXI.utils.rgb2hex(normalRGBA(color).slice(0,3))
                    atom = new Atom(app,atomtexture,i+tx,j+ty,clr)
                    var mag = magnitude(set.AtomX,set.AtomY,
                                        atom.sprite.x,atom.sprite.y)

                    atom.sprite.alpha = rad/mag
                }
            }
        }
    }
}

function Seurat (app) {

    set = {
        Text: "",
        URL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1920px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg',
        AtomX: app.screen.width/2, AtomY: app.screen.height/2,
        RandomOrigin: false, Resize: 1.3, NumberAtoms: 0,
        Atoms: 50000,Width: 4, Height: 4,ScaleX: 1.5,ScaleY: 1.5, RandomScale:true,
        Nodes: 9, NodeLength: app.screen.width/16, NodeSwitch: false,
        Timer: 0, Gravity: 0,  MouseRadius: 0,MousePower: 0.5,isDown: false,
        Acceleration: 3, LinearDamp: false,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: false,
        RadiusImpulse: true, MoveImpulse: true, InvertImpulse: false,
        AnimateImpulse: false, Step: 0.001,
        Blur: 0, Alpha: 1, RandomAlpha: true, Tint: 0xFFFFFF,RandomTint:false,
        Color1: 0xff8f41,Color2: 0x78aff, Color3: 0xe000ff, TripleTint: true,
        Density: 0, ChanceToBorn: 0.3, Disappear: false,
        Make: function() {initSeurat()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('Seurat')
    folder.add(set, 'URL')
    folder.add(set, 'AtomX',0,app.screen.width).listen()
    folder.add(set, 'AtomY',0,app.screen.height).listen()

    folder.add(set, 'NumberAtoms').listen()
    // folder.add(set, 'Atoms', 0, 50000)

    folder.add(set, 'Width', 2, 64)
    folder.add(set, 'Height', 2, 64)
    folder.add(set, 'ScaleX',0,4)
    folder.add(set, 'ScaleY',0,4)
    folder.add(set, 'RandomScale')

    folder.add(set, 'Acceleration',0,4)
    folder.add(set, 'LinearDamp')
    folder.add(set, 'RadiusImpulse')
    folder.add(set, 'InvertImpulse')
    folder.add(set, 'MoveImpulse')

    folder.add(set, 'ApplyImpulse')
    folder.add(set, 'Make')
    folder.add(set, 'Clear')

    var time = 0.1
    update = function(dt) {
        c = 0

        time -= dt
        for (var id in atoms) {
            c++
            atoms[id].update(dt)
        }
        set.NumberAtoms = c
        if (set.MoveImpulse) {
            if (time < 0) {
                time = 0.1
                set.AtomX = randomInt(0,app.screen.width)
                set.AtomY = randomInt(0,app.screen.height)
            }
        }

        if (set.isDown) {
            set.AtomX = mouse.x
            set.AtomY = mouse.y
        }
    }

    function onmousemove(event) {
        mouse.x= event.clientX;
        mouse.y = event.clientY;
    }

    function onmousedown(event){
        if (event.button == 0) {
            set.isDown = true
        }
    }

    function onmouseup(event){
        if (event.button == 0) {
            set.isDown = false
        }
    }

    function onresize(){
        initSeurat()
    }

    addEvent("resize",onresize)
    addEvent("mousedown",onmousedown)
    addEvent("mouseup",onmouseup)
    addEvent("mousemove",onmousemove)


    initSeurat()
}
