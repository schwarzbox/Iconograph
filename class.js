
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
    let scale = Math.random() * set.ScaleX
    this.sprite.scale.set(scale,scale)

    this.sprite.tint = clr
    if (set.RandomAlpha==true) {
        this.sprite.alpha = Math.random()
    }
    app.stage.addChild(this.sprite)

    ID++
    this.ID = ID
    atoms[this.ID] = this
}

Atom.prototype.removeAtom = function() {
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
    if (set.RandomTint==false) {
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
    if(distance<(set.MouseRadius)){
        this.sprite.acx += (this.sprite.x - mouse.x)/100;
        this.sprite.acy += (this.sprite.y - mouse.y)/100;
        this.sprite.vx += this.sprite.acx;
        this.sprite.vy += this.sprite.acy;
    }
    this.sprite.acx = 0
    this.sprite.acy = 0
    this.linearDamp(dt)
}
