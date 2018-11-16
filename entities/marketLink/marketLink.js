(function () {
    var MARKETPLACE_URL = Account.metaverseServerURL + "/marketplace";
    var MARKETPLACES_INJECT_SCRIPT_URL = Script.resolvePath("/~/system/html/js/marketplacesInject.js");
    var METAVERSE_SERVER_URL = Account.metaverseServerURL;
    var MARKETPLACE_URL_INITIAL = MARKETPLACE_URL + "?"; // Append "?" to signal injected script that it's the initial page.

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
        if (jsonData["marketid"] === undefined) {
            // If it doesn't, then add it back!
            jsonData["marketid"] = MARKETPLACE_URL_INITIAL;
            Entities.editEntity(_entityID, { "userData": JSON.stringify(jsonData) });
            properties = Entities.getEntityProperties(_entityID, ["userData"]);
            jsonData = JSON.parse(properties["userData"]);
        }
        // Return our spoils!
        return jsonData["marketid"];
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
                        openMarketplace(urlToUse);
                    }
                } else if (event.isPrimaryButton !== undefined) {
                    // Clicked! (Desktop User Check)
                    openMarketplace(urlToUse);
                }
            }
        }
    }

    function openMarketplace(optionalItemOrUrl) {
        // This is a bit of a kluge, but so is the whole file.
        // If given a whole path, use it with no cta.
        // If given an id, build the appropriate url and use the id as the cta.
        // Otherwise, use home and 'marketplace cta'.
        // AND... if call onMarketplaceOpen to setupWallet if we need to.
        var url = optionalItemOrUrl || MARKETPLACE_URL_INITIAL;
        // If optionalItemOrUrl contains the metaverse base, then it's a url, not an item id.
        if (optionalItemOrUrl && optionalItemOrUrl.indexOf(METAVERSE_SERVER_URL) === -1) {
            url = MARKETPLACE_URL + '/items/' + optionalItemOrUrl;
        }
        tablet.gotoWebScreen(url, MARKETPLACES_INJECT_SCRIPT_URL);
    }

    // Clean everything up
    function cleanUp() {
        Entities.mousePressOnEntity.disconnect(onInteraction);
    }
});