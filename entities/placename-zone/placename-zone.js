(function () {
    var entityID = null;

    this.preload = init;
    this.enterEntity = enterredZone;
    this.leaveEntity = exittedZone;

    function init(_entityID) {
        entityID = _entityID;
        print("placename-zone loaded");
        // Setup the default variables in userData if not already set up
        checkURLUserData(_entityID, "zoneplace", Window.location.placename);
        checkURLUserData(_entityID, "mainplace", Window.location.placename);
    }
    function enterredZone(_entityID) {
        // Get our placename to use
        var placename = checkURLUserData(_entityID, "zoneplace", Window.location.placename);
        // Make sure our placename isn't blank or our protocol isn't a serverless (file)
        if (placename !== "" && Window.location.protocol === "hifi") {
            Window.location = 
                Window.location.protocol + "://"+
                placename + "/" + 
                vecToURLPos(MyAvatar.getWorldFeetPosition());
        }
    }
    function exittedZone(_entityID) {
        // Get our placename to use
        var placename = checkURLUserData(_entityID, "mainplace", Window.location.placename);
        // Make sure our placename isn't blank or our protocol isn't a serverless (file)
        if (placename !== "" && Window.location.protocol === "hifi") {
            Window.location = 
                Window.location.protocol + "://"+
                placename + "/" + 
                vecToURLPos(MyAvatar.getWorldFeetPosition());
        }
    }
    function checkURLUserData(_entityID, parameter, defaultvalue) {
        // First, see if the url parameter exists
        var properties = Entities.getEntityProperties(_entityID, ["userData"]);
        var jsonData = JSON.parse(properties["userData"]);
        if (jsonData[parameter] === undefined) {
            // If it doesn't, then add it back!
            jsonData[parameter] = defaultvalue;
            Entities.editEntity(_entityID, { "userData": JSON.stringify(jsonData) });
            properties = Entities.getEntityProperties(_entityID, ["userData"]);
            jsonData = JSON.parse(properties["userData"]);
        }
        // Return our spoils!
        return jsonData[parameter];
    }
    function vecToURLPos(vec3pos) {
        return vec3pos.x + "," + vec3pos.y + "," + vec3pos.z;
    }
});