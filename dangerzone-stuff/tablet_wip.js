function onTablet(tablet) {
    var me = Entity.GetLocalPlayer()
    var owner = Entity.GetProp(tablet, "DT_WeaponTablet", "m_hOwner")
    if (owner == me) {
        Entity.SetProp(tablet, "DT_WeaponTablet", "m_bTabletReceptionIsBlocked", false);
        Entity.SetProp(tablet, "DT_WeaponTablet", "m_flUpgradeExpirationTime[0]", -1)
        Entity.SetProp(tablet, "DT_WeaponTablet", "m_flScanProgress", 1)
    }
}

function onCreateMove() {
    var entities = Entity.GetEntitiesByClassID( 171 )
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!Entity.IsValid(entity))
            continue;
         onTablet(entity);
    }
}
Global.RegisterCallback("CreateMove", "onCreateMove")
