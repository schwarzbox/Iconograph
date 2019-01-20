
function Atom(app,texture,x,y,clr) {
    this.sprite = new Sprite(texture)
    this.sprite.origin = {x: x, y: y}
    this.sprite.x = x
    this.sprite.y = y
    if (set.RandomOrigin == true) {
        this.sprite.x = randomInt(0,
                        app.screen.width - this.sprite.width);
        this.sprite.y = randomInt(0,
                        app.screen.height - this.sprite.height);
    }

    this.sprite.vx = 0
    this.sprite.vy = 0
    this.randomAccel()
    this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2)

    let scalex = set.ScaleX
    let scaley = set.SceleY
    if (set.RandomScale) {
        let scalex = Math.random() * set.ScaleX
        let scaley = Math.random() * set.ScaleX
    }
    this.sprite.scale.set(scalex,scaley)

    this.sprite.tint = clr
    if (set.RandomAlpha==true) {
        this.sprite.alpha = Math.random()
    }
    app.stage.addChild(this.sprite)

    this.nodes = []
    this.nodeID = 0
    this.nodesEmpty = true
    this.nodesCount = 0

    this.ID = ID
    ID++
    atoms[this.ID] = this
}

Atom.prototype.removeAtom = function() {
    for (var i in this.nodes) {
        this.nodes[i].removeNode()
    }
    app.stage.removeChild(this.sprite);
    this.sprite.destroy()
    delete atoms[this.ID]
}

Atom.prototype.linearDamp = function(dt) {
    this.sprite.vx = this.sprite.vx -this.sprite.vx*dt
    this.sprite.vy = this.sprite.vy -this.sprite.vy*dt
}

Atom.prototype.randomAccel = function() {
    this.sprite.acx = randomInt(-set.Acceleration,set.Acceleration)
    this.sprite.acy = randomInt(-set.Acceleration,set.Acceleration)
}

Atom.prototype.update = function(dt) {
    if (set.RandomTint==false && set.TripleTint==false) {
        this.sprite.tint = set.Tint
    }
    if (set.RandomAlpha==false) {
        this.sprite.alpha = set.Alpha
    }
    if (set.AutoImpulse==true) {
        this.randomAccel()
    }
    if (set.Disappear==true) {
        this.sprite.alpha -= dt/10
        this.sprite.scale.set(
                this.sprite.scale.x - dt/10*this.sprite.scale.x,
                this.sprite.scale.y - dt/10*this.sprite.scale.x)
    }

    if (set.Gravity) {
        this.sprite.acy += set.Gravity
    }
    if (set.Timer<=0) {
        this.sprite.acx += (this.sprite.origin.x - this.sprite.x)*dt
        this.sprite.acy += (this.sprite.origin.y - this.sprite.y)*dt
    } else {

    }
    this.sprite.vx += this.sprite.acx*dt
    this.sprite.vy += this.sprite.acy*dt
    this.sprite.x += this.sprite.vx
    this.sprite.y += this.sprite.vy

    var a = this.sprite.x - mouse.x;
    var b = this.sprite.y - mouse.y;

    var distance = Math.sqrt(a*a + b*b);
    if(distance<set.MouseRadius){
        this.sprite.acx = (this.sprite.x - mouse.x)*dt*set.MousePower;
        this.sprite.acy = (this.sprite.y - mouse.y)*dt*set.MousePower;
        this.sprite.vx += this.sprite.acx;
        this.sprite.vy += this.sprite.acy;
    }
    this.sprite.acx = 0
    this.sprite.acy = 0

    if (set.LinearDamp) {
        this.linearDamp(dt)
    }
    this.nodesEmpty = true
    this.nodesCount = 0
    for (var nodeid in this.nodes) {
        this.nodesCount++
        if (this.nodesCount > set.Nodes) {
            this.nodesEmpty = false
        }
        this.nodes[nodeid].update(dt)
        if (set.NodeSwitch && this.nodes[nodeid].alpha < 0.1) {
            this.nodes[nodeid].removeNode()
        }
    }
}

function Node(source,dest,wid) {
    this.node = new PIXI.Graphics()
    this.source = source
    this.dest = dest
    this.x = this.source.sprite.x
    this.y = this.source.sprite.y
    this.destx = this.dest.sprite.x
    this.desty = this.dest.sprite.y
    this.tint = this.source.sprite.tint
    this.alpha = this.source.sprite.alpha


    this.node.lineStyle(wid, this.tint, this.alpha)
    this.node.position.set(0,0)
    this.node.moveTo(this.x,this.y)
    this.node.lineTo(this.destx,this.desty)

    this.ID = this.source.nodeID
    this.source.nodeID++
    this.source.nodes[this.ID] = this
    app.stage.addChild(this.node)
}

Node.prototype.update = function(dt) {
    this.x = this.source.sprite.x
    this.y = this.source.sprite.y
    this.destx = this.dest.sprite.x
    this.desty = this.dest.sprite.y
    let dist = magnitude(this.x,this.y,this.destx,this.desty)
    this.node.clear()
    // this.beginFill()
    let overone = dist*2/set.NodeLength
    this.alpha = this.source.alpha
    if (overone>1) {
        this.alpha = 1 / overone
    }
    this.node.lineStyle(1, this.tint, this.alpha)

    this.node.moveTo(this.x,this.y)
    this.node.lineTo(this.destx,this.desty)
    // this.endFill()
}

Node.prototype.removeNode = function() {
    delete this.source.nodes[this.ID]
    // console.log(this.source.nodes)
    app.stage.removeChild(this.node)
    this.node.destroy()
}
