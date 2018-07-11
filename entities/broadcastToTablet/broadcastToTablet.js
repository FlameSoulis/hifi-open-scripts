(function () {
    var defaultURL = 'http://www.google.com';
    var entityID = Uuid.NULL;
    var tablet = null;

    // Set up our calls and functions
    this.preload = initialize;
    this.startFarTrigger = onInteraction;
    Entities.mousePressOnEntity.connect(onInteraction);
    Script.scriptEnding.connect(cleanUp);

    function initialize(_entityID) {
        // Acquire the initial information
        entityID = _entityID;
        tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
        // Running this at start also sets up the URL parameter, saving time
        checkURLUserData(entityID);
    }

    function checkURLUserData(_entityID) {
        // First, see if the url parameter exists
        var properties = Entities.getEntityProperties(_entityID, ["userData"]);
        var jsonData = JSON.parse(properties["userData"]);
        if (jsonData["url"] === undefined) {
            // If it doesn't, then add it back!
            jsonData["url"] = defaultURL;
            Entities.editEntity(_entityID, { "userData": JSON.stringify(jsonData) });
            properties = Entities.getEntityProperties(_entityID, ["userData"]);
            jsonData = JSON.parse(properties["userData"]);
        }
        // Return our spoils!
        return jsonData["url"];
    }

    // Handling desktop and VR calls all at once? Yes we can!
    function onInteraction(_entityID, event) {
        // Is this our entity?
        if (_entityID === entityID && entityID !== Uuid.NULL) {
            // Check if we are close enough to click the shortcut
            var position = Entities.getEntityProperties(_entityID, ["position"])["position"];
            if (Vec3.distance(MyAvatar.position, position) < 15) {
                var urlToUse = checkURLUserData(_entityID);
                // Okay, figure it out
                if ((typeof event) === "string") {
                    // VR User Check
                    if (event.indexOf(MyAvatar.sessionUUID) !== -1) {
                        tablet.gotoWebScreen(urlToUse);
                    }
                } else if (event.isPrimaryButton !== undefined) {
                    // Clicked! (Desktop User Check)
                    tablet.gotoWebScreen(urlToUse);
                }
            }
        }
    }

    // Clean everything up
    function cleanUp() {
        Entities.mousePressOnEntity.disconnect(onInteraction);
    }
});