var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const pauseConstruction = true;
var harvestEmergency = false;

/*var screeps = [ 
    ['Harvester', 3, [WORK,WORK,WORK,WORK,MOVE], 450 ], 
    [ 'Hauler', 2, [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], 300 ],
    [ 'Upgrader', 2, [CARRY,WORK,WORK,MOVE,MOVE,MOVE], 400 ],
    [ 'Builder', 3, [CARRY,WORK,WORK,MOVE,MOVE,MOVE], 400 ],
];*/

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var tower = Game.getObjectById('ddf429c1fe6983b72dd26f21');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    /*var roles = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 3 && !Game.spawns['Spawn1'].spawning) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }*/
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 3 && !Game.spawns['Spawn1'].spawning) {
        var newName = 'Harvester' + Game.time;
        //console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    if( harvesters.length == 0 ) {
        console.log('All Harvesters Dead');
        //Game.notify('All Harvesters Dead');
        harvestEmergency = true;
    }
    else {
        harvestEmergency = false;
    }
    
   var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    if(haulers.length < 3 && !Game.spawns['Spawn1'].spawning) {
        var newName = 'Hauler' + Game.time;
        //console.log('Spawning new hauler: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'hauler'}});
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(upgraders.length < 3 && !Game.spawns['Spawn1'].spawning) {
        var newName = 'Upgrader' + Game.time;
        //console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,WORK,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 3 && !Game.spawns['Spawn1'].spawning) {
        var newName = 'Builder' + Game.time;
        //console.log('Spawning new Builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,WORK,WORK,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
            if(creep.memory.bored == true) {
                //roleBuilder.run(creep);
            }
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            if(harvestEmergency) {
                roleHarvester.run(creep);
            }
            else if(!pauseConstruction) {
                roleBuilder.run(creep);
            }
            else {
                roleHauler.run(creep);
            }
        }
    }
}