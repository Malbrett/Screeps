var roleDrone = require('role.Drone');
var roleSoldier = require('role.Soldier');
if(!Game.spawns['Spawn1'].memory.queue) {
    Game.spawns['Spawn1'].memory['queue'] = [ 'WorkerDrone1' ];
}
if(!Memory.tasks) {
    Memory.tasks = [ ];
}

var Roles = {
    workers: {
        maxNumber: 3,
        currentNumber: 0,
        bodyID: 'Worker',
        roleID: 'Drone',
        bodyparts: [WORK,CARRY,MOVE,MOVE],
    },
    harvesters: {
        maxNumber: 3,
        currentNumber: 0,
        bodyID: 'Harvester',
        roleID: 'Drone',
        bodyparts: [WORK,WORK,MOVE],
    },
    haulers: {
        maxNumber: 3,
        currentNumber: 0,
        bodyID: 'Hauler',
        roleID: 'Drone',
        bodyparts: [CARRY,CARRY,MOVE,MOVE],
    },
};

var Tasks = {
    allocation: function(task) {
        let allocation = 0;
        for(name in Game.creeps) {
            let creep = Game.creeps[name];
            if(creep.memory['task'] == task) {
                allocation += 1;
            }
        }
        return allocation;
    },
};

module.exports.loop = function () {
    for(let flag in Game.flags) {
        for(let i = 1; i <= 4; i++) {
            let ii = 1;
            if(flag.name == ( 'Source' + i )) {
                let extractionPoints = Game.lookForAtArea(LOOK_TERRAIN, (flag.pos.y - 1), (flag.pos.x - 1), (flag.pos.y + 1), (flag.pos.x + 1), true);
                for(let extractPoint in extractionPoints) {
                    console.log(extractPoint.terrain + extractPoint.pos.x + ',' + extractPoint.pos.y);
                    if(extractPoint.terrain != 'wall') {
                        Memory.tasks['Harvest' + i + '.' + ii] = [ pos = extractPoint.pos, allocation = [] ];
                    }
                }
            }
        }
        
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing dead creep memory: ', name);
        }
    }
    
    for(name in Game.creeps) {
        let creep = Game.creeps[name];
        
    }
    
    for(var role in Roles) {
        Roles[role]['creepNames'] = _.filter(Game.creeps, (creep) => creep.memory.role == Roles[role]['bodyID']);
        if(Roles[role]['creepNames'].length < Roles[role]['maxNumber'] && !Game.spawns['Spawn1'].spawning) {
            for(let i = 1; i <= Roles[role]['maxNumber']; i++) {
                let newName = Roles[role]['bodyID'] + Roles[role]['roleID'] + i;
                if( !Game.creeps[newName] ) {
                    let testSpawn = Game.spawns['Spawn1'].spawnCreep( Roles[role]['bodyparts'], newName, { dryRun: true } );
                    if( testSpawn == 0 && Game.spawns['Spawn1'].memory.queue[0] == newName) {
                        console.log('Spawning new ' + newName);
                        Game.spawns['Spawn1'].memory['queue'].shift();
                        Game.spawns['Spawn1'].spawnCreep( Roles[role]['bodyparts'], newName, 
                        { memory: { role: Roles[role]['roleID'], bodytype: Roles[role]['bodyID'], task: 'idle' } } );
                        break;
                    }
                    else if(!Game.spawns['Spawn1'].memory.queue.includes(newName)) {
                        if(testSpawn == -6) {
                            console.log('Insufficient energy to spawn ' + newName);
                        }
                        console.log('Queueing ' + newName + '  to spawn');
                        Game.spawns['Spawn1'].memory['queue'].push(newName);
                        break;
                    }
                }
            }
        }
    }
}