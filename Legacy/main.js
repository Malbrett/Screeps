var roleDrone = require('role.Drone');
var roleHarvester = require('role.Harvester');
var roleSoldier = require('role.Soldier');

var Roles = {
    drones: {
        minNumber: 5,
        currentNumber: 0,
        roleID: 'Drone',
        bodyparts: [WORK,CARRY,MOVE,MOVE],
    },
    /*harvesters: {
        minNumber: 3,
        currentNumber: 0,
        roleID: 'Harvester',
        bodyparts: [WORK,WORK,MOVE,MOVE],
    },
    /*soldiers: {
        minNumber: 0,
        currentNumber: 0,
        roleID: 'soldier',
        bodyparts: [ATTACK,ATTACK,MOVE,MOVE],
    },*/
};

var Tasks = {
    harvest: {
        maxAllocation: 3,
        minAllocation: 1
    },
    refill: {
        maxAllocation: 3,
        minAllocation: 1
    },
    build: {
        maxAllocation: 3,
        minAllocation: 1
    },
    upgrade: {
        maxAllocation: -1,
        minAllocation: 1
    },
    idle: {
        maxAllocation: -1,
        minAllocation: 0
    },
    
    allocation: function(task) {
        let allocation = 0;
        for(name in Game.creeps) {
            let creep = Game.creeps[name];
            if(creep.memory['task'] == task) {
                allocation += 1;
            }
        }
        return allocation;
    }
};

module.exports.loop = function () {
    //for(var name in Memory.creeps) {
    //    if(!Game.creeps[name]) {
    //        delete Memory.creeps[name];
    //        console.log('Clearing dead creep memory: ', name);
    //    }
    //}
    
    for(name in Game.creeps) {
        let creep = Game.creeps[name];
        if( !creep.memory.task ) {
            creep.memory.task = 'idle';
        }
        for( let assignedTask in Tasks ) {
            if( creep.memory.role == 'Drone' ) {
                //console.log(Tasks.allocation(assignedTask) + ' Drones assigned to ' + assignedTask);
                if( creep.memory.task == 'idle' && Tasks.allocation(assignedTask) < Tasks[assignedTask]['maxAllocation'] ) {
                    creep.memory['task'] = assignedTask;
                    roleDrone[assignedTask](creep);
                    break;
                }
                else if( creep.memory.task == assignedTask ) {
                    roleDrone[assignedTask](creep);
                    break;
                }
                else if( Tasks[assignedTask].maxAllocation == -1 ) {
                    
                }
            }
        }
    }
    
    for(var role in Roles) {
        Roles[role]['creepNames'] = _.filter(Game.creeps, (creep) => creep.memory.role == Roles[role]['roleID']);
        if(Roles[role]['creepNames'].length < Roles[role]['minNumber'] && !Game.spawns['Spawn1'].spawning) {
            for(let i = 1; i <= Roles[role]['minNumber']; i++) {
                let newName = Roles[role]['roleID'] + i;
                if( !Game.creeps[newName] ) {
                    let testSpawn = Game.spawns['Spawn1'].spawnCreep( Roles[role]['bodyparts'], newName, { dryRun: true } );
                    if( testSpawn == 0 ) {
                        console.log('Spawning new ' + newName);
                        Game.spawns['Spawn1'].spawnCreep( Roles[role]['bodyparts'], newName, { memory: {role: Roles[role]['roleID']} } );
                        break;
                    }
                    else if(testSpawn == -6) {
                        console.log('Insufficient energy to spawn ' + newName);
                        break;
                    }
                }
            }
        }
    }
}