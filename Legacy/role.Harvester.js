var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.pos.findClosestByRange(FIND_SOURCES);
        //var extractionpoint = creep.room.find(FIND_FLAGS);
        //for(i = 0; i < sources.length; i++) {
            if(creep.harvest(sources/*[i]*/) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources/*[i]*/, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        //}
	}
};

module.exports = roleHarvester;