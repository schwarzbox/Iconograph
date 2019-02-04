function initMikePall() {
    clearAtoms()

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
    // for (let i = 0; i < set.Atoms; i++) {
    //     atoms.push(new Atom(app,tx,1,1));
    // }
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
}

function MikePall (app) {
    set = {
        Text: "Mike Pall \nis a \nRobot \nfrom the Future",
        AtomX: app.screen.width/2, AtomY: app.screen.height/2,FontSize: 96,
        AtomX: app.screen.width/2, AtomY: app.screen.height/2,
        RandomOrigin: true, Resize: 1.4, NumberAtoms: 0,
        Atoms: 50000,Width: 4, Height: 4,ScaleX: 1,ScaleY: 1,RandomScale:true,
        Nodes: 9, NodeLength: app.screen.width/16, NodeSwitch: false,
        Timer: 200, Gravity: 0,  MouseRadius: 32,MousePower: 0.5,isDown: false,
        Acceleration: 256, LinearDamp: true,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: false,
        AnimateImpulse: true, Step: 0.001,
        RadiusImpulse: false, MoveImpulse: false, InvertImpulse: false,
        Blur: 0, Alpha: 1, RandomAlpha: false, Tint: 0xFFFFFF,RandomTint:false,
        Color1: 0xff8f41,Color2: 0x78aff, Color3: 0xe000ff, TripleTint: true,
        Density: 0, ChanceToBorn: 0.3, Disappear: false,
        Make: function() {initMikePall()},
        Clear: function() {clearAtoms()}
    }

    let folder = ui.addFolder('MikePall')
    folder.add(set, 'Text',[
               "Mike Pall \nis a \nRobot \nfrom the Future",
               "Small is beautiful",
               "Ground Control\nto \nMajor Tom"
            ]).onChange(function() {initMikePall()})
    folder.add(set, 'AtomX',0, app.screen.width)
    folder.add(set, 'AtomY',0, app.screen.height)
    folder.add(set, 'FontSize',64,128)
    folder.add(set, 'RandomOrigin')
    folder.add(set, 'NumberAtoms').listen()
    // folder.add(set, 'Atoms', 0, 50000)

    folder.add(set, 'Width', 2, 64)
    folder.add(set, 'Height', 2, 64)
    folder.add(set, 'ScaleX',0,4)
    folder.add(set, 'ScaleY',0,4)

    folder.add(set, 'Timer', 0, 1000).listen()
    folder.add(set, 'Gravity', 0, 10)
    folder.add(set, 'MouseRadius',1,128).listen()
    folder.add(set, 'MousePower',0,16).listen()

    folder.add(set, 'Acceleration',0,128)
    folder.add(set, 'ApplyImpulse')
    folder.add(set, 'AutoImpulse')

    folder.add(set, 'Blur',0,64)
    folder.add(set, 'Alpha', 0, 1)
    folder.add(set, 'RandomAlpha')
    folder.addColor(set, 'Tint')
    folder.add(set,'RandomTint').listen().onChange(
                                        function() {set['TripleTint']=false})
    let tin3 = folder.addFolder('TripleTint')
    tin3.addColor(set,'Color1')
    tin3.addColor(set,'Color2')
    tin3.addColor(set,'Color3')
    tin3.add(set,'TripleTint').listen().onChange(
                                    function() {set['RandomTint']=false})

    folder.add(set, 'Disappear')
    folder.add(set, 'Density', 0, 255)
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
        if (set.Timer>0) {
            set.Timer--
        }
        if (set.isDown==true) {
            set.MouseRadius-=1
        }
        if (set.MouseRadius<0) {
            set.MouseRadius+=128
        }
    }

    function onresize(){
        initMikePall()
    }

    function onkeydown(event) {
        console.log(event)
        if (event.key==' ') {
            set.ApplyImpulse()
        }
    }

    function onclick(event){
        set.MouseRadius++
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

    addEvent("resize",onresize)
    addEvent("keydown",onkeydown)
    addEvent("click", onclick)
    addEvent("dblclick",ondblclick)
    addEvent("mousedown",onmousedown)
    addEvent("mouseup",onmouseup)
    addEvent("mousemove", onmousemove)
    addEvent("mouseover", onmouseover)

    initMikePall()
}

