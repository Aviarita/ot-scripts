var options = []
function onVoteOptions() {
    for (var i=0; i<=4; i++)
        options[i] = Event.GetString("option"+i);
}
function onVoteCast() {
    var entid = Event.GetInt("entityid");
    var team = Event.GetInt("team");
    var option = Event.GetInt("vote_option");
    var name = Entity.GetName(entid);
    var chTeam = null;
    switch (team) {
        case 0: chTeam = "[N] "; break;
        case 1: chTeam = "[S] "; break;
        case 2: chTeam = "[T] "; break;
        case 3: chTeam = "[CT] "; break;
    }
    var vote = options[option];
    Global.PrintChat(chTeam + name + " voted " + vote);
}
Global.RegisterCallback("vote_options", "onVoteOptions");
Global.RegisterCallback("vote_cast", "onVoteCast");
