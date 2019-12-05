var options = []
function onVoteOptions() {
    options[0] = Event.GetString("option1");
    options[1] = Event.GetString("option2");
    options[2] = Event.GetString("option3");
    options[3] = Event.GetString("option4");
    options[4] = Event.GetString("option5");
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
