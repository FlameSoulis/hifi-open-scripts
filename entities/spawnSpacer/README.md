# Spawn Spacer
This entity script spaces users out in the enclosed area for objects positioned exactly where users teleport into a domain.

### How to Setup
1. Create a cube or zone.
2. Position this entity **exactly** where the users will be teleporting in.
3. Size the entity in whole numbers (example: x:5.0, z:5.0, x:6.0, z:9.0).
...The y axis doesn't matter for now, but in the future, the hope is to have it be another setting for how far people should be spread apart (y:1.0 = 1m)
4. Set the entity to be _Collisionless_.
...This does not apply to zones.
5. Install the script in the _Script Url_.
6. Done!

### Uses

* Spacing users coming into your domain
* Spacing users coming in from an in-domain teleports
* Preventing users from seeing the horrors of inside each other's skulls

### Tips
* The spawn spacer can be rotated to accommodate unusually shaped buildings or areas