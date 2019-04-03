
function addFur() {
    let ww = app.screen.width
    let wh = app.screen.height
    set.AtomX = ww/2
    set.AtomY = wh/2

    let data = makeText(app,set.Text,set.AtomX,set.AtomY,ww,wh,set.FontSize)
    let dataImage=data[0],tx=data[1],ty=data[2]

    var blur = Math.cos(Math.random())
    blurFilter.blur = blur * set.Blur
    let atomtexture = makeCircle(app.renderer,set.Width,set.Height,
                                 [blurFilter])

    for(var i=0; i<ww; i++){
        for(var j=0;j<wh; j++){
            // get alpha
            if(dataImage.data[((i + j*ww)*4)+3]){
                if (Math.random()<set.ChanceToBorn) {
                    var clr = set.Tint
                    if (set.RandomTint==true) {
                        clr = randomHexi()
                    }
                    if (set.TripleTint==true) {
                        clr = [set.Color1,
                                set.Color2,
                                    set.Color3][Math.floor(Math.random()*3)]
                    }
                    new Atom(app,atomtexture,i+tx,j+ty,clr);
                }
            }
        }
    }
    for (var id in atoms) {
        atoms[id].sprite.position.y=atoms[id].sprite.position.y+set.NodeLength*2
        new Atom(app,atomtexture,
                 atoms[id].sprite.position.x,
                 atoms[id].sprite.position.y-set.NodeLength*2,
                 clr,"fur");
        let newID = ID-1
        new Node(atoms[id],atoms[newID],1)
    }
}

function initFur() {
    clearAtoms()
    addFur()
}

function Fur (app) {
    set = {Text: "🐈",
        AtomX: app.screen.width/2, AtomY: app.screen.height/2, FontSize: 256,
        RandomOrigin: false,
        NumberAtoms: 0,
        Atoms: 1000, Width: 1,Height: 1, ScaleX: 1, ScaleY: 1,
        RandomScale: false, Nodes: 4, NodeLength: app.screen.width/16,
        NodeSwitch: false,
        Timer: 32, Gravity: 0,
        MouseReact: false, MouseRadius: 128, MousePower: 0.1,isDown: false,
        Acceleration: 0.5, LinearDamp: true,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: true,
        ImpulseRadius: 0, BulbImpulse: false,
        Blur: 0, AlphaRadius: 0, Alpha: 1, RandomAlpha: false,
        Tint: 0xFFFFFF, RandomTint:false,
        Color1: 0xff8f41,Color2: 0x78aff, Color3: 0xe000ff, TripleTint: false,
        Density: 0, ChanceToBorn: 0.015, Disappear: false,
        Make: function() {initFur()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('Fur')
    folder.add(set, 'Text')
    folder.add(set, 'RandomOrigin').listen()
    folder.add(set, 'NumberAtoms').listen()
    folder.add(set, 'ScaleX', 1, 2)
    folder.add(set, 'ScaleY', 1, 2)
    folder.add(set, 'NodeLength',1, app.screen.width/2).listen()
    folder.add(set, 'Acceleration',0,128).listen()
    folder.add(set, 'AutoImpulse')
    folder.add(set, 'LinearDamp')

    folder.addColor(set, 'Tint')

    folder.add(set, 'Make')
    folder.add(set, 'Clear')


    update = function(dt) {
        c = 0
        for (var id in atoms) {
            c++
            set.MouseReact = 0
            if (atoms[id].tag=="fur") {
                (set.isDown) ? set.MouseReact = -1 : set.MouseReact = 1
            }
            atoms[id].update(dt)
        }
        set.NumberAtoms = c
        if (set.Timer>0) {
            set.Timer--
        }
    }

    function onresize(){
        initFur()
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

    function onmousemove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    addEvent("mousedown",onmousedown)
    addEvent("mouseup",onmouseup)
    addEvent("resize",onresize)
    addEvent("mousemove",onmousemove)


    initFur()
}
