(function () { // BEGIN LOCAL_SCOPE

    var spawnSensitivity = 0.25;	// Distance from spawning point

    this.preload = spawnSpace;
    this.enterEntity = spawnSpace;	// Yes, adding this was THAT easy

    function spawnSpace(entityID) {
        print("Spawn spacer checking...");
        // We only have to run this once, so here we go!
        var spawnPosition = Entities.getEntityProperties(entityID, 'position').position;
        var spawnSize = Entities.getEntityProperties(entityID, 'dimensions').dimensions;
        var spawnRotation = Entities.getEntityProperties(entityID, 'rotation').rotation;

        // Cool, now lets see if the user spawned in where we are!
        if (compareVec3(spawnPosition, MyAvatar.position, spawnSensitivity) ||
          compareVec3(spawnPosition, MyAvatar.getWorldFeetPosition(), spawnSensitivity)) {
            print("Spawn spacer activated...");
            // Due to 0.72.0, we have to determine the offset of the feet
            var yOffset = 0.0;
            // Did we trigger by feet or by position?
            if (Vec3.distance(spawnPosition, MyAvatar.getWorldFeetPosition()) <
              Vec3.distance(spawnPosition, MyAvatar.position)) {
                var footOffset = Vec3.subtract(MyAvatar.position, MyAvatar.getWorldFeetPosition());
                footOffset = Vec3.multiplyQbyV(MyAvatar.orientation, footOffset);
                yOffset = footOffset.y;
            }
            // Make some random numbers
            var xInt = ourRandInt(0, spawnSize.x);
            var zInt = ourRandInt(0, spawnSize.z);
            // Create a new offset
            var vNewPos = {
                x: xInt - (spawnSize.x / 2.0),
                y: yOffset,
                z: zInt - (spawnSize.z / 2.0)
            };
            // Rotate our offset based on the rotation of the spawn spacer entity
            vNewPos = Vec3.multiplyQbyV(spawnRotation, vNewPos);
            // Combine with the spawnPosition
            vNewPos = Vec3.sum(vNewPos, spawnPosition);
            // Perfect! Now set our position to the new position
            print("Moving avatar to " + JSON.stringify(vNewPos) + "...");
            MyAvatar.position = vNewPos;
        } else {
            // Okay, we don't need to do anything
            print("Spawn spacer not needed!");
        }
    }

    function compareVec3(vec1, vec2, distance) {
        var d = Vec3.distance(vec1, vec2);
        return (d < distance);
    }

    // Modified from system/libraries/utils.js
    function ourRandInt(low, high) {
        // I'm not a fan of rounding down...
        // It makes the max not really the max
        return Math.round(low + Math.random() * (high - low));
    }
}); // END LOCAL_SCOPE