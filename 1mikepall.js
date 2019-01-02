function initMikePall() {
    clearAtoms()

    var txt = set.Text
    if (set.EditText == true){
        clearAtoms()
        // txt = set.Text.slice(-1)
    } else {
        clearAtoms()
    }

    let ww = app.screen.width
    let wh = app.screen.height
    set.TextX = ww/2
    set.TextY = wh/2

    let data = makeText(app,txt,set.TextX,set.TextY,ww,wh,set.FontSize)
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
            if(dataImage.data[((i + j*ww)*4) + 3] > set.Density){

                if (Math.random()<set.ChanceToBorn) {
                    var clr = set.Tint
                    if (set.RandomTint==true) {
                        clr = randomHEXI()
                    }
                    new Atom(app,atomtexture,i+tx,j+ty,clr);
                }
            }
        }
    }
}

function applyImpulse() {
    for (var i in atoms) {
        atoms[i].randomAccel()
    }
}

function MikePall (app) {
    set = {
        Text: "Mike Pall \nis a \nRobot \nfrom the Future",EditText: false,
        TextX: app.screen.width/2, TextY: app.screen.height/2,FontSize: 96,
        RandomOrigin: true,
        Atoms: 50000, Width: 8, Height: 8, ScaleX: 1, ScaleY: 1,
        Timer: 200, Gravity: 0,  MouseRadius: 32, Acceleration: 256,
        ApplyImpulse: function() {applyImpulse()}, AutoImpulse: false,
        Blur: 0, Alpha: 1, RandomAlpha: true, Tint: 0xFFFFFF,RandomTint: true,
        Density: 0, ChanceToBorn: 0.5, Disappear: false,
        Make: function() {initMikePall()},
        Clear: function() {clearAtoms()}
    }

    folder = ui.addFolder('MikePall')
    folder.add(set, 'Text').onChange(function(value) {initMikePall()})
    folder.add(set, 'EditText')
    folder.add(set, 'TextX',0, app.screen.width)
    folder.add(set, 'TextY',0, app.screen.height)
    folder.add(set, 'FontSize',64,128)
    folder.add(set, 'RandomOrigin')
    folder.add(set, 'Atoms', 0, 50000).listen()

    folder.add(set, 'Width', 2, 64)
    folder.add(set, 'Height', 2, 64)
    folder.add(set, 'ScaleX',0,4)
    folder.add(set, 'ScaleY',0,4)

    folder.add(set, 'Timer', 0, 1000).listen()
    folder.add(set, 'Gravity', 0, 10)
    folder.add(set, 'MouseRadius',1,128)
    folder.add(set, 'Acceleration',0,128)
    folder.add(set, 'ApplyImpulse')
    folder.add(set, 'AutoImpulse')

    folder.add(set, 'Blur',0,64)
    folder.add(set, 'Alpha', 0, 1)
    folder.add(set, 'RandomAlpha')
    folder.addColor(set, 'Tint')
    folder.add(set, 'RandomTint')

    folder.add(set, 'Disappear')
    folder.add(set, 'Density', 0, 255)
    folder.add(set, 'ChanceToBorn', 0, 1)
    folder.add(set, 'Make')
    folder.add(set, 'Clear')

    update = function(dt) {
        c = 0
        for (var i in atoms) {
            c++
            atoms[i].update(dt)
        }
        set.Atoms = c
        if (set.Timer>0) {
            set.Timer--
        }
    }

    initMikePall()

    function onMouseClick(){
        set.MouseRadius++
    }

    function onMouseMove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    window.addEventListener("resize", initMikePall);
    window.addEventListener("click", onMouseClick);
    window.addEventListener("mousemove", onMouseMove);
}

