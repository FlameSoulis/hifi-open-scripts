"use strict";
(function() { // BEGIN LOCAL_SCOPE

   var spawnSensitivity = 0.25;	//Distance from spawning point

   this.preload = spawnSpace;
   this.enterEntity = spawnSpace;	//Yes, adding this was THAT easy
   
   function spawnSpace(entityID) {
       print("Spawn spacer checking...");
       //We only have to run this once, so here we go!
       var spawnPosition = Entities.getEntityProperties(entityID, 'position').position;
       var spawnSize = Entities.getEntityProperties(entityID, 'dimensions').dimensions;
       var spawnRotation = Entities.getEntityProperties(entityID, 'rotation').rotation;
       
       //Cool, now lets see if the user spawned in where we are!
       if( compareVec3( spawnPosition, MyAvatar.position, spawnSensitivity ) ) {
           print("Spawn spacer activated...");
           //Okay, so we are at spawn when we ran this script, so we MUST have teleported in at this spot
           //Decipher the sessionUUID
           var xHex = MyAvatar.sessionUUID.substring(1,4);
           var zHex = MyAvatar.sessionUUID.substring(4,7);
           //Convert from hex to int
           var xInt = parseInt(xHex, 16);
           var zInt = parseInt(zHex, 16);
           //Determine the remainder
           xInt = xInt % spawnSize.x;
           zInt = zInt % spawnSize.z;
           //Create a new offset
           var vNewPos = {
               x: xInt-(spawnSize.x/2.0),
               y: 0,
               z: zInt-(spawnSize.z/2.0)
           };
           //V2 BONUS: ROTATION UPGRADE!!!!
           vNewPos = Vec3.multiplyQbyV( spawnRotation, vNewPos );
           //Combine with the spawnPosition
           vNewPos = Vec3.sum( vNewPos, spawnPosition );
           //Perfect! Now set our position to the new position
           print("Moving avatar to "+JSON.stringify(vNewPos)+"...");
           MyAvatar.position = vNewPos;
       } else {
           //Okay, we don't need to do anything
           print("Spawn spacer not needed!");
       }
   }
   
   function compareVec3( vec1, vec2, distance ) {
       var d = Vec3.distance( vec1, vec2 );
       return (d < distance);
   }
}); // END LOCAL_SCOPE