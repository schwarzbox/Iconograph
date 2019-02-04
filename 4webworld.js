
function addWeb() {
    let ww = app.screen.width
    let wh = app.screen.height

    var blur = Math.cos(Math.random())
    blurFilter.blur = blur * set.Blur
    let atomtexture = makeCircle(app.renderer,set.Width,set.Height,
                                 [blurFilter])

    for (var i = 0; i < set.Atoms; i++) {
        var clr = set.Tint
        if (set.RandomTint==true) {
            clr = randomHexi()
        }
        if (set.TripleTint==true) {
            clr = [set.Color1,
                    set.Color2,
                        set.Color3][Math.floor(Math.random()*3)]
        }
        new Atom(app,atomtexture,set.AtomX,set.AtomY,clr);
    }
    // create nodes
    addNodes()
}

function initWebWorld() {
    clearAtoms()
    addWeb()
}


function addNewWeb(event) {
    let setorigin = set.RandomOrigin
    set.RandomOrigin = false
    set.AtomX = event.clientX
    set.AtomY = event.clientY
    addWeb()
    set.RandomOrigin = setorigin
}

function addNodes() {
    for (var id in atoms) {
        for (var nd in atoms) {
            if (id!=nd) {
                let x = atoms[id].sprite.position.x
                let y = atoms[id].sprite.position.y
                let destx = atoms[nd].sprite.position.x
                let desty = atoms[nd].sprite.position.y
                let dist = magnitude(x,y,destx,desty)
                if (atoms[id].nodesEmpty) {
                    if (dist < set.NodeLength) {
                        new Node(atoms[id],atoms[nd],1)
                    }
                }
                let countid = atoms[id].nodesCount
                let countnd = atoms[nd].nodesCount

                if (countid < countnd) {
                    if (dist < set.NodeLength) {
                        for (var i in atoms[nd].nodes) {
                            atoms[nd].nodes[i].removeNode()
                        }
                        new Node(atoms[id],atoms[nd],1)
                    }
                }
            }
        }

    }
}

function WebWorld (app) {
    set = {AtomX: app.screen.width/2, AtomY: app.screen.height/2,
        RandomOrigin: false,
        NumberAtoms: 0,
        Atoms: 32, Width: 2,Height: 2, ScaleX: 1, ScaleY: 1,
        RandomScale: false, Nodes: 7, NodeLength: app.screen.width/16,
        NodeSwitch: false,
        Timer: 200, Gravity: 0, MouseRadius: 64, MousePower: 0.5,isDown: false,
        Acceleration: 8, LinearDamp: true,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: true,
        Blur: 0, Alpha: 1, RandomAlpha: false, Tint: 0xFFFFFF,RandomTint:true,
        Color1: 0xff8f41,Color2: 0x78aff, Color3: 0xe000ff, TripleTint: false,
        Density: 0, ChanceToBorn: 0.3, Disappear: false,
        Make: function() {initWebWorld()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('WebWorld')
    folder.add(set, 'AtomX', 0, app.screen.width).listen()
    folder.add(set, 'AtomY', 0, app.screen.height).listen()
    folder.add(set, 'RandomOrigin').listen()
    folder.add(set, 'NumberAtoms').listen()
    folder.add(set, 'Atoms', 0, 64)
    folder.add(set, 'Width', 2, 8)
    folder.add(set, 'Height', 2, 8)
    folder.add(set, 'Nodes', 0, 15)
    folder.add(set, 'NodeLength',1, app.screen.width).listen()
    folder.add(set, 'NodeSwitch')
    folder.add(set, 'Acceleration',0,128).listen()
    folder.add(set, 'AutoImpulse')
    folder.add(set, 'LinearDamp')

    folder.addColor(set, 'Tint')
    folder.add(set,'RandomTint').listen().onChange(
                                        function() {set['TripleTint']=false})
    let tin3 = folder.addFolder('TripleTint')
    tin3.addColor(set,'Color1')
    tin3.addColor(set,'Color2')
    tin3.addColor(set,'Color3')
    tin3.add(set,'TripleTint').listen().onChange(
                                    function() {set['RandomTint']=false})
    folder.add(set, 'Make')
    folder.add(set, 'Clear')


    update = function(dt) {
        c = 0
        for (var id in atoms) {
            c++
            atoms[id].update(dt)
        }
        addNodes()
        set.NumberAtoms = c
    }

    function onresize(){
        set.AtomX=app.screen.width/2
        set.AtomY=app.screen.height/2
    }

    function ondblclick(event){
        addNewWeb(event)
    }

    function onmousemove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    function onkeydown(event) {
        if (event.key==' ') {
            initWebWorld()
        }
    }

    addEvent("resize",onresize)
    addEvent("dblclick",ondblclick)
    addEvent("mousemove",onmousemove)
    addEvent("keydown",onkeydown)


    initWebWorld()
}
