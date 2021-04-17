var roleDrone = {

    /** @param {Creep} creep **/
    collect: function(creep,fromGround) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
        if(fromGround || !target) {
            target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        }
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
	},
    
    harvest: function(creep) {
        var sources = creep.pos.findClosestByRange(FIND_SOURCES);
        //var extractionpoint = creep.room.find(FIND_FLAGS);
        //for(i = 0; i < sources.length; i++) {
            if(creep.harvest(sources/*[i]*/) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources/*[i]*/, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        //}
	},
	
	refill: function(creep) {
        
    },
	
	build: function(creep) {
        
	},
	
	upgrade: function(creep) {
        
	},
};

module.exports = roleDrone;