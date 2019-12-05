UI.AddCheckbox("Show dangerzone items")
UI.AddSliderInt("DZ Items min distance (meters)", 0, 500)
UI.AddMultiDropdown("Items to show", [
    "Cash", "Ammo Box",
    "Crates", "Safe", "Breach charge",
    "Drone", "Turrets", "Radar jammer", 
    "Pickups" , "Melees", "Tablets"
])

function get_metric_distance(a, b) {
	return Math.floor(Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)) * 0.0254 );
}

function drawStuff(entity, name, color, doDist) {
    var me = Entity.GetLocalPlayer();
    var mypos = Entity.GetRenderOrigin(me);
    var pos = Entity.GetRenderOrigin(entity);

    var dist = get_metric_distance(mypos, pos);

    var w2s = Render.WorldToScreen(pos);
    if (w2s && dist < UI.GetValue("DZ Items min distance (meters)")) {
        Render.String(w2s[0], w2s[1], 1, name, color, 3);
        if (doDist)
            Render.String(w2s[0], w2s[1] + 10, 1, dist + "M", color, 3);
    }
}

function onDraw() {
    var players = Entity.GetPlayers()

    for (var i=1; i  < players.length; i++) { // starting at 1 to skip localplayer
        var player = players[i];
        if (!Entity.IsValid(player))
            continue;
        var pos = Entity.GetProp(player, "DT_CSPlayer", "m_vecSpawnRappellingRopeOrigin")
        Global.Print(pos + "\n")
        var w2s = Render.WorldToScreen(pos)
        if (w2s[0]) {
            Render.String(w2s[0], w2s[1], 1, "Spawn", [255,255,255,255])
        }
    }

    UI.SetEnabled("DZ Items min distance (meters)", UI.GetValue("Show dangerzone items") == true)
    UI.SetEnabled("Items to show", UI.GetValue("Show dangerzone items") == true)

    if (UI.GetValue("Show dangerzone items") == false) {
        return;
    }

    var selected = UI.GetValue("Items to show")

    var me = Entity.GetLocalPlayer();

    var entities = Entity.GetEntities();
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];

        if (!Entity.IsValid(entity))
            continue;

        var classid = Entity.GetClassID(entity)
        var modelindex = Entity.GetProp(entity, "DT_BaseEntity", "m_nModelIndex") 
        var m_hOwner = Entity.GetProp(entity, "DT_BaseEntity", "m_hOwnerEntity") 
        var classname = Entity.GetClassName(entity)
        var chName = Entity.GetName(entity)

        var name = "null"
        var color = [0,0,0,255]
        var doDist = true;
        var shouldDraw = false;

        switch (classid) {
            case 27: // safe
                name = "Safe"
                color = [101,6,230,255];
                shouldDraw = selected & (1 << 3) 
                break;
            case 28: // breach charge
                name = "Breach charge";
                color = [100,200,60,255];
                shouldDraw = selected & (1 << 4) 
                break;
            case 29: // breach charge placed
                name = "Breach charge (Placed)";
                color = [100,200,60,255];
                shouldDraw = selected & (1 << 4) 
                break;
            case 49: // drone
                name = "Drone";
                color = [255,100,100,255];
                shouldDraw = selected & (1 << 5) 
                break;
            case 50: // drone gun
                var health = Entity.GetProp(entity, "DT_Dronegun", "m_iHealth")
                if (health < 1)
                    break;
                name = "Turret (" + health + " HP)";
                color = [255,100,100,255];
                shouldDraw = selected & (1 << 6) 
                break;
            case 104:
                if (m_hOwner != "m_hOwnerEntity")
                    break;
                name = "Healthshot";
                color = [0,255,60,255];
                shouldDraw = selected & (1 << 8) 
                break;
            case 105:
                name = "Cash";
                color = [0,255,60,255];
                shouldDraw = selected & (1 << 0) 
                break;
            case 111: // melee
                var itemIDX = Entity.GetProp(entity, "DT_BaseCombatWeapon", "m_iItemDefinitionIndex")
                doDist = false;
                shouldDraw = selected & (1 << 9) 
                switch (itemIDX) {
                    case 75:
                        name = "Axe";
                        color = [255,255,255,255];
                        break;
                    case 76:
                        name = "Hammer";
                        color = [255,255,255,255];
                        break;
                    case 78:
                        name = "Wrench";
                        color = [255,255,255,255];
                        break;
                }
                break;
            case 124:
                name = "Ammo Box";
                color = [0,0,60,255];
                shouldDraw = selected & (1 << 1) 
                break;
            case 125:
                name = "Loot crate (" + modelindex + ")";
                color = [255,255,255,255];
                shouldDraw = selected & (1 << 2) 
                switch (Entity.GetName(entity)) {
                    case 939:
                        name = "Heavy crate";
                        color = [225,14,14,255];
                        break;
                    case 982:
                        name = "Light crate";
                        color = [225,14,14,255];
                        break;
                    case 887:
                         name = "Pistol crate";
                         color = [225,14,69,255];
                         break;
                    case 861:
                        name = "Meele crate";
                        color = [53,122,200,255];
                        break;
                    case 913:
                        name = "Explosives crate";
                        color = [222,230,6,255];
                        break;
                    case 821:
                        name = "Airdrop";
                        color = [101,6,230,255];
                        break;
                    case 1021:
                        name = "Dufflebag";
                        color = [0,255,60,255];
                        break;
                }
                break;
            case 126: // radar jammer
                name = "Radar jammer";
                color = [0,25,255, 255];
                shouldDraw = selected & (1 << 7) 
                break;
            case 127: // pickups
            name = "Pickup (" + modelindex + ")";
            color = [255,255,255,255];
            shouldDraw = selected & (1 << 8) 
                switch (modelindex) {
                    case 1030:
                        name = "Kevlar";
                        color = [53,122,200,255];
                            break;
                    case 1031:
                        name = "Full kevlar";
                        color = [53,122,200,255];
                        break;
                    case 1032:
                        name = "Helmet";
                        color = [53,122,200,255];
                        break;
                    case 1033:
                        name = "Parachute";
                        color = [53,122,200,255];
                        break;
                    case 1034:
                        name = "Briefcase";
                        color = [200,200,255,255];
                        break;
                    case 1035:
                        name = "Zone intel upgrade";
                        color = [0,200,0,255];
                        break;
                    case 1036:
                        name = "Drone upgrade";
                        color = [53,122,200,255];
                        break;
                    case 1038:
                        name = "Exojump suit";
                        color = [53,122,200,255];
                        break;
                }
                break;
                case 171:
                    if (m_hOwner != "m_hOwnerEntity")
                        break;
                    name = "Tablet";
                    color = [200,200,200,255];
                    doDist = false
                    shouldDraw = selected & (1 << 10) 
                    break;
        }
        if (name != "null" && shouldDraw)
            drawStuff(entity, name, color, doDist);
    }
}

Global.RegisterCallback("Draw", "onDraw")
