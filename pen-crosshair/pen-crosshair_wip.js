UI.AddCheckbox("Penetration indicator")

var weapons_ignored = [
	"CKnife",
	"CWeaponTaser",
	"CC4",
	"CHEGrenade",
	"CSmokeGrenade",
	"CMolotovGrenade",
	"CSensorGrenade",
	"CFlashbang",
	"CDecoyGrenade",
	"CIncendiaryGrenade"
]

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function angle_forward( angle ) {
    var sin_pitch = Math.sin( deg2rad( angle[0] ) )
    var cos_pitch = Math.cos( deg2rad( angle[0] ) )
    var sin_yaw   = Math.sin( deg2rad( angle[1] ) )
    var cos_yaw   = Math.cos( deg2rad( angle[1] ) )
    return [
        cos_pitch * cos_yaw,
        cos_pitch * sin_yaw,
        -sin_pitch
    ]       
}

function includes(array, value) {
    for (i in array) {
        if (array[i] == value)
            return true;
    }
    return false;
}

function onDraw() {

    if (!UI.GetValue("Penetration indicator"))
        return;

    var screen_pos = Global.GetScreenSize()
    var me = Entity.GetLocalPlayer()
    if (Entity.IsAlive(me)) {
        var myWeapon = Entity.GetWeapon(me);
        var classname = Entity.GetClassName(myWeapon);
        if (includes(weapons_ignored, classname)) {
            return;
        }

        var angles = Global.GetViewAngles();
        var fwd = angle_forward(angles);
        var start_pos = Entity.GetEyePosition(me);

        var fraction = Trace.Line(me, start_pos, [
            start_pos[0] + (fwd[0] * 2000),
            start_pos[1] + (fwd[1] * 2000),
            start_pos[2] + (fwd[2] * 2000)
        ])[1]

        if (fraction < 1) {
            var end_pos = [
                start_pos[0] + (fwd[0] * (2000 * fraction + 128)),
                start_pos[1] + (fwd[1] * (2000 * fraction + 128)),
                start_pos[2] + (fwd[2] * (2000 * fraction + 128))
            ]
            var dmg = Trace.Bullet(me, start_pos, end_pos)[1];
            Render.Rect(screen_pos[0]/2-1, screen_pos[1]/2-1, 2, 2, dmg > 0 ? [0,255,0,255] : [255,0,0,255])
        }
    }
}

Global.RegisterCallback("Draw", "onDraw")
