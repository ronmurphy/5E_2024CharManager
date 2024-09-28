try {
(function(window, document) {
    'use strict';

    console.log("app.js is loading");

    // Create a namespace for our app
    window.myApp = window.myApp || {};

    // Character object
    const character = {
        name: '',
        race: '',
        class: '',
        subclass: '',
        level: 1,
        background: '',
        abilityScores: {},
        skills: [],
        feats: [],
        inventory: [],
        spells: [],
        hp: 0,
        maxHp: 0,
        ac: 10,
        initiative: 0,
        proficiencyBonus: 2,
        savingThrows: {},
        notes: '',
        currency: {
            copper: 0,
            silver: 0,
            electrum: 0,
            gold: 0,
            platinum: 0,
            gems: ''
        },
        abilityScoreImprovementsLeft: 0
    };

    const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

// Constants
const GRID_SIZE = 8;
const CELL_SIZE = 40;
const MIN_CANVAS_SIZE = 320; // Minimum canvas size in pixels
let dpiInfo = {
    dpr: 1,
    gridSize: GRID_SIZE,
    canvasSize: 320
};

    // Global variables
    let currentStep = 0;
    let rollResults = [];
    let deathSaveSuccesses = 0;
    let deathSaveFailures = 0;
    let races = {};
    let spells = [];

    const raceInfo = {
        human: "Versatile and adaptable, humans gain +1 to all ability scores.",
        elf: "Graceful and long-lived, elves have keen senses and a connection to nature. They gain +2 Dexterity.",
        dwarf: "Sturdy and resilient, dwarves gain +2 Constitution, along with darkvision and resistance to poison.",
        halfling: "Small and nimble, halflings gain +2 Dexterity, along with lucky and brave traits.",
        dragonborn: "Draconic humanoids, dragonborn gain +2 Strength and +1 Charisma, along with a breath weapon based on their draconic ancestry.",
        gnome: "Small and inventive, gnomes gain +2 Intelligence, along with darkvision and gnome cunning.",
        "half-elf": "Charismatic and versatile, half-elves gain +2 Charisma and +1 to two other ability scores of their choice.",
        "half-orc": "Strong and enduring, half-orcs gain +2 Strength and +1 Constitution, along with relentless endurance and savage attacks.",
        tiefling: "Infernal-touched humanoids, tieflings gain +2 Charisma and +1 Intelligence, along with darkvision and resistance to fire damage.",
        ardling: "Celestial-touched beings, ardlings gain flight at higher levels and have resistance to radiant damage.",
        goliath: "Large and powerful, goliaths gain +2 Strength and +1 Constitution, along with stone's endurance and powerful build.",
        orc: "Fierce and strong, orcs gain +2 Strength and +1 Constitution, along with aggressive and powerful build traits."
    };

    const classInfo = {
        artificer: "Inventive crafters who combine magic and technology, artificers create magical objects and devices to aid them in combat and exploration.",
        barbarian: "Fierce warriors who enter a battle rage, barbarians excel in combat with high strength and constitution.",
        bard: "Magical entertainers who use music and oration to inspire allies and hinder foes.",
        cleric: "Divine spellcasters who serve deities and channel holy power to heal and protect.",
        druid: "Nature-oriented spellcasters who can shapeshift into animals and control the elements.",
        fighter: "Versatile warriors skilled in all forms of combat and martial techniques.",
        monk: "Martial artists who harness the power of their body and soul in combat.",
        paladin: "Holy warriors who combine martial prowess with divine magic to uphold justice.",
        ranger: "Skilled hunters and trackers who use a mix of martial and magical abilities.",
        rogue: "Stealthy and skilled characters who excel at subterfuge and precision attacks.",
        sorcerer: "Innate spellcasters who draw magic from their bloodline or magical essence.",
        warlock: "Spellcasters who gain their powers through pacts with powerful otherworldly entities.",
        wizard: "Scholarly magic-users who learn and cast spells through rigorous study and practice."
    };

    const backgroundInfo = {
        acolyte: "You have spent your life in service to a temple, learning religious lore and rituals.",
        charlatan: "You're an expert in deception, using your quick wit and charm to manipulate others.",
        criminal: "You have a history of breaking the law and still maintain contacts in the criminal underworld.",
        entertainer: "You thrive in front of an audience, whether as a musician, actor, or storyteller.",
        "folk-hero": "You come from a humble background but are destined for greatness in the eyes of commoners.",
        "guild-artisan": "You're a skilled craftsperson, associated with an artisan's guild in a large city.",
        hermit: "You lived in seclusion, either in a sheltered community or entirely alone, for a formative part of your life.",
        noble: "You were born into wealth and power, and your family name carries weight in high society.",
        outlander: "You grew up in the wilds, far from civilization and the comforts of town and technology.",
        sage: "You spent years learning the lore of the multiverse, studying ancient tomes and manuscripts.",
        sailor: "You sailed on a seagoing vessel for years, facing storms and sea monsters.",
        soldier: "You were a member of an army, city watch, or local militia, trained in martial combat.",
        urchin: "You grew up on the streets, orphaned and poor, learning to survive through cunning and agility.",
        gladiator: "You fought for glory in arenas, honing your combat skills for the entertainment of others.",
        guard: "You served as a protector of a city or a powerful individual, trained in defense and security.",
        spy: "You were trained in the arts of deception and information gathering, serving as a covert agent."
    };

    const items = [
        // Weapons
        { name: "Club", type: "weapon", damage: "1d4", damageType: "bludgeoning", properties: ["Light"], cost: "1 sp", weight: "2 lb.", width: 1, height: 2 },
        { name: "Dagger", type: "weapon", damage: "1d4", damageType: "piercing", properties: ["Finesse", "Light", "Thrown (range 20/60)"], cost: "2 gp", weight: "1 lb.", width: 1, height: 1 },
        { name: "Greatclub", type: "weapon", damage: "1d8", damageType: "bludgeoning", properties: ["Two-handed"], cost: "2 sp", weight: "10 lb.", width: 1, height: 2 },
        { name: "Handaxe", type: "weapon", damage: "1d6", damageType: "slashing", properties: ["Light", "Thrown (range 20/60)"], cost: "5 gp", weight: "2 lb.", width: 1, height: 1 },
        { name: "Javelin", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Thrown (range 30/120)"], cost: "5 sp", weight: "2 lb." , width: 1, height: 3},
        { name: "Light hammer", type: "weapon", damage: "1d4", damageType: "bludgeoning", properties: ["Light", "Thrown (range 20/60)"], cost: "2 gp", weight: "2 lb." , width: 1, height: 1},
        { name: "Mace", type: "weapon", damage: "1d6", damageType: "bludgeoning", properties: [], cost: "5 gp", weight: "4 lb.", width: 1, height: 2 },
        { name: "Quarterstaff", type: "weapon", damage: "1d6", damageType: "bludgeoning", properties: ["Versatile (1d8)"], cost: "2 sp", weight: "4 lb.", width: 1, height: 3 },
        { name: "Sickle", type: "weapon", damage: "1d4", damageType: "slashing", properties: ["Light"], cost: "1 gp", weight: "2 lb.", width: 1, height: 1 },
        { name: "Spear", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Thrown (range 20/60)", "Versatile (1d8)"], cost: "1 gp", weight: "3 lb.", width: 1, height: 3 },
        { name: "Crossbow light", type: "weapon", damage: "1d8", damageType: "piercing", properties: ["Ammunition (range 80/320)", "Loading", "Two-handed"], cost: "25 gp", weight: "5 lb.", width: 2, height: 2 },
        { name: "Dart", type: "weapon", damage: "1d4", damageType: "piercing", properties: ["Finesse", "Thrown (range 20/60)"], cost: "5 cp", weight: "1/4 lb.", width: 1, height: 1 },
        { name: "Shortbow", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Ammunition (range 80/320)", "Two-handed"], cost: "25 gp", weight: "2 lb.", width: 1, height: 1 },
        { name: "Sling", type: "weapon", damage: "1d4", damageType: "bludgeoning", properties: ["Ammunition (range 30/120)"], cost: "1 sp", weight: "0 lb.", width: 1, height: 1 },
        { name: "Battleaxe", type: "weapon", damage: "1d8", damageType: "slashing", properties: ["Versatile (1d10)"], cost: "10 gp", weight: "4 lb.", width: 1, height: 2 },
        { name: "Flail", type: "weapon", damage: "1d8", damageType: "bludgeoning", properties: [], cost: "10 gp", weight: "2 lb.", width: 1, height: 2 },
        { name: "Glaive", type: "weapon", damage: "1d10", damageType: "slashing", properties: ["Heavy", "Reach", "Two-handed"], cost: "20 gp", weight: "6 lb.", width: 1, height: 3 },
        { name: "Greataxe", type: "weapon", damage: "1d12", damageType: "slashing", properties: ["Heavy", "Two-handed"], cost: "30 gp", weight: "7 lb." , width: 1, height: 2},
        { name: "Greatsword", type: "weapon", damage: "2d6", damageType: "slashing", properties: ["Heavy", "Two-handed"], cost: "50 gp", weight: "6 lb.", width: 1, height: 3 },
        { name: "Halberd", type: "weapon", damage: "1d10", damageType: "slashing", properties: ["Heavy", "Reach", "Two-handed"], cost: "20 gp", weight: "6 lb.", width: 1, height: 3 },
        { name: "Lance", type: "weapon", damage: "1d12", damageType: "piercing", properties: ["Reach", "Special"], cost: "10 gp", weight: "6 lb.", width: 1, height: 2 },
        { name: "Longsword", type: "weapon", damage: "1d8", damageType: "slashing", properties: ["Versatile (1d10)"], cost: "15 gp", weight: "3 lb.", width: 1, height: 2 },
        { name: "Maul", type: "weapon", damage: "2d6", damageType: "bludgeoning", properties: ["Heavy", "Two-handed"], cost: "10 gp", weight: "10 lb.", width: 1, height: 2 },
        { name: "Morningstar", type: "weapon", damage: "1d8", damageType: "piercing", properties: [], cost: "15 gp", weight: "4 lb.", width: 1, height: 2 },
        { name: "Pike", type: "weapon", damage: "1d10", damageType: "piercing", properties: ["Heavy", "Reach", "Two-handed"], cost: "5 gp", weight: "18 lb.", width: 1, height: 3 },
        { name: "Rapier", type: "weapon", damage: "1d8", damageType: "piercing", properties: ["Finesse"], cost: "25 gp", weight: "2 lb.", width: 1, height: 2 },
        { name: "Scimitar", type: "weapon", damage: "1d6", damageType: "slashing", properties: ["Finesse", "Light"], cost: "25 gp", weight: "3 lb.", width: 1, height: 2 },
        { name: "Shortsword", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Finesse", "Light"], cost: "10 gp", weight: "2 lb.", width: 1, height: 2 },
        { name: "Trident", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Thrown (range 20/60)", "Versatile (1d8)"], cost: "5 gp", weight: "4 lb." , width: 1, height: 3},
        { name: "War pick", type: "weapon", damage: "1d8", damageType: "piercing", properties: [], cost: "5 gp", weight: "2 lb.", width: 1, height: 2 },
        { name: "Warhammer", type: "weapon", damage: "1d8", damageType: "bludgeoning", properties: ["Versatile (1d10)"], cost: "15 gp", weight: "2 lb." , width: 1, height: 2},
        { name: "Whip", type: "weapon", damage: "1d4", damageType: "slashing", properties: ["Finesse", "Reach"], cost: "2 gp", weight: "3 lb.", width: 1, height: 1 },
        { name: "Blowgun", type: "weapon", damage: "1", damageType: "piercing", properties: ["Ammunition (range 25/100)", "Loading"], cost: "10 gp", weight: "1 lb.", width: 3, height: 1 },
        { name: "Crossbow hand", type: "weapon", damage: "1d6", damageType: "piercing", properties: ["Ammunition (range 30/120)", "Light", "Loading"], cost: "75 gp", weight: "3 lb.", width: 1, height: 1 },
        { name: "Crossbow heavy", type: "weapon", damage: "1d10", damageType: "piercing", properties: ["Ammunition (range 100/400)", "Heavy", "Loading", "Two-handed"], cost: "50 gp", weight: "18 lb.", width: 2, height: 2 },
        { name: "Longbow", type: "weapon", damage: "1d8", damageType: "piercing", properties: ["Ammunition (range 150/600)", "Heavy", "Two-handed"], cost: "50 gp", weight: "2 lb." , width: 1, height: 3},
        { name: "Net", type: "weapon", damage: "0", damageType: "0", properties: ["Special", "Thrown (range 5/15)"], cost: "1 gp", weight: "3 lb." , width: 1, height: 1},
        // Armor
        { name: "Padded", type: "armor", armorType: "Light", ac: 11, addDex: true, stealthDisadvantage: true, cost: "5 gp", weight: "8 lb." , width: 2, height: 2 },
        { name: "Leather", type: "armor", armorType: "Light", ac: 11, addDex: true, stealthDisadvantage: false, cost: "10 gp", weight: "10 lb." , width: 2, height: 2 },
        { name: "Studded leather", type: "armor", armorType: "Light", ac: 12, addDex: true, stealthDisadvantage: false, cost: "45 gp", weight: "13 lb." , width: 2, height: 2  },
        { name: "Hide", type: "armor", armorType: "Medium", ac: 12, addDex: true, maxDex: 2, stealthDisadvantage: false, cost: "10 gp", weight: "12 lb." , width: 2, height: 2 },
        { name: "Chain shirt", type: "armor", armorType: "Medium", ac: 13, addDex: true, maxDex: 2, stealthDisadvantage: false, cost: "50 gp", weight: "20 lb." , width: 2, height: 2  },
        { name: "Scale mail", type: "armor", armorType: "Medium", ac: 14, addDex: true, maxDex: 2, stealthDisadvantage: true, cost: "50 gp", weight: "45 lb." , width: 2, height: 2  },
        { name: "Breastplate", type: "armor", armorType: "Medium", ac: 14, addDex: true, maxDex: 2, stealthDisadvantage: false, cost: "400 gp", weight: "20 lb." , width: 2, height: 2  },
        { name: "Half plate", type: "armor", armorType: "Medium", ac: 15, addDex: true, maxDex: 2, stealthDisadvantage: true, cost: "750 gp", weight: "40 lb." , width: 2, height: 2  },
        { name: "Ring mail", type: "armor", armorType: "Heavy", ac: 14, addDex: false, stealthDisadvantage: true, cost: "30 gp", weight: "40 lb." , width: 2, height: 2 },
        { name: "Chain mail", type: "armor", armorType: "Heavy", ac: 16, addDex: false, stealthDisadvantage: true, strengthRequirement: 13, cost: "75 gp", weight: "55 lb." , width: 2, height: 2 },
        { name: "Splint", type: "armor", armorType: "Heavy", ac: 17, addDex: false, stealthDisadvantage: true, strengthRequirement: 15, cost: "200 gp", weight: "60 lb." , width: 2, height: 2 },
        { name: "Plate", type: "armor", armorType: "Heavy", ac: 18, addDex: false, stealthDisadvantage: true, strengthRequirement: 15, cost: "1,500 gp", weight: "65 lb." , width: 2, height: 2 },
        { name: "Shield", type: "armor", armorType: "Shield", ac: 2, addDex: false, stealthDisadvantage: false, cost: "10 gp", weight: "6 lb." , width: 2, height: 2  },
        // Other items
        { name: "Backpack", type: "gear", cost: "2 gp", weight: "5 lb." , width: 2, height: 2 },
        { name: "Bedroll", type: "gear", cost: "1 gp", weight: "7 lb." , width: 2, height: 1 },
        { name: "Mess kit", type: "gear", cost: "2 sp", weight: "1 lb.", width: 1, height: 1  },
        { name: "Tinderbox", type: "gear", cost: "5 sp", weight: "1 lb.", width: 1, height: 1 },
        { name: "Torch", type: "gear", cost: "1 cp", weight: "1 lb.", width: 1, height: 2  },
        { name: "Rations", type: "gear", cost: "5 sp", weight: "2 lb.", width: 1, height: 1 },
        { name: "Waterskin", type: "gear", cost: "2 sp", weight: "5 lb. (full)", width: 1, height: 1  },
        { name: "Rope hemp", type: "gear", cost: "1 gp", weight: "10 lb.", width: 2, height: 2  },
        { name: "Rope silk", type: "gear", cost: "10 gp", weight: "5 lb." , width: 2, height: 2 },
        { name: "Climber's kit", type: "gear", cost: "25 gp", weight: "12 lb." , width: 1, height: 1 },
        { name: "Fishing tackle", type: "gear", cost: "1 gp", weight: "4 lb.", width: 1, height: 1  },
        { name: "Healer's kit", type: "gear", cost: "5 gp", weight: "3 lb.", width: 2, height: 1  },
        { name: "Herbalism kit", type: "gear", cost: "5 gp", weight: "3 lb." , width: 1, height: 1 },
        { name: "Disguise kit", type: "gear", cost: "25 gp", weight: "3 lb.", width: 2, height: 2  },
        { name: "Forgery kit", type: "gear", cost: "15 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Alchemist's supplies", type: "gear", cost: "50 gp", weight: "8 lb.", width: 1, height: 1  },
        { name: "Brewer's supplies", type: "gear", cost: "20 gp", weight: "9 lb.", width: 2, height: 2  },
        { name: "Calligrapher's supplies", type: "gear", cost: "10 gp", weight: "5 lb." , width: 1, height: 1 },
        { name: "Carpenter's tools", type: "gear", cost: "8 gp", weight: "6 lb.", width: 1, height: 1  },
        { name: "Cartographer's tools", type: "gear", cost: "15 gp", weight: "6 lb." , width: 2, height: 1 },
        { name: "Cobbler's tools", type: "gear", cost: "5 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Cook's utensils", type: "gear", cost: "1 gp", weight: "8 lb.", width: 2, height: 2  },
        { name: "Glassblower's tools", type: "gear", cost: "30 gp", weight: "5 lb." , width: 3, height: 1 },
        { name: "Jeweler's tools", type: "gear", cost: "25 gp", weight: "2 lb.", width: 1, height: 1  },
        { name: "Leatherworker's tools", type: "gear", cost: "5 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Mason's tools", type: "gear", cost: "10 gp", weight: "8 lb." , width: 1, height: 1 },
        { name: "Painter's supplies", type: "gear", cost: "10 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Potter's tools", type: "gear", cost: "10 gp", weight: "3 lb.", width: 1, height: 1  },
        { name: "Smith's tools", type: "gear", cost: "20 gp", weight: "8 lb." , width: 1, height: 1 },
        { name: "Tinker's tools", type: "gear", cost: "50 gp", weight: "10 lb.", width: 1, height: 1  },
        { name: "Weaver's tools", type: "gear", cost: "1 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Woodcarver's tools", type: "gear", cost: "1 gp", weight: "5 lb.", width: 1, height: 1  },
        { name: "Navigator's tools", type: "gear", cost: "25 gp", weight: "2 lb.", width: 1, height: 1  },
        { name: "Thieves' tools", type: "gear", cost: "25 gp", weight: "1 lb.", width: 2, height: 1  },
        { name: "Musical instrument", type: "gear", cost: "varies", weight: "varies", width: 1, height: 2  }
    ];

    const skills = [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History",
        "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception",
        "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
    ];

    const feats = [
        { name: "Alert", description: "+5 to initiative, can't be surprised while conscious, no advantage for hidden attackers", appliesTo: "All classes", level: "Any" },
        { name: "Athlete", description: "Increase Strength or Dexterity by 1, standing up from prone uses only 5 feet of movement, climbing doesn't halve speed, running long jumps only require 5 feet", appliesTo: "All classes", level: "Any" },
        { name: "Actor", description: "Increase Charisma by 1, advantage on Charisma (Deception) and Charisma (Performance) checks to pass yourself off as a different person, mimic the speech of another person or creature", appliesTo: "Bard, Rogue", level: "Any" },
        { name: "Charger", description: "When you Dash, you can use a bonus action to make a melee attack or shove a creature, gain +5 bonus to the attack's damage roll or push target up to 10 feet", appliesTo: "All classes", level: "Any" },
        { name: "Crossbow Expert", description: "Ignore the loading property of crossbows, no disadvantage on ranged attacks when within 5 feet of a hostile creature, make a ranged attack as a bonus action after attacking with a one-handed weapon", appliesTo: "Fighter, Ranger, Rogue", level: "Any" },
        { name: "Defensive Duelist", description: "If you are wielding a finesse weapon, use your reaction to add your proficiency bonus to AC against a melee attack", appliesTo: "Fighter, Rogue", level: "Any" },
        { name: "Dual Wielder", description: "+1 to AC while wielding a separate melee weapon in each hand, use two-weapon fighting with non-light melee weapons, draw or stow two one-handed weapons at once", appliesTo: "Fighter, Ranger", level: "Any" },
        { name: "Dungeon Delver", description: "Advantage on Perception and Investigation checks to detect secret doors, advantage on saving throws to avoid or resist traps, resistance to damage dealt by traps", appliesTo: "Rogue, Ranger", level: "Any" },
        { name: "Durable", description: "Increase Constitution by 1, regain at least twice your Constitution modifier when rolling Hit Dice to recover HP", appliesTo: "All classes", level: "Any" },
        { name: "Elemental Adept", description: "Ignore resistance to a chosen elemental damage type (acid, cold, fire, lightning, or thunder), treat any 1 rolled on damage dice of that type as a 2", appliesTo: "Sorcerer, Wizard, Druid", level: "Any" },
        { name: "Grappler", description: "Advantage on attack rolls against creatures you are grappling, use an action to try to pin a creature grappled by you", appliesTo: "Barbarian, Fighter", level: "Any" },
        { name: "Great Weapon Master", description: "When you score a critical hit or reduce a creature to 0 hit points, make another melee weapon attack as a bonus action, take a -5 penalty to attack rolls for +10 damage", appliesTo: "Barbarian, Fighter", level: "Any" },
        { name: "Healer", description: "Use a healer's kit to stabilize a dying creature, restore 1d6+4 hit points to a creature (plus additional hit points equal to the target's maximum number of Hit Dice)", appliesTo: "Cleric, Druid", level: "Any" },
        { name: "Heavily Armored", description: "Increase Strength by 1, gain proficiency with heavy armor", appliesTo: "Cleric (if lacking proficiency), Warlock (if pact of the blade)", level: "Any" },
        { name: "Heavy Armor Master", description: "Increase Strength by 1, while wearing heavy armor, reduce bludgeoning, piercing, and slashing damage by 3", appliesTo: "Fighter, Paladin", level: "Any" },
        { name: "Inspiring Leader", description: "Spend 10 minutes inspiring up to 6 friendly creatures, grant temporary hit points equal to your level + Charisma modifier", appliesTo: "Bard, Paladin, Sorcerer", level: "Any" },
        { name: "Keen Mind", description: "Increase Intelligence by 1, recall anything you've seen or heard in the past month, always know which way is north and the number of hours left before sunset", appliesTo: "Wizard, Druid", level: "Any" },
        { name: "Lightly Armored", description: "Increase Strength or Dexterity by 1, gain proficiency with light armor", appliesTo: "Sorcerer, Wizard", level: "Any" },
        { name: "Linguist", description: "Increase Intelligence by 1, learn three languages, create written ciphers that can be deciphered only by creatures trained in the language or magic", appliesTo: "Wizard, Rogue", level: "Any" },
        { name: "Lucky", description: "Have 3 luck points that can be spent to reroll an attack roll, ability check, or saving throw, or force a reroll for an attack made against you", appliesTo: "All classes", level: "Any" },
        { name: "Mage Slayer", description: "When a creature within 5 feet of you casts a spell, use your reaction to make a melee weapon attack against it, impose disadvantage on a creature's concentration saving throws", appliesTo: "Fighter, Barbarian", level: "Any" },
        { name: "Magic Initiate", description: "Learn two cantrips and one 1st-level spell from the spell list of a class of your choice", appliesTo: "All classes", level: "Any" },
        { name: "Martial Adept", description: "Learn two maneuvers from the Battle Master archetype, gain one superiority die", appliesTo: "Fighter, Rogue", level: "Any" },
        { name: "Medium Armor Master", description: "Wear medium armor without imposing disadvantage on Dexterity (Stealth) checks, gain +3 Dexterity modifier bonus to AC instead of +2", appliesTo: "Fighter, Ranger", level: "Any" },
        { name: "Mobile", description: "Increase your speed by 10 feet, Dash doesn't provoke opportunity attacks, melee attack against a creature doesn't require disengage to move away", appliesTo: "Monk, Rogue", level: "Any" },
        { name: "Moderately Armored", description: "Increase Strength or Dexterity by 1, gain proficiency with medium armor and shields", appliesTo: "Sorcerer, Wizard", level: "Any" },
        { name: "Mounted Combatant", description: "Advantage on melee attack rolls against unmounted creatures smaller than your mount, force attacks targeting your mount to target you instead, halve damage taken by your mount", appliesTo: "Paladin, Fighter", level: "Any" },
        { name: "Observant", description: "Increase Intelligence or Wisdom by 1, lip-read, +5 bonus to passive Wisdom (Perception) and Intelligence (Investigation)", appliesTo: "Cleric, Druid, Wizard", level: "Any" },
        { name: "Polearm Master", description: "Make an opportunity attack when a creature enters your reach, use a bonus action to make a melee attack with the opposite end of a polearm", appliesTo: "Fighter, Paladin", level: "Any" },
        { name: "Resilient", description: "Increase an ability score of your choice by 1, gain proficiency in saving throws using that ability", appliesTo: "All classes", level: "Any" },
        { name: "Ritual Caster", description: "Learn two rituals from a class's spell list, must have a spellcasting feature", appliesTo: "Wizard, Cleric, Druid", level: "Any" },
        { name: "Savage Attacker", description: "Reroll the damage dice of a melee weapon attack and use the higher result once per turn", appliesTo: "Barbarian, Fighter", level: "Any" },
        { name: "Sentinel", description: "When a creature within 5 feet of you attacks someone else, make a melee weapon attack against it, reduce the speed of a hit target to 0, provoke opportunity attacks when leaving reach", appliesTo: "Fighter, Paladin", level: "Any" },
        { name: "Sharpshooter", description: "No disadvantage on ranged weapon attacks at long range, ignore half cover and three-quarters cover, take a -5 penalty to attack rolls for +10 damage", appliesTo: "Ranger, Fighter", level: "Any" },
        { name: "Shield Master", description: "Add your shield's AC bonus to Dexterity saving throws, use a bonus action to shove a creature after attacking, use a reaction to avoid damage from a Dexterity saving throw", appliesTo: "Fighter, Paladin", level: "Any" },
        { name: "Skilled", description: "Gain proficiency in any combination of three skills or tools", appliesTo: "All classes", level: "Any" },
        { name: "Skulker", description: "Hide when lightly obscured, attacking doesn't reveal your position, no disadvantage on ranged attack rolls while hidden", appliesTo: "Rogue, Ranger", level: "Any" },
        { name: "Spell Sniper", description: "Double the range of attack spells, ignore half and three-quarters cover when making spell attacks, learn one cantrip", appliesTo: "Sorcerer, Warlock, Wizard", level: "Any" },
        { name: "Tavern Brawler", description: "Increase Strength or Constitution by 1, proficiency with improvised weapons and unarmed strikes, deal 1d4 damage with unarmed strikes, use a bonus action to grapple a creature after hitting it", appliesTo: "Barbarian, Fighter", level: "Any" },
        { name: "Tough", description: "Increase your hit points by 2 per level", appliesTo: "All classes", level: "Any" },
        { name: "War Caster", description: "Advantage on Constitution saving throws to maintain concentration on spells, perform somatic components while holding weapons, cast spells as opportunity attacks", appliesTo: "Cleric, Druid, Wizard", level: "Any" },
        { name: "Weapon Master", description: "Increase Strength or Dexterity by 1, gain proficiency with four weapons of your choice", appliesTo: "All classes", level: "Any" }
    ];

    // function initializeUI() {
    //     populateDropdowns();
    //     setupEventListeners();
    //     setupAbilityScores();
    //     populateItemDropdown();
    //     loadRaces();
    //     document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
    //     adjustInventoryLayout();
    //     if (spells.length > 0) {
    //         displayCharacterSheet();
    //     }
    // }

    function initializeUI() {
        populateDropdowns();
        setupEventListeners();
        setupAbilityScores();
        populateItemDropdown();
        loadRaces();
        document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
        // We'll handle adjustInventoryLayout separately
        if (spells.length > 0) {
            displayCharacterSheet();
        }
    }

    function populateDropdowns() {
        populateDropdown('race', Object.keys(raceInfo));
        populateDropdown('class', Object.keys(classInfo));
        populateDropdown('background', Object.keys(backgroundInfo));
        populateDropdown('item-select', items.map(item => item.name));
    }

    function populateDropdown(id, options) {
        const select = document.getElementById(id);
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            select.appendChild(optionElement);
        });
    }

    function setupEventListeners() {
        const newCharacterBtn = document.getElementById('new-character-btn');
        const loadCharacterBtn = document.getElementById('load-character-btn');
        const randomCharacterBtn = document.getElementById('random-character-btn');
        const fileInput = document.getElementById('file-input');

        newCharacterBtn.addEventListener('click', startNewCharacter);
        loadCharacterBtn.addEventListener('click', () => fileInput.click());
        randomCharacterBtn.addEventListener('click', generateRandomCharacter);
        fileInput.addEventListener('change', loadCharacterFromFile);
        document.getElementById('random-name-btn').addEventListener('click', generateRandomName);
        document.getElementById('race').addEventListener('change', updateRaceInfo);
        document.getElementById('class').addEventListener('change', updateClassInfo);
        document.getElementById('level').addEventListener('change', updateSubclassOptions);
        document.getElementById('background').addEventListener('change', updateBackgroundInfo);
        document.getElementById('save-character').addEventListener('click', saveCharacter);
        document.getElementById('edit-character').addEventListener('click', editCharacter);
        document.getElementById('long-rest-btn').addEventListener('click', longRest);

        steps.forEach((step, index) => {
            if (index < steps.length - 1) {
                const nextButton = document.getElementById(`next${index + 1}`);
                if (nextButton) {
                    nextButton.addEventListener('click', () => nextStep(index));
                }
            }
        });

        document.getElementById('finish').addEventListener('click', finishCharacter);
    }

    function setupAbilityScores() {
        const abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const abilityScoresContainer = document.getElementById('ability-scores');
        
        abilityScores.forEach(ability => {
            const abilityDiv = document.createElement('div');
            abilityDiv.innerHTML = `
                <label for="${ability}">${ability.charAt(0).toUpperCase() + ability.slice(1)}:</label>
                <div class="dice" data-ability="${ability}"><i class="fas fa-dice-d20"></i></div>
                <span id="${ability}-score"></span>
                <div id="${ability}-buttons"></div>
            `;
            abilityScoresContainer.appendChild(abilityDiv);

            const dice = abilityDiv.querySelector('.dice');
            const scoreSpan = abilityDiv.querySelector(`#${ability}-score`);
            const buttonsDiv = abilityDiv.querySelector(`#${ability}-buttons`);

            dice.addEventListener('click', () => rollAbilityScore(ability, dice, scoreSpan, buttonsDiv));
        });
    }

    function startNewCharacter() {
        Object.keys(character).forEach(key => {
            if (Array.isArray(character[key])) {
                character[key] = [];
            } else if (typeof character[key] === 'object') {
                character[key] = {};
            } else {
                character[key] = '';
            }
        });
        character.level = 1;

        document.getElementById('character-name').value = '';
        document.getElementById('race').value = '';
        document.getElementById('class').value = '';
        document.getElementById('level').value = '1';
        document.getElementById('background').value = '';

        const abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        abilityScores.forEach(ability => {
            const dice = document.querySelector(`.dice[data-ability="${ability}"]`);
            const scoreSpan = document.getElementById(`${ability}-score`);
            const buttonsDiv = document.getElementById(`${ability}-buttons`);

            dice.style.display = 'inline-block';
            dice.style.pointerEvents = 'auto';
            dice.style.opacity = '1';
            scoreSpan.textContent = '';
            buttonsDiv.innerHTML = '';
        });

        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('character-creator').classList.remove('hidden');
        document.getElementById(steps[currentStep]).classList.remove('hidden');

        const randomNameBtn = document.getElementById('random-name-btn');
        if (randomNameBtn) {
            randomNameBtn.removeEventListener('click', generateRandomName);
            randomNameBtn.addEventListener('click', generateRandomName);
        }

        updateSubclassOptions();
    }

    function generateRandomName() {
        const names = ["Aric", "Bree", "Cade", "Dara", "Elara", "Finn", "Gwen", "Holt", "Ivy", "Jace", "Kira", "Lark", "Mira", "Nox", "Orion", "Piper", "Quinn", "Rook", "Sage", "Thorne"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        document.getElementById('character-name').value = randomName;
        character.name = randomName;
    }

    document.getElementById('class').addEventListener('change', updateSubclassOptions);
    document.getElementById('level').addEventListener('change', updateSubclassOptions);

    function loadCharacterFromFile(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    loadCharacterData(event.target.result);
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                    showNotification(`Error loading character file: ${error.message}`);
                }
            };
            reader.readAsText(file);
        }
    }

    function loadCharacterFromStorage() {
        const savedData = localStorage.getItem('savedCharacter');
        if (savedData) {
            try {
                loadCharacterData(savedData);
            } catch (error) {
                console.error('Error loading character from storage:', error);
                showNotification(`Error loading character: ${error.message}`);
            }
        } else {
            showNotification('No saved character found in local storage.');
        }
    }

    function loadCharacterData(data) {
        const loadedCharacter = JSON.parse(data);
        console.log('Loaded character data:', loadedCharacter);

        const requiredProps = ['name', 'race', 'class', 'level', 'abilityScores', 'inventory'];
        for (let prop of requiredProps) {
            if (!(prop in loadedCharacter)) {
                throw new Error(`Missing required property: ${prop}`);
            }
        }

        Object.assign(character, loadedCharacter);

        character.inventory = character.inventory.map(item => {
            if (typeof item === 'string') {
                return items.find(i => i.name === item) || { name: item, width: 1, height: 1, x: 0, y: 0 };
            }
            return {
                ...item,
                width: item.width || 1,
                height: item.height || 1,
                x: item.x || 0,
                y: item.y || 0
            };
        });

        if (!character.currency) {
            character.currency = { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0, gems: '' };
        }

        if (character.abilityScoreImprovementsLeft === undefined) {
            character.abilityScoreImprovementsLeft = 0;
        }

        character.spellSlots = calculateSpellSlots(character.class, character.level);

        displayLoadedCharacter();
        showNotification('Character loaded successfully!');
    }

    function displayLoadedCharacter() {
        document.getElementById('character-name').value = character.name;
        document.getElementById('race').value = character.race;
        document.getElementById('class').value = character.class;
        document.getElementById('level').value = character.level;
        document.getElementById('background').value = character.background;

        Object.entries(character.abilityScores).forEach(([ability, score]) => {
            const scoreSpan = document.getElementById(`${ability}-score`);
            if (scoreSpan) {
                scoreSpan.textContent = `${score} (Modifier: ${getModifierString(score)})`;
            }
        });

        updateRaceInfo();
        updateClassInfo();
        updateBackgroundInfo();
        updateSubclassOptions();
        updateSkillsAndFeats();

        document.getElementById('character-creator').classList.add('hidden');
        document.getElementById('character-sheet').classList.remove('hidden');
        displayCharacterSheet();
        setupInventoryManager();
        document.getElementById('start-menu').classList.add('hidden');

        if (isSpellcaster(character.class)) {
            updateSpellSlots();
        }

        updateAbilityScoreImprovementButtons();
    }

    function editCharacterName() {
    // window.editCharacterName = function() {
        const newName = prompt("Enter a name for your character:");
        if (newName !== null) {
            character.name = newName.trim() || '';
            updateCharacterName();
        }
    }

    window.generateRandomName = function() {
        character.name = getRandomNameDice();
        updateCharacterName();
    }

    function getRandomNameDice() {
        const names = ["Aric", "Bree", "Cade", "Dara", "Elara", "Finn", "Gwen", "Holt", "Ivy", "Jace", "Kira", "Lark", "Mira", "Nox", "Orion", "Piper", "Quinn", "Rook", "Sage", "Thorne"];
        return names[Math.floor(Math.random() * names.length)];
    }

    function updateCharacterName() {
        const characterNameDisplay = document.getElementById('character-name-display');
        if (characterNameDisplay) {
            characterNameDisplay.textContent = character.name || 'Unnamed';
        }
        displayCharacterSheet();
    }

    function generateRandomName() {
        const names = ["Aric", "Bree", "Cade", "Dara", "Elara", "Finn", "Gwen", "Holt", "Ivy", "Jace", "Kira", "Lark", "Mira", "Nox", "Orion", "Piper", "Quinn", "Rook", "Sage", "Thorne"];
        document.getElementById('character-name').value = names[Math.floor(Math.random() * names.length)];
    }

    function updateRaceInfo() {
        const selectedRace = document.getElementById('race').value;
        const raceInfoDiv = document.getElementById('race-info');

        if (races[selectedRace]) {
            const raceData = races[selectedRace];
            raceInfoDiv.innerHTML = `
                <p>${raceData.description || 'No description available.'}</p>
                ${raceData.traits ? `
                    <h4>Racial Traits:</h4>
                    <ul>
                        ${Object.entries(raceData.traits).map(([trait, value]) => `<li>${trait}: ${JSON.stringify(value)}</li>`).join('')}
                    </ul>
                ` : ''}
            `;
        } else {
            raceInfoDiv.textContent = "Select a race to see information.";
        }
    }

    function updateClassInfo() {
        const selectedClass = document.getElementById('class').value;
        const classInfoDiv = document.getElementById('class-info');
        classInfoDiv.textContent = classInfo[selectedClass] || "Select a class to see information.";
    }

    function updateSubclassOptions() {
        const selectedClass = document.getElementById('class').value;
        const selectedLevel = parseInt(document.getElementById('level').value);
        const subclassOptionsDiv = document.getElementById('subclass-options');
        subclassOptionsDiv.innerHTML = '';

        const subclasses = getSubclasses(selectedClass);
        if (subclasses.length > 0 && selectedLevel >= 3) {
            const subclassSelect = document.createElement('select');
            subclassSelect.id = 'subclass';
            subclassSelect.innerHTML = '<option value="">Select a subclass</option>';
            subclasses.forEach(subclass => {
                const option = document.createElement('option');
                option.value = subclass.name;
                option.textContent = subclass.name;
                subclassSelect.appendChild(option);
            });
            subclassOptionsDiv.appendChild(subclassSelect);

            const subclassInfoDiv = document.createElement('div');
            subclassInfoDiv.id = 'subclass-info';
            subclassInfoDiv.classList.add('info-area');
            subclassOptionsDiv.appendChild(subclassInfoDiv);

            subclassSelect.addEventListener('change', () => {
                const selectedSubclass = subclasses.find(sc => sc.name === subclassSelect.value);
                subclassInfoDiv.textContent = selectedSubclass ? selectedSubclass.description : '';
                character.subclass = selectedSubclass ? selectedSubclass.name : '';
            });
        } else {
            subclassOptionsDiv.innerHTML = '<p>Subclass options are available at level 3.</p>';
        }
    }

    function getSubclasses(className) {
        const subclasses = {
            artificer: [
                { name: "Alchemist", description: "Artificers who specialize in potions and transformative alchemy." },
                { name: "Armorer", description: "Artificers who create and enhance magical armor to become living suits of combat." },
                { name: "Artillerist", description: "Experts in crafting magical artillery, using cannons and explosives." },
                { name: "Battle Smith", description: "Artificers who focus on crafting magical weapons and mechanical companions." }
            ],
            barbarian: [
                { name: "Path of the Berserker", description: "A frenzy of rage that channels primal ferocity." },
                { name: "Path of the Totem Warrior", description: "A spiritual connection with nature and animal totems." },
                { name: "Path of the Ancestral Guardian", description: "Barbarians guided by ancestral spirits in battle." },
                { name: "Path of the Storm Herald", description: "Warriors who harness the power of nature's storms." },
                { name: "Path of the Zealot", description: "Fueled by divine rage, these barbarians fight for their gods." },
                { name: "Path of the Beast", description: "Barbarians with bestial abilities from a primal force." },
                { name: "Path of Wild Magic", description: "Barbarians who unleash magical chaos in battle." }
            ],
            bard: [
                { name: "College of Lore", description: "Masters of knowledge and arcane secrets." },
                { name: "College of Valor", description: "Inspirational warriors who lead through heroic deeds." },
                { name: "College of Glamour", description: "Bards who use fey magic to beguile and inspire." },
                { name: "College of Swords", description: "Skilled duelists who combine swordplay and performance." },
                { name: "College of Whispers", description: "Bards who manipulate fear and secrets to control others." },
                { name: "College of Creation", description: "Bards who harness the magic of creation itself." },
                { name: "College of Eloquence", description: "Silver-tongued bards who excel in rhetoric and persuasion." }
            ],
            cleric: [
                { name: "Knowledge Domain", description: "Seekers of truth and keepers of ancient lore." },
                { name: "Life Domain", description: "Supreme healers blessed with divine power." },
                { name: "Light Domain", description: "Guardians against darkness, wielding radiant energy." },
                { name: "Nature Domain", description: "Clerics attuned to the natural world and its power." },
                { name: "Tempest Domain", description: "Wielders of stormy power, commanding thunder and lightning." },
                { name: "Trickery Domain", description: "Clerics of deception, illusion, and mischief." },
                { name: "War Domain", description: "Clerics who lead armies and channel divine wrath in battle." },
                { name: "Forge Domain", description: "Masters of creation and craftsmanship blessed by the gods." },
                { name: "Grave Domain", description: "Guardians of the line between life and death." },
                { name: "Order Domain", description: "Clerics who uphold law and maintain divine justice." },
                { name: "Peace Domain", description: "Clerics devoted to harmony and reducing conflict." },
                { name: "Twilight Domain", description: "Clerics who balance light and darkness, guarding the transition." }
            ],
            druid: [
                { name: "Circle of the Land", description: "Mystics attuned to specific natural environments." },
                { name: "Circle of the Moon", description: "Shapeshifters who embody the raw power of nature." },
                { name: "Circle of Dreams", description: "Druids connected to the Feywild and the magic of dreams." },
                { name: "Circle of the Shepherd", description: "Druids who call upon nature's spirits to protect and heal." },
                { name: "Circle of Spores", description: "Druids who harness decay and fungal growth to fight." },
                { name: "Circle of Stars", description: "Druids who draw power from the constellations and cosmos." },
                { name: "Circle of Wildfire", description: "Druids attuned to the cycle of destruction and rebirth through fire." }
            ],
            fighter: [
                { name: "Champion", description: "Masters of physical perfection and combat prowess." },
                { name: "Battle Master", description: "Tactical experts who use maneuvers to control the battlefield." },
                { name: "Eldritch Knight", description: "Warriors who combine martial skills with arcane magic." },
                { name: "Arcane Archer", description: "Archers who infuse their arrows with magical energy." },
                { name: "Cavalier", description: "Knights skilled in mounted combat and chivalry." },
                { name: "Samurai", description: "Warriors driven by a relentless fighting spirit and discipline." },
                { name: "Echo Knight", description: "Fighters who summon echoes of themselves to assist in battle." },
                { name: "Rune Knight", description: "Fighters who harness the ancient power of runes." },
                { name: "Psi Warrior", description: "Fighters who use psionic energy to enhance their combat abilities." }
            ],
            monk: [
                { name: "Way of the Open Hand", description: "Masters of martial arts techniques." },
                { name: "Way of Shadow", description: "Stealthy monks who manipulate darkness and deception." },
                { name: "Way of the Four Elements", description: "Monks who channel elemental forces in their martial arts." },
                { name: "Way of the Long Death", description: "Monks who study and manipulate the cycle of life and death." },
                { name: "Way of the Sun Soul", description: "Monks who channel radiant energy into destructive blasts." },
                { name: "Way of Mercy", description: "Monks who blend martial arts with healing or harm through ki." },
                { name: "Way of the Astral Self", description: "Monks who project their soul into an astral form to fight." }
            ],
            paladin: [
                { name: "Oath of Devotion", description: "Paragons of knightly virtue and righteousness." },
                { name: "Oath of the Ancients", description: "Guardians of nature and light against darkness." },
                { name: "Oath of Vengeance", description: "Paladins who seek retribution against great wrongs." },
                { name: "Oath of Conquest", description: "Paladins who seek to dominate their foes and crush all opposition." },
                { name: "Oath of Redemption", description: "Paladins who offer peace and seek to redeem their enemies." },
                { name: "Oath of the Crown", description: "Paladins sworn to protect civilization and the rule of law." },
                { name: "Oathbreaker", description: "Paladins who have forsaken their oaths to pursue darker ambitions." },
                { name: "Oath of Glory", description: "Paladins who seek to achieve legendary feats and inspire others." },
                { name: "Oath of the Watchers", description: "Paladins who protect the material plane from extraplanar threats." }
            ],
            ranger: [
                { name: "Hunter", description: "Specialized warriors against dangerous prey." },
                { name: "Beast Master", description: "Rangers with a deep connection to an animal companion." },
                { name: "Gloom Stalker", description: "Rangers who strike from the shadows, thriving in darkness." },
                { name: "Horizon Walker", description: "Rangers who protect the material plane from extraplanar threats." },
                { name: "Monster Slayer", description: "Rangers skilled in fighting supernatural threats." },
                { name: "Fey Wanderer", description: "Rangers with fey magic who traverse both the material and fey realms." },
                { name: "Swarmkeeper", description: "Rangers who are bonded with a swarm of nature spirits or creatures." }
            ],
            rogue: [
                { name: "Thief", description: "Masters of stealth, agility, and burglary." },
                { name: "Assassin", description: "Stealthy killers skilled in disguise and poison." },
                { name: "Arcane Trickster", description: "Rogues who combine stealth and magic in their tricks." },
                { name: "Mastermind", description: "Strategists and schemers skilled in manipulation." },
                { name: "Swashbuckler", description: "Daring rogues who specialize in one-on-one combat." },
                { name: "Inquisitive", description: "Rogues who excel at rooting out secrets and hidden truths." },
                { name: "Scout", description: "Skilled explorers and survivalists who thrive in the wilderness." },
                { name: "Phantom", description: "Rogues who have a connection to death and the spirits of the dead." },
                { name: "Soulknife", description: "Rogues who wield psychic energy as weapons." }
            ],
            sorcerer: [
                { name: "Draconic Bloodline", description: "Sorcerers with the power of dragons in their veins." },
                { name: "Wild Magic", description: "Chaotic spellcasters with unpredictable magical effects." },
                { name: "Divine Soul", description: "Sorcerers who carry the power of the divine in their blood." },
                { name: "Shadow Magic", description: "Sorcerers who draw power from the Shadowfell." },
                { name: "Storm Sorcery", description: "Sorcerers who command the power of wind and lightning." },
                { name: "Aberrant Mind", description: "Sorcerers with psionic power and aberrant origins." },
                { name: "Clockwork Soul", description: "Sorcerers with magic derived from the order of Mechanus." }
            ],
            warlock: [
                { name: "The Archfey", description: "Servants of capricious and powerful fey entities." },
                { name: "The Fiend", description: "Those who have made pacts with infernal powers." },
                { name: "The Great Old One", description: "Warlocks who draw power from ancient, unknowable entities." },
                { name: "The Hexblade", description: "Warlocks bound to powerful magical weapons." },
                { name: "The Celestial", description: "Warlocks who have made pacts with angelic beings." },
                { name: "The Fathomless", description: "Warlocks connected to the dark powers of the deep sea." },
                { name: "The Genie", description: "Warlocks who have forged pacts with noble genies." }
            ],
            wizard: [
                { name: "School of Evocation", description: "Masters of powerful elemental magic." },
                { name: "School of Abjuration", description: "Experts in protective and warding magic." },
                { name: "School of Conjuration", description: "Wizards who specialize in summoning creatures and objects." },
                { name: "School of Divination", description: "Wizards who specialize in predicting the future." },
                { name: "School of Enchantment", description: "Wizards who charm and beguile the minds of others." },
                { name: "School of Illusion", description: "Wizards who master deception and illusionary magic." },
                { name: "School of Necromancy", description: "Wizards who manipulate life and death." },
                { name: "School of Transmutation", description: "Wizards who alter the physical properties of objects and creatures." },
                { name: "School of War Magic", description: "Wizards who blend defensive and offensive spells in battle." },
                { name: "Bladesinging", description: "Wizards who combine swordsmanship with spellcasting." },
                { name: "Order of Scribes", description: "Wizards dedicated to the study and transcription of magic." }
            ]
        };
        return subclasses[className] || [];
    }

    function updateBackgroundInfo() {
        const selectedBackground = document.getElementById('background').value;
        const backgroundInfoDiv = document.getElementById('background-info');
        backgroundInfoDiv.textContent = backgroundInfo[selectedBackground] || "Select a background to see information.";
    }

    function rollAbilityScore(ability, dice, scoreSpan, buttonsDiv) {
        if (character.abilityScores[ability]) return;

        const rolls = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
        rolls.sort((a, b) => b - a);
        const total = rolls[0] + rolls[1] + rolls[2];
        const modifier = Math.floor((total - 10) / 2);
        scoreSpan.textContent = `Roll: ${total} (Modifier: ${modifier >= 0 ? '+' : ''}${modifier})`;
        
        const button = document.createElement('button');
        button.textContent = total;
        button.classList.add('stat-value-btn');
        button.addEventListener('click', () => {
            character.abilityScores[ability] = total;
            dice.style.display = 'none';
            buttonsDiv.innerHTML = '';
            scoreSpan.textContent = `${total} (Modifier: ${modifier >= 0 ? '+' : ''}${modifier}) (Selected)`;
        });
        buttonsDiv.appendChild(button);

        if (buttonsDiv.children.length === 3) {
            dice.style.pointerEvents = 'none';
            dice.style.opacity = '0.5';
        }
    }

    function nextStep(index) {
        document.getElementById(steps[index]).classList.add('hidden');
        document.getElementById(steps[index + 1]).classList.remove('hidden');
        currentStep++;

        switch (index) {
            case 0:
                character.name = document.getElementById('character-name').value;
                character.race = document.getElementById('race').value;
                updateRaceInfo();
                break;
            case 1:
                character.class = document.getElementById('class').value;
                character.level = parseInt(document.getElementById('level').value);
                updateClassInfo();
                updateSubclassOptions();
                break;
            case 3:
                character.background = document.getElementById('background').value;
                updateBackgroundInfo();
                break;
            case 4:
                updateSkillsAndFeats();
                break;
            case 5:
                enterStep6();
                break;
        }
    }

    function enterStep6() {
        updateInventoryPreview();
    }

    function updateSkillsAndFeats() {
        const skillsSelection = document.getElementById('skills-selection');
        const featsSelection = document.getElementById('feats-selection');
        const skillCheckboxes = document.getElementById('skill-checkboxes');
        const featOptions = document.getElementById('feat-options');

        if (!skillsSelection || !featsSelection || !skillCheckboxes || !featOptions) {
            console.warn('Some elements for skills and feats are missing. Skipping update.');
            return;
        }

        skillsSelection.innerHTML = '<h3>Skills</h3><p>Select skills based on your class and background:</p>';
        featsSelection.innerHTML = '<h3>Feats</h3><p>Select feats if available at your level:</p>';

        const classSkills = getClassSkills(character.class);
        const backgroundSkills = getBackgroundSkills(character.background);
        const availableSkills = [...new Set([...classSkills, ...backgroundSkills])];

        skillCheckboxes.innerHTML = '';

        availableSkills.forEach(skill => {
            const skillCheckbox = document.createElement('input');
            skillCheckbox.type = 'checkbox';
            skillCheckbox.id = `skill-${skill}`;
            skillCheckbox.name = 'skills';
            skillCheckbox.value = skill;
            skillCheckbox.checked = character.skills.includes(skill);

            const skillLabel = document.createElement('label');
            skillLabel.htmlFor = `skill-${skill}`;
            skillLabel.textContent = skill;

            skillCheckboxes.appendChild(skillCheckbox);
            skillCheckboxes.appendChild(skillLabel);
            skillCheckboxes.appendChild(document.createElement('br'));
        });

        featOptions.innerHTML = '';

        if (character.level >= 4) {
            feats.forEach(feat => {
                const featCheckbox = document.createElement('input');
                featCheckbox.type = 'checkbox';
                featCheckbox.id = `feat-${feat.name}`;
                featCheckbox.name = 'feats';
                featCheckbox.value = feat.name;
                featCheckbox.checked = character.feats.includes(feat.name);

                const featLabel = document.createElement('label');
                featLabel.htmlFor = `feat-${feat.name}`;
                featLabel.textContent = `${feat.name}: ${feat.description}`;

                featOptions.appendChild(featCheckbox);
                featOptions.appendChild(featLabel);
                featOptions.appendChild(document.createElement('br'));
            });
        } else {
            featOptions.innerHTML = '<p>Feats are available starting at level 4.</p>';
        }
    }

    function getClassSkills(className) {
        const classSkills = {
            barbarian: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
            bard: skills,
            cleric: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
            druid: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
            fighter: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
            monk: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
            paladin: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
            ranger: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
            rogue: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"],
            sorcerer: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
            warlock: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
            wizard: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"]
        };
        return classSkills[className] || [];
    }

    function getBackgroundSkills(background) {
        const backgroundSkills = {
            acolyte: ["Insight", "Religion"],
            charlatan: ["Deception", "Sleight of Hand"],
            criminal: ["Deception", "Stealth"],
            entertainer: ["Acrobatics", "Performance"],
            "folk-hero": ["Animal Handling", "Survival"],
            "guild-artisan": ["Insight", "Persuasion"],
            hermit: ["Medicine", "Religion"],
            noble: ["History", "Persuasion"],
            outlander: ["Athletics", "Survival"],
            sage: ["Arcana", "History"],
            sailor: ["Athletics", "Perception"],
            soldier: ["Athletics", "Intimidation"],
            urchin: ["Sleight of Hand", "Stealth"],
            gladiator: ["Acrobatics", "Performance"],
            guard: ["Perception", "Insight"],
            spy: ["Deception", "Stealth"]
        };
        return backgroundSkills[background] || [];
    }

    function populateCombatPage() {
        const combatPage = document.getElementById('combat-page');
        combatPage.innerHTML = '<h3>Combat</h3>';

        const weaponsTable = document.createElement('table');
        weaponsTable.innerHTML = `
            <tr>
                <th style="width: 50%;">Weapon</th>
                <th style="width: 25%;">To Hit</th>
                <th style="width: 25%;">Damage</th>
            </tr>
        `;

        character.inventory.filter(item => item.type === 'weapon').forEach(weapon => {
            const row = weaponsTable.insertRow();
            row.innerHTML = `
                <td>${weapon.name} (${weapon.damage})</td>
                <td><button onclick="myApp.rollToHit('${weapon.name}')">Roll To Hit</button></td>
                <td><button onclick="myApp.rollDamage('${weapon.name}')">Roll Damage</button></td>
            `;
        });

        combatPage.appendChild(weaponsTable);

        const armorTable = document.createElement('table');
        armorTable.innerHTML = `
            <tr>
                <th>Armor</th>
                <th>AC</th>
            </tr>
        `;

        character.inventory.filter(item => item.type === 'armor').forEach(armor => {
            const row = armorTable.insertRow();
            row.innerHTML = `
                <td>${armor.name}</td>
                <td>${armor.ac}</td>
            `;
        });

        combatPage.appendChild(armorTable);

        if (isSpellcaster(character.class)) {
            const spellsTable = document.createElement('table');
            spellsTable.innerHTML = `
                <tr>
                    <th colspan="3">Spells</th>
                </tr>
                <tr>
                    <th style="width: 50%;">Spell</th>
                    <th style="width: 25%;">To Hit</th>
                    <th style="width: 25%;">Damage/Effect</th>
                </tr>
            `;

            character.spells.forEach(spell => {
                const row = spellsTable.insertRow();
                row.innerHTML = `
                    <td>${spell.name}</td>
                    <td><button onclick="myApp.rollSpellToHit('${spell.name}')">Roll To Hit</button></td>
                    <td><button onclick="myApp.rollSpellDamage('${spell.name}')">Roll Damage/Effect</button></td>
                `;
            });

            combatPage.appendChild(spellsTable);
        }
    }

    // function updateCombatPage() {
    //     populateCombatPage();
    // }

    function updateCombatPage() {
        const combatPage = document.getElementById('combat-page');
        if (!combatPage) {
            console.error('Combat page not found');
            return;
        }
    
        combatPage.innerHTML = '<h3>Combat</h3>';
    
        // Weapons section
        const weaponsTable = document.createElement('table');
        weaponsTable.innerHTML = `
            <tr>
                <th>Weapon</th>
                <th>To Hit</th>
                <th>Damage</th>
            </tr>
        `;
    
        character.inventory.filter(item => item.type === 'weapon').forEach(weapon => {
            const row = weaponsTable.insertRow();
            row.innerHTML = `
                <td>${weapon.name} (${weapon.damage})</td>
                <td><button onclick="myApp.rollToHit('${weapon.name}')">Roll To Hit</button></td>
                <td><button onclick="myApp.rollDamage('${weapon.name}')">Roll Damage</button></td>
            `;
        });
    
        combatPage.appendChild(weaponsTable);
    
        // Armor section
        const armorTable = document.createElement('table');
        armorTable.innerHTML = `
            <tr>
                <th>Armor</th>
                <th>AC</th>
            </tr>
        `;
    
        character.inventory.filter(item => item.type === 'armor').forEach(armor => {
            const row = armorTable.insertRow();
            row.innerHTML = `
                <td>${armor.name}</td>
                <td>${armor.ac}</td>
            `;
        });
    
        combatPage.appendChild(armorTable);
    
        // Spells section
        if (isSpellcaster(character.class) && character.spells.length > 0) {
            const spellsTable = document.createElement('table');
            spellsTable.innerHTML = `
                <tr>
                    <th colspan="3">Spells</th>
                </tr>
                <tr>
                    <th>Spell</th>
                    <th>Level</th>
                    <th>Action</th>
                </tr>
            `;
    
            character.spells.forEach(spell => {
                const row = spellsTable.insertRow();
                row.innerHTML = `
                    <td>${spell.name}</td>
                    <td>${spell.level}</td>
                    <td><button onclick="myApp.castSpell('${spell.name}')">Cast</button></td>
                `;
            });
    
            combatPage.appendChild(spellsTable);
        }
    }

    function setupInventoryManager() {
        console.log('Setting up inventory manager...');
        const inventoryCanvas = document.getElementById('inventory-canvas');
        if (!inventoryCanvas) {
            console.error('Inventory canvas not found');
            return;
        }
        const inventoryCtx = inventoryCanvas.getContext('2d');
    
        updateDPIInfo();
    
        // Set up canvas dimensions
        inventoryCanvas.width = dpiInfo.canvasSize * dpiInfo.dpr;
        inventoryCanvas.height = dpiInfo.canvasSize * dpiInfo.dpr;
        inventoryCanvas.style.width = `${dpiInfo.canvasSize}px`;
        inventoryCanvas.style.height = `${dpiInfo.canvasSize}px`;
        inventoryCtx.scale(dpiInfo.dpr, dpiInfo.dpr);
    
        let draggedItem = null;
        let dragOffset = { x: 0, y: 0 };
    
        function findAvailablePosition(item) {
            for (let y = 0; y <= GRID_SIZE - item.height; y++) {
                for (let x = 0; x <= GRID_SIZE - item.width; x++) {
                    if (canPlaceItem(item, x, y)) {
                        return { x, y };
                    }
                }
            }
            return null;
        }
    
        function canPlaceItem(item, x, y) {
            for (let i = 0; i < item.height; i++) {
                for (let j = 0; j < item.width; j++) {
                    if (isOccupied(x + j, y + i)) {
                        return false;
                    }
                }
            }
            return true;
        }
    
        function isOccupied(x, y) {
            return character.inventory.some(item =>
                x >= item.x && x < item.x + item.width &&
                y >= item.y && y < item.y + item.height
            );
        }
    
        function handleStart(e) {
            e.preventDefault();
            const rect = inventoryCanvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const x = Math.floor((clientX - rect.left) / dpiInfo.cellSize);
            const y = Math.floor((clientY - rect.top) / dpiInfo.cellSize);
    
            draggedItem = character.inventory.find(item =>
                x >= item.x && x < item.x + item.width &&
                y >= item.y && y < item.y + item.height
            );
    
            if (draggedItem) {
                dragOffset.x = x - draggedItem.x;
                dragOffset.y = y - draggedItem.y;
            }
        }
    
        function handleMove(e) {
            if (!draggedItem) return;
            e.preventDefault();
            const rect = inventoryCanvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const x = Math.floor((clientX - rect.left) / dpiInfo.cellSize);
            const y = Math.floor((clientY - rect.top) / dpiInfo.cellSize);
    
            draggedItem.x = Math.max(0, Math.min(x - dragOffset.x, GRID_SIZE - draggedItem.width));
            draggedItem.y = Math.max(0, Math.min(y - dragOffset.y, GRID_SIZE - draggedItem.height));
    
            drawGrid();
    
            if (checkOverlap(draggedItem) || !isWithinGrid(draggedItem)) {
                inventoryCtx.globalAlpha = 0.5;
                inventoryCtx.fillStyle = 'red';
                inventoryCtx.fillRect(draggedItem.x * dpiInfo.cellSize, draggedItem.y * dpiInfo.cellSize, draggedItem.width * dpiInfo.cellSize, draggedItem.height * dpiInfo.cellSize);
                inventoryCtx.globalAlpha = 1;
            }
        }
    
        function handleEnd() {
            if (draggedItem) {
                if (checkOverlap(draggedItem) || !isWithinGrid(draggedItem)) {
                    const originalPosition = character.inventory.find(item => item === draggedItem);
                    draggedItem.x = originalPosition.x;
                    draggedItem.y = originalPosition.y;
                }
                draggedItem = null;
                drawGrid();
                updateCharacterInventory();
                updateCombatPage();
            }
        }
    
        function checkOverlap(item) {
            return character.inventory.some(other => {
                if (other === item) return false;
                return !(item.x + item.width <= other.x || item.x >= other.x + other.width ||
                         item.y + item.height <= other.y || item.y >= other.y + other.height);
            });
        }
    
        function isWithinGrid(item) {
            return item.x >= 0 && item.y >= 0 && item.x + item.width <= GRID_SIZE && item.y + item.height <= GRID_SIZE;
        }
    
        // Set up event listeners
        inventoryCanvas.addEventListener('mousedown', handleStart);
        inventoryCanvas.addEventListener('touchstart', handleStart, { passive: false });
        inventoryCanvas.addEventListener('mousemove', handleMove);
        inventoryCanvas.addEventListener('touchmove', handleMove, { passive: false });
        inventoryCanvas.addEventListener('mouseup', handleEnd);
        inventoryCanvas.addEventListener('touchend', handleEnd);
        inventoryCanvas.addEventListener('click', handleItemClick);
    
        // Prevent default touch behavior
        inventoryCanvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    
        // Debug logging for touch events
        inventoryCanvas.addEventListener('touchstart', function(e) {
            console.log('Touch start', e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        inventoryCanvas.addEventListener('touchmove', function(e) {
            console.log('Touch move', e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        inventoryCanvas.addEventListener('touchend', function(e) {
            console.log('Touch end');
        }, { passive: false });
    
        populateItemDropdown();
    
        const addItemBtn = document.getElementById('character-sheet-add-item-btn');
        console.log('Add item button element:', addItemBtn);
        if (addItemBtn && !addItemBtn.hasEventListener) {
            console.log('Add item button found, adding event listener...');
            addItemBtn.addEventListener('click', function(event) {
                event.preventDefault();
                addItemToInventory();
            });
            addItemBtn.hasEventListener = true;
            console.log('Event listener added to add item button.');
        } else if (addItemBtn) {
            console.log('Add item button already has an event listener');
        } else {
            console.error('Add item button not found');
        }
    
        const itemSelect = document.getElementById('character-sheet-item-select');
        if (itemSelect) {
            itemSelect.addEventListener('change', function(event) {
                console.log('Selected item:', event.target.value);
            });
        }
    
        drawGrid();
    
        character.inventory.forEach((item, index) => {
            if (item.x === undefined || item.y === undefined || item.width === undefined || item.height === undefined) {
                console.warn(`Item ${item.name} is missing position or size information:`, item);
                const position = findAvailablePosition(item) || { x: Math.floor(index / GRID_SIZE), y: index % GRID_SIZE };
                item.x = position.x;
                item.y = position.y;
                item.width = item.width || 1;
                item.height = item.height || 1;
            }
        });
    
        console.log('Inventory after placement:', character.inventory);
        drawGrid();
        updateCharacterInventory();
        updateCombatPage();
    
        console.log('Canvas dimensions:', inventoryCanvas.width, 'x', inventoryCanvas.height);
        console.log('Grid size:', GRID_SIZE, 'x', GRID_SIZE, 'cells');
        console.log('Cell size:', dpiInfo.cellSize, 'pixels');
    }

    function handleItemClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        const clickedItem = character.inventory.find(item => 
            x >= item.x && x < item.x + item.width && 
            y >= item.y && y < item.y + item.height
        );

        if (clickedItem) {
            displayItemInfo(clickedItem);
        } else {
            const itemInfoDiv = document.getElementById('item-info');
            if (itemInfoDiv) {
                itemInfoDiv.innerHTML = 'No item selected. Click coordinates: ' + x + ', ' + y;
            }
        }
    }

    function drawGrid() {
        const inventoryCanvas = document.getElementById('inventory-canvas');
        const inventoryCtx = inventoryCanvas.getContext('2d');
    
        inventoryCtx.clearRect(0, 0, inventoryCanvas.width, inventoryCanvas.height);
        
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                inventoryCtx.strokeRect(
                    i * dpiInfo.cellSize, 
                    j * dpiInfo.cellSize, 
                    dpiInfo.cellSize, 
                    dpiInfo.cellSize
                );
            }
        }
        
        character.inventory.forEach(item => drawItem(item));
    }
    
    // old code to stretch images
    // function drawItem(item) {
    //     const inventoryCanvas = document.getElementById('inventory-canvas');
    //     const inventoryCtx = inventoryCanvas.getContext('2d');
    
    //     const imageName = item.name.replace(/'/g, '').replace(/ /g, '_') + '.png';
    //     const imagePath = `assets/images/${imageName}`;
    
    //     const img = new Image();
    //     img.onload = () => {
    //         inventoryCtx.drawImage(
    //             img, 
    //             item.x * dpiInfo.cellSize, 
    //             item.y * dpiInfo.cellSize, 
    //             item.width * dpiInfo.cellSize, 
    //             item.height * dpiInfo.cellSize
    //         );
    //     };
    //     img.onerror = () => {
    //         inventoryCtx.fillStyle = '#999';
    //         inventoryCtx.fillRect(
    //             item.x * dpiInfo.gridSize, 
    //             item.y * dpiInfo.gridSize, 
    //             item.width * dpiInfo.gridSize, 
    //             item.height * dpiInfo.gridSize
    //         );
    //         inventoryCtx.fillStyle = 'black';
    //         inventoryCtx.font = `${12 * dpiInfo.dpr}px Arial`;
    //         inventoryCtx.fillText(
    //             item.name, 
    //             item.x * dpiInfo.gridSize + 5, 
    //             item.y * dpiInfo.gridSize + 15
    //         );
    //     };
    //     img.src = imagePath;
    // }
    
// aspect ratio fitting
    function drawItem(item) {
        const inventoryCanvas = document.getElementById('inventory-canvas');
        const inventoryCtx = inventoryCanvas.getContext('2d');
    
        const imageName = item.name.replace(/'/g, '').replace(/ /g, '_') + '.png';
        const imagePath = `assets/images/${imageName}`;
    
        const img = new Image();
        img.onload = () => {
            // Calculate available space
            const availableWidth = item.width * dpiInfo.cellSize;
            const availableHeight = item.height * dpiInfo.cellSize;
    
            // Calculate image aspect ratio
            const imageAspectRatio = img.width / img.height;
    
            // Calculate scaled dimensions
            let drawWidth, drawHeight;
            if (availableWidth / availableHeight > imageAspectRatio) {
                // Fit to height
                drawHeight = availableHeight;
                drawWidth = availableHeight * imageAspectRatio;
            } else {
                // Fit to width
                drawWidth = availableWidth;
                drawHeight = availableWidth / imageAspectRatio;
            }
    
            // Calculate position to center the image
            const offsetX = (availableWidth - drawWidth) / 2;
            const offsetY = (availableHeight - drawHeight) / 2;
    
            // Draw the image scaled to fit within the available space
            inventoryCtx.drawImage(
                img, 
                item.x * dpiInfo.cellSize + offsetX, 
                item.y * dpiInfo.cellSize + offsetY, 
                drawWidth, 
                drawHeight
            );
        };
    
        img.onerror = () => {
            inventoryCtx.fillStyle = '#999';
            inventoryCtx.fillRect(
                item.x * dpiInfo.gridSize, 
                item.y * dpiInfo.gridSize, 
                item.width * dpiInfo.gridSize, 
                item.height * dpiInfo.gridSize
            );
            inventoryCtx.fillStyle = 'black';
            inventoryCtx.font = `${12 * dpiInfo.dpr}px Arial`;
            inventoryCtx.fillText(
                item.name, 
                item.x * dpiInfo.gridSize + 5, 
                item.y * dpiInfo.gridSize + 15
            );
        };
    
        img.src = imagePath;
    }
    


    function findAvailablePosition(item) {
        for (let y = 0; y <= GRID_SIZE - item.height; y++) {
            for (let x = 0; x <= GRID_SIZE - item.width; x++) {
                if (canPlaceItem(item, x, y)) {
                    return { x, y };
                }
            }
        }
        return null;
    }
    
    function canPlaceItem(item, x, y) {
        for (let i = 0; i < item.height; i++) {
            for (let j = 0; j < item.width; j++) {
                if (isOccupied(x + j, y + i)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function isOccupied(x, y) {
        return character.inventory.some(item =>
            x >= item.x && x < item.x + item.width &&
            y >= item.y && y < item.y + item.height
        );
    }

    function displayItemInfo(item) {
        console.log('Displaying item info:', item);
        const itemInfoDiv = document.getElementById('item-info');
        if (!itemInfoDiv) {
            console.error('item-info div not found');
            return;
        }
        let infoHtml = `
            <h4>${item.name}</h4>
            <p>Type: ${item.type}</p>
            <p>Weight: ${item.weight}</p>
            <p>Cost: ${item.cost}</p>
        `;

        if (item.type === 'weapon') {
            infoHtml += `
                <p>Damage: ${item.damage} ${item.damageType}</p>
                <p>Properties: ${item.properties.join(', ')}</p>
<button onclick="myApp.rollToHit('${item.name}')">Roll To Hit</button>
                <button onclick="myApp.rollDamage('${item.name}')">Roll Damage</button>
            `;
        } else if (item.type === 'armor') {
            infoHtml += `
                <p>AC: ${item.ac}</p>
                <p>Type: ${item.armorType}</p>
            `;
        }

        itemInfoDiv.innerHTML = infoHtml;
        console.log('Updated item-info HTML:', infoHtml);

        itemInfoDiv.style.border = '2px solid red';

        alert('Item info updated: ' + item.name);
    }

    function addItemToInventory() {
        console.log('addItemToInventory function called');

        const itemSelect = document.getElementById('character-sheet-item-select');
        console.log('Item select element:', itemSelect);

        if (!itemSelect) {
            console.error('Character sheet item select element not found');
            return;
        }

        const selectedItemName = itemSelect.value;
        console.log('Selected item name:', selectedItemName);

        const selectedItem = items.find(item => item.name === selectedItemName);
        console.log('Selected item object:', selectedItem);

        if (selectedItem) {
            const newItem = { 
                ...selectedItem, 
                x: 0, 
                y: 0
            };
            console.log("New item to be added:", newItem);
            const position = findAvailablePosition(newItem);
            if (position) {
                newItem.x = position.x;
                newItem.y = position.y;
                character.inventory.push(newItem);
                console.log("Item added to inventory:", newItem);
                drawGrid();
                updateCharacterInventory();
                showNotification(`${newItem.name} added to inventory.`);
                updateCombatPage();

                if (newItem.type === 'armor') {
                    updateCharacterAC(newItem);
                }
            } else {
                showNotification('No space available in the inventory!');
            }
        } else {
            console.log('No item selected or item not found');
            showNotification('Please select an item to add.');
        }
    }

    function updateCharacterInventory() {
        const inventoryDiv = document.getElementById('character-inventory');
        if (!inventoryDiv) {
            console.error('Character inventory div not found');
            return;
        }
        inventoryDiv.innerHTML = character.inventory.map((item, index) => `
            <div class="inventory-item">
                <span>${item.name}</span>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `).join('');

        inventoryDiv.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const removedItem = character.inventory[index];
                character.inventory.splice(index, 1);
                updateCharacterInventory();
                drawGrid();
    
                // If the removed item was armor, update the AC
                if (removedItem.type === 'armor') {
                    const newArmor = character.inventory.find(item => item.type === 'armor');
                    updateCharacterAC(newArmor);
                }
            });
        });
    }

    function updateCharacterAC(newArmor) {
        let baseAC = 10;
        const dexModifier = Math.floor((character.abilityScores.dexterity - 10) / 2);

        if (newArmor) {
            baseAC = newArmor.ac;
            if (newArmor.addDex) {
                if (newArmor.maxDex) {
                    character.ac = baseAC + Math.min(dexModifier, newArmor.maxDex);
                } else {
                    character.ac = baseAC + dexModifier;
                }
            } else {
                character.ac = baseAC;
            }
        } else {
            character.ac = baseAC + dexModifier;
        }

        const hasShield = character.inventory.some(item => item.name.toLowerCase() === 'shield');
        if (hasShield) {
            character.ac += 2;
        }

        const acElement = document.getElementById('character-ac');
        if (acElement) {
            acElement.textContent = character.ac;
        }
    }

    function finishCharacter() {
        character.skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(skill => skill.value);
        character.feats = Array.from(document.querySelectorAll('input[name="feats"]:checked')).map(feat => feat.value);

        character.maxHp = calculateHP(character.class, character.level, character.abilityScores.constitution);
        character.hp = character.maxHp;

        character.initiative = Math.floor((character.abilityScores.dexterity - 10) / 2);
        character.proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

        calculateSavingThrows();

        document.getElementById('step6').classList.add('hidden');
        document.getElementById('character-sheet').classList.remove('hidden');
        displayCharacterSheet();
        setupInventoryManager();

        character.inventory = [];
        character.inventory.push(items.find(item => item.name === "Dagger"));

        const classToolkits = {
            artificer: "Alchemist's supplies",
            barbarian: "Smith's tools",
            bard: "Musical instrument",
            cleric: "Healer's kit",
            druid: "Herbalism kit",
            fighter: "Smith's tools",
            monk: "Calligrapher's supplies",
            paladin: "Smith's tools",
            ranger: "Navigator's tools",
            rogue: "Thieves' tools",
            sorcerer: "Alchemist's supplies",
            warlock: "Alchemist's supplies",
            wizard: "Alchemist's supplies"
        };

        const toolkit = items.find(item => item.name === classToolkits[character.class]);
        if (toolkit) {
            character.inventory.push(toolkit);
        }
    }

    function displayCharacterSheet() {
        const attributesPage = document.getElementById('attributes-page');
        const skillsFeatsPage = document.getElementById('skills-feats-page');
        const inventoryPage = document.getElementById('inventory-page');
        const spellsPage = document.getElementById('spells-page');
        const notesPage = document.getElementById('notes-page');
        const rollResultsPage = document.getElementById('roll-results-page');

        const characterHeader = document.querySelector('.character-sheet-header');

        const displayName = character.name || 'Unnamed';
        const showNameButtons = !character.name || character.name === 'undefined';

        characterHeader.innerHTML = `
        <div class="character-info-row">
            <div class="character-name-section">
                <h2 id="character-name-display">${displayName}</h2>
                ${showNameButtons ? `
                    <div class="name-buttons">
                        <button onclick="myApp.editCharacterName()" class="small-button"><i class="bi bi-pencil"></i></button>
                        <button onclick="myApp.generateRandomName()" class="small-button"><i class="bi bi-dice-5"></i></button>
                    </div>
                ` : ''}
            </div>
            <div class="hp-section">
                <div>HP: <span id="current-hp">${character.hp}</span>/<span id="max-hp">${character.maxHp}</span></div>
                <div class="hp-buttons">
                    <button onclick="myApp.changeHP('damage')" class="small-button">Damage</button>
                    <button onclick="myApp.changeHP('heal')" class="small-button">Heal</button>
                </div>
            </div>
        </div>
        <h3 id="character-level-race-class">Level ${character.level} ${character.race} ${character.class}</h3>
        <div class="character-stats-grid">
            <div class="stat initiative-stat">
                <div>Initiative: +<span id="character-initiative">${character.initiative}</span></div>
                <button onclick="myApp.rollInitiative()" class="small-button">Roll</button>
            </div>
            <div class="stat combined-stat">
                <div>AC: <span id="character-ac">${character.ac}</span></div>
                <div>Speed: <span id="character-speed">${character.speed || 30}</span> ft.</div>
                <div>Prof: +<span id="character-proficiency">${character.proficiencyBonus}</span></div>
            </div>
        </div>
    `;

    // Update AC
    const equippedArmor = character.inventory.find(item => item.type === 'armor');
    updateCharacterAC(equippedArmor);

        const combatPage = document.createElement('div');
        combatPage.id = 'combat-page';
        combatPage.classList.add('category-page', 'hidden');
        document.querySelector('.character-sheet-content').appendChild(combatPage);

        attributesPage.innerHTML = `
            <div class="grid">
                ${Object.entries(character.abilityScores).map(([ability, score]) => `
                    <div class="ability-score">
                        <div>${ability.charAt(0).toUpperCase() + ability.slice(1)}</div>
                        <div id="${ability}-score" class="score">${score}</div>
                        <div class="modifier">${getModifierString(score)}</div>
                        <button onclick="myApp.rollAbility('${ability}', ${score})">Roll</button>
                    </div>
                `).join('')}
            </div>
        `;

        const savingThrowsHtml = `
            <h3>Saving Throws</h3>
            <div class="saving-throws-grid" style="width: 100%;">
                ${Object.entries(character.savingThrows).map(([ability, saveInfo], index) => {
                    const abilityScore = character.abilityScores[ability];
                    const modifier = getModifierString(abilityScore);
                    const proficiencyBonus = saveInfo.proficient ? character.proficiencyBonus : 0;
                    const totalModifier = modifier + proficiencyBonus;
                    const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

                    return `
                        ${index % 2 === 0 ? '<div class="saving-throws-row">' : ''}
                        <div class="saving-throw-column">
                            <button onclick="myApp.rollSavingThrow('${ability}')" class="${saveInfo.proficient ? 'saving-throw-proficient' : ''}">
                                ${ability.charAt(0).toUpperCase() + ability.slice(1)}: ${modifierString}
                            </button>
                        </div>
                        ${index % 2 === 1 || index === Object.entries(character.savingThrows).length - 1 ? '</div>' : ''}
                    `;
                }).join('')}
            </div>
        `;

        const savingThrowsSection = attributesPage.querySelector('.saving-throws');
        if (savingThrowsSection) {
            savingThrowsSection.outerHTML = savingThrowsHtml;
        } else {
            attributesPage.innerHTML += savingThrowsHtml;
        }

        const passivePerception = 10 + parseInt(getSkillModifier('Perception'));
        attributesPage.innerHTML += `
            <div class="passive-perception">
                <strong>Passive Perception (Wisdom):</strong> ${passivePerception}
            </div>
        `;

        updateSkillsAndFeatsPage();

        inventoryPage.innerHTML = `
        <div class="inventory-container">
            <div class="currency-row">
                <div id="currency-display">
                    CP: ${character.currency.copper}, SP: ${character.currency.silver}, EP: ${character.currency.electrum}, 
                    GP: ${character.currency.gold}, PP: ${character.currency.platinum}
                </div>
                <button id="edit-currency-btn" class="small-button">Edit Currency</button>
            </div>
            <div class="inventory-content">
                <div class="inventory-grid-section">
                    <canvas id="inventory-canvas" width="320" height="320"></canvas>
                </div>
                <div class="inventory-controls-section">
                    <div class="inventory-controls">
                        <select id="character-sheet-item-select"></select>
                        <button id="character-sheet-add-item-btn">Add Item</button>
                    </div>
                    <div id="character-inventory">
                        <!-- This is where your item list will be displayed -->
                    </div>
                </div>
            </div>
        </div>
    `;

// Add event listener for the edit currency button
document.getElementById('edit-currency-btn').addEventListener('click', showCurrencyModal);

        // function updateCurrency(type, value) {
        //     character.currency[type] = type === 'gems' ? value : parseInt(value);
        // }
        populateCharacterSheetItemDropdown();
        setupInventoryManager();
        populateCombatPage();
        
        if (isSpellcaster(character.class)) {
            const spellSlots = calculateSpellSlots(character.class, character.level);
            const spellsPage = document.getElementById('spells-page');
            spellsPage.innerHTML = `
                <div class="spells-container">
                    <div class="spell-slots-section">
                        <h4>Spell Slots</h4>
                        <div class="spell-slots-row">
                            <span>Cantrips: ${calculateCantrips(character.class, character.level)}</span>
                            ${[1,2,3,4,5,6,7,8,9].map(level => 
                                spellSlots[level] ? `
                                <button class="spell-level-btn" onclick="myApp.scrollToSpellLevel(${level})">
                                    ${level}: ${spellSlots[level]} / ${spellSlots[level]}
                                </button>` : ''
                            ).join('')}
                        </div>
                    </div>
                    <div class="spell-list-section">
                        <h4>Spells</h4>
                        <div class="spell-controls">
                            <select id="spell-select">
                                <option value="">Select a spell</option>
                            </select>
                            <button id="add-spell-btn">Add Spell</button>
                        </div>
                        <div id="spell-list" class="spell-list"></div>
                    </div>
                </div>
            `;
            populateSpellList();
            setupSpellManager();
        } else {
            document.getElementById('spells-page').innerHTML = `<p>This character does not have spellcasting abilities.</p>`;
        }

        const existingLevelUpSection = notesPage.querySelector('#level-up-section');
        if (existingLevelUpSection) {
            existingLevelUpSection.remove();
        }

        document.getElementById('character-notes').value = character.notes;

        rollResultsPage.innerHTML = `
            <h3>Roll Results</h3>
            <div id="roll-results"></div>
        `;

        const categoryPages = ['attributes-page', 'skills-feats-page', 'inventory-page', 'spells-page', 'combat-page','notes-page', 'roll-results-page'];
        let currentCategoryIndex = 0;

        notesPage.innerHTML = `
        <h3>Character Notes</h3>
        <div id="theme-controls" class="theme-controls">
            <div class="theme-selector">
                <label for="color-theme">Color Theme:</label>
                <select id="color-theme">
                    <option value="default">Default</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                </select>
            </div>
            <div class="mode-toggle">
                <label for="dark-mode-toggle">Dark Mode:</label>
                <input type="checkbox" id="dark-mode-toggle">
            </div>
        </div>
        <textarea id="character-notes" placeholder="Add your character notes here...">${character.notes}</textarea>
        <div class="notes-buttons">
            <button id="level-up-btn" onclick="myApp.levelUp()" class="small-button">Level Up</button>
            <button id="export-pdf-btn" class="small-button">Export to PDF</button>
        </div>
    `;


        document.getElementById('prev-category').addEventListener('click', () => {
            currentCategoryIndex = (currentCategoryIndex - 1 + categoryPages.length) % categoryPages.length;
            updateCategoryDisplay();
        });

        document.getElementById('next-category').addEventListener('click', () => {
            currentCategoryIndex = (currentCategoryIndex + 1) % categoryPages.length;
            updateCategoryDisplay();
        });

        function updateCategoryDisplay() {
            categoryPages.forEach(pageId => {
                const page = document.getElementById(pageId);
                if (page) {
                    page.classList.add('hidden');
                    page.classList.remove('active');
                }
            });
            const currentPage = document.getElementById(categoryPages[currentCategoryIndex]);
            if (currentPage) {
                currentPage.classList.remove('hidden');
                currentPage.classList.add('active');
                
                // Initialize theme controls when the notes page is displayed
                if (categoryPages[currentCategoryIndex] === 'notes-page') {
                    // safeInitializeThemeControls();
                }
            }
            document.getElementById('category-name').textContent = categoryPages[currentCategoryIndex].split('-')[0].charAt(0).toUpperCase() + categoryPages[currentCategoryIndex].split('-')[0].slice(1);
        }

        updateCategoryDisplay();
        const levelForASI = [4, 8, 12, 16, 19];
        if (levelForASI.includes(character.level)) {
            if (character.abilityScoreImprovementsLeft === undefined) {
                character.abilityScoreImprovementsLeft = 2;
                console.log("Initialized abilityScoreImprovementsLeft to 2");
            }
            updateAbilityScoreImprovementButtons();
        } else {
            removeAllImproveButtons();
        }

        console.log("Current level:", character.level);
        console.log("Ability score improvements left:", character.abilityScoreImprovementsLeft);
    }

    function showCurrencyModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Currency</h2>
                <div>
                    <label for="copper">Copper Pieces:</label>
                    <input type="number" id="copper" value="${character.currency.copper}">
                </div>
                <div>
                    <label for="silver">Silver Pieces:</label>
                    <input type="number" id="silver" value="${character.currency.silver}">
                </div>
                <div>
                    <label for="electrum">Electrum Pieces:</label>
                    <input type="number" id="electrum" value="${character.currency.electrum}">
                </div>
                <div>
                    <label for="gold">Gold Pieces:</label>
                    <input type="number" id="gold" value="${character.currency.gold}">
                </div>
                <div>
                    <label for="platinum">Platinum Pieces:</label>
                    <input type="number" id="platinum" value="${character.currency.platinum}">
                </div>
                <button id="confirm-currency">OK</button>
                <button id="cancel-currency">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
    
        document.getElementById('confirm-currency').addEventListener('click', () => {
            character.currency.copper = parseInt(document.getElementById('copper').value) || 0;
            character.currency.silver = parseInt(document.getElementById('silver').value) || 0;
            character.currency.electrum = parseInt(document.getElementById('electrum').value) || 0;
            character.currency.gold = parseInt(document.getElementById('gold').value) || 0;
            character.currency.platinum = parseInt(document.getElementById('platinum').value) || 0;
            updateCurrencyDisplay();
            modal.remove();
        });
    
        document.getElementById('cancel-currency').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    function updateCurrencyDisplay() {
        const currencyDisplay = document.getElementById('currency-display');
        if (currencyDisplay) {
            currencyDisplay.textContent = `CP: ${character.currency.copper}, SP: ${character.currency.silver}, EP: ${character.currency.electrum}, GP: ${character.currency.gold}, PP: ${character.currency.platinum}`;
        }
    }

    function handleAbilityScoreImprovements() {
        const levelForASI = [4, 8, 12, 16, 19];
        if (levelForASI.includes(character.level)) {
            if (character.abilityScoreImprovementsLeft === undefined) {
                character.abilityScoreImprovementsLeft = 2;
                console.log("Initialized abilityScoreImprovementsLeft to 2");
            }
            updateAbilityScoreImprovementButtons();
        } else {
            removeAllImproveButtons();
        }
        console.log("Current level:", character.level);
        console.log("Ability score improvements left:", character.abilityScoreImprovementsLeft);
    }

    function getModifierString(score) {
        console.log("Score:", score);
        const modifierTable = {
            1: -5, 2: -4, 3: -4, 4: -3, 5: -3, 6: -2, 7: -2, 8: -1, 9: -1,
            10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2, 16: 3, 17: 3, 18: 4,
            19: 4, 20: 5, 21: 5, 22: 6, 23: 6, 24: 7, 25: 7, 26: 8, 27: 8,
            28: 9, 29: 9, 30: 10
        };
        return modifierTable[score];
    }

    function calculateHP(characterClass, level, constitutionScore) {
        const hitDice = {
            artificer: 8,
            barbarian: 12,
            fighter: 10,
            paladin: 10,
            ranger: 10,
            bard: 8,
            cleric: 8,
            druid: 8,
            monk: 8,
            rogue: 8,
            warlock: 8,
            sorcerer: 6,
            wizard: 6
        };

        const conModifier = Math.floor((constitutionScore - 10) / 2);
        const classHitDie = hitDice[characterClass] || 8;

        let hp = classHitDie + conModifier;

        for (let i = 1; i < level; i++) {
            hp += Math.floor((classHitDie / 2) + 1) + conModifier;
        }

        return Math.max(hp, 1);
    }

    function calculateSavingThrows() {
        const proficientSaves = getProficientSaves(character.class);
        character.savingThrows = {};

        Object.entries(character.abilityScores).forEach(([ability, score]) => {
            const modifier = Math.floor((score - 10) / 2);
            const proficient = proficientSaves.includes(ability);
            character.savingThrows[ability] = {
                value: modifier + (proficient ? character.proficiencyBonus : 0),
                proficient: proficient
            };
        });
    }

    function getProficientSaves(characterClass) {
        const savingThrowProficiencies = {
            artificer: ['constitution', 'intelligence'],
            barbarian: ['strength', 'constitution'],
            bard: ['dexterity', 'charisma'],
            cleric: ['wisdom', 'charisma'],
            druid: ['intelligence', 'wisdom'],
            fighter: ['strength', 'constitution'],
            monk: ['strength', 'dexterity'],
            paladin: ['wisdom', 'charisma'],
            ranger: ['strength', 'dexterity'],
            rogue: ['dexterity', 'intelligence'],
            sorcerer: ['constitution', 'charisma'],
            warlock: ['wisdom', 'charisma'],
            wizard: ['intelligence', 'wisdom']
        };

        return savingThrowProficiencies[characterClass] || [];
    }

    function getSkillModifier(skill) {
        const relevantAbility = getRelevantAbility(skill);
        const abilityModifier = Math.floor((character.abilityScores[relevantAbility] - 10) / 2);
        const proficiencyBonus = character.skills.includes(skill) ? character.proficiencyBonus : 0;
        const totalModifier = abilityModifier + proficiencyBonus;
        return totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    }

    function generateRandomCharacter() {
        character.name = '';
        character.name = getRandomNameDice();
        if (!character.name) {
            character.name = 'undefined';
        }                

        const displayName = character.name || 'Unnamed';
        const showNameButtons = !character.name || character.name === 'undefined';

        character.race = getRandomItem(Object.keys(raceInfo));
        character.class = getRandomItem(Object.keys(classInfo));
        character.level = Math.floor(Math.random() * 20) + 1;
        character.background = getRandomItem(Object.keys(backgroundInfo));

        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            const rolls = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ];
            rolls.sort((a, b) => b - a);
            character.abilityScores[ability] = rolls[0] + rolls[1] + rolls[2];
        });

        const availableSkills = getClassSkills(character.class).concat(getBackgroundSkills(character.background));
        const numSkills = 4;
        character.skills = [];
        for (let i = 0; i < numSkills; i++) {
            if (availableSkills.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableSkills.length);
                character.skills.push(availableSkills.splice(randomIndex, 1)[0]);
            }
        }

        character.feats = [];
        if (character.level >= 4) {
            const availableFeats = [...feats];
            const numFeats = Math.floor((character.level - 1) / 4);
            for (let i = 0; i < numFeats; i++) {
                if (availableFeats.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableFeats.length);
                    character.feats.push(availableFeats.splice(randomIndex, 1)[0].name);
                }
            }
        }

        character.inventory = [];
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numItems; i++) {
            character.inventory.push(getRandomItem(items));
        }

        character.maxHp = calculateHP(character.class, character.level, character.abilityScores.constitution);
        character.hp = character.maxHp;
        updateCharacterAC(character.inventory.find(item => item.type === 'armor'));

        character.initiative = Math.floor((character.abilityScores.dexterity - 10) / 2);
        character.proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

        calculateSavingThrows();

        character.currency = {
            copper: Math.floor(Math.random() * 100),
            silver: Math.floor(Math.random() * 50),
            electrum: Math.floor(Math.random() * 20),
            gold: Math.floor(Math.random() * 10),
            platinum: Math.floor(Math.random() * 5),
            gems: ''
        };

        displayCharacterSheet();
        setupInventoryManager();
        document.getElementById('roll-new-character').classList.remove('hidden');
        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('character-sheet').classList.remove('hidden');
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function updateSpellSlots(level, value) {
        console.log(`Updated level ${level} spell slots to ${value}`);
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.error('Notification element not found');
            return;
        }
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function notifyAndLog(message) {
        showNotification(message);
        addRollResult(message);
    }

    function rollDice(diceCount, diceSides) {
        let total = 0;
        for (let i = 0; i < diceCount; i++) {
            total += Math.floor(Math.random() * diceSides) + 1;
        }
        return total;
    }

    function rollAbility(ability, score) {
        const roll = rollDice(1, 20);
        const modifier = Math.floor((score - 10) / 2);
        const total = roll + modifier;
        const message = `${ability.charAt(0).toUpperCase() + ability.slice(1)} check: ${roll} + ${modifier} = ${total}`;
        notifyAndLog(message);
        if (roll === 20) playSound('assets/sounds/20.mp3');
    }

    function rollSkill(skill) {
        const roll = Math.floor(Math.random() * 20) + 1;
        if (roll === 20) playSound('assets/sounds/20.mp3');
        const relevantAbility = getRelevantAbility(skill);
        const abilityModifier = Math.floor((character.abilityScores[relevantAbility] - 10) / 2);
        const proficiencyBonus = character.skills.includes(skill) ? character.proficiencyBonus : 0;
        const total = roll + abilityModifier + proficiencyBonus;
        const result = `${skill} check: ${roll} + ${abilityModifier} (${relevantAbility}) + ${proficiencyBonus} (prof) = ${total}`;
        showNotification(result);
        addRollResult(result);
    }

    function rollSavingThrow(ability) {
        const roll = rollDice(1, 20);
        const abilityScore = character.abilityScores[ability];
        const modifier = getModifierString(abilityScore);
        const proficiencyBonus = character.savingThrows[ability].proficient ? character.proficiencyBonus : 0;
        const totalModifier = modifier + proficiencyBonus;
        const total = roll + totalModifier;

        const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
        const message = `${ability.charAt(0).toUpperCase() + ability.slice(1)} saving throw: ${roll} ${modifierString} = ${total}`;
        notifyAndLog(message);
        if (roll === 20) playSound('assets/sounds/20.mp3');
    }

    function getRelevantAbility(skill) {
        const skillAbilities = {
            "Acrobatics": "dexterity",
            "Animal Handling": "wisdom",
            "Arcana": "intelligence",
            "Athletics": "strength",
            "Deception": "charisma",
            "History": "intelligence",
            "Insight": "wisdom",
            "Intimidation": "charisma",
            "Investigation": "intelligence",
            "Medicine": "wisdom",
            "Nature": "intelligence",
            "Perception": "wisdom",
            "Performance": "charisma",
            "Persuasion": "charisma",
            "Religion": "intelligence",
            "Sleight of Hand": "dexterity",
            "Stealth": "dexterity",
            "Survival": "wisdom"
        };
        return skillAbilities[skill] || "intelligence";
    }

    function rollToHit(weaponName) {
        const weapon = character.inventory.find(item => item.name === weaponName && item.type === 'weapon');
        if (!weapon) return;

        const relevantAbility = weapon.properties.includes("Finesse") ? 
            (character.abilityScores.dexterity > character.abilityScores.strength ? "dexterity" : "strength") :
            (weapon.properties.includes("Ranged") ? "dexterity" : "strength");

        const abilityModifier = Math.floor((character.abilityScores[relevantAbility] - 10) / 2);
        const proficiencyBonus = character.proficiencyBonus;

        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + abilityModifier + proficiencyBonus;
        if (roll === 20) playSound('assets/sounds/20.mp3');
        const result = `${weaponName} to hit: ${roll} + ${abilityModifier} (${relevantAbility}) + ${proficiencyBonus} (prof) = ${total}`;
        showNotification(result);
        addRollResult(result);
    }

    function rollDamage(weaponName) {
        const weapon = character.inventory.find(item => item.name === weaponName && item.type === 'weapon');
        if (!weapon) return;

        const [diceCount, diceType] = weapon.damage.split('d').map(Number);
        let damageRoll = 0;
        for (let i = 0; i < diceCount; i++) {
            damageRoll += Math.floor(Math.random() * diceType) + 1;
        }

        const relevantAbility = weapon.properties.includes("Finesse") ? 
            (character.abilityScores.dexterity > character.abilityScores.strength ? "dexterity" : "strength") :
            (weapon.properties.includes("Ranged") ? "dexterity" : "strength");

        const abilityModifier = Math.floor((character.abilityScores[relevantAbility] - 10) / 2);
        const total = damageRoll + abilityModifier;

        const result = `${weaponName} damage: ${damageRoll} + ${abilityModifier} (${relevantAbility}) = ${total} ${weapon.damageType}`;
        showNotification(result);
        addRollResult(result);
    }

    function rollSpellToHit(spellName) {
        const spell = character.spells.find(s => s.name === spellName);
        if (!spell) return;

        const spellcastingAbility = getSpellcastingAbility(character.class);
        const abilityModifier = Math.floor((character.abilityScores[spellcastingAbility] - 10) / 2);
        const proficiencyBonus = character.proficiencyBonus;

        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + abilityModifier + proficiencyBonus;

        const result = `${spellName} to hit: ${roll} + ${abilityModifier} (${spellcastingAbility}) + ${proficiencyBonus} (prof) = ${total}`;
        showNotification(result);
        addRollResult(result);
    }

    function rollSpellDamage(spellName) {
        const spell = character.spells.find(s => s.name === spellName);
        if (!spell) return;

        // This is a simplified version. You'd need to implement proper spell damage calculations.
        const damageRoll = Math.floor(Math.random() * 10) + 1;
        const result = `${spellName} damage/effect: ${damageRoll}`;
        showNotification(result);
        addRollResult(result);
    }

    function getSpellcastingAbility(characterClass) {
        const spellcastingAbilities = {
            wizard: 'intelligence',
            cleric: 'wisdom',
            druid: 'wisdom',
            sorcerer: 'charisma',
            warlock: 'charisma',
            paladin: 'charisma',
            bard: 'charisma',
            ranger: 'wisdom'
        };
        return spellcastingAbilities[characterClass] || 'intelligence';
    }

    function isSpellcaster(characterClass) {
        const spellcasterClasses = ['wizard', 'sorcerer', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'warlock', 'artificer'];
        return spellcasterClasses.includes(characterClass.toLowerCase());
    }

    function populateSpellList() {
        console.log('Populating spell list for', character.class);
        const spellSelect = document.getElementById('spell-select');
        if (!spellSelect) {
            console.error('Spell select element not found');
            return;
        }
        spellSelect.innerHTML = '<option value="">Select a spell</option>';
    
        const characterSpells = spells.filter(spell => 
            spell.classes.some(c => c.toLowerCase() === character.class.toLowerCase())
        );
    
        characterSpells.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });
    
        characterSpells.forEach(spell => {
            const option = document.createElement('option');
            option.value = spell.name;
            option.textContent = `${spell.name} (Level ${spell.level})`;
            spellSelect.appendChild(option);
        });
    
        console.log(`Added ${characterSpells.length} spells to the list`);
    }

    function setupSpellManager() {
        const addSpellBtn = document.getElementById('add-spell-btn');
        const spellSelect = document.getElementById('spell-select');
        const spellList = document.getElementById('spell-list');
    
        if (!addSpellBtn || !spellSelect || !spellList) {
            console.error('Spell manager elements not found');
            return;
        }
    
        addSpellBtn.addEventListener('click', () => {
            const selectedSpellName = spellSelect.value;
            if (selectedSpellName && !character.spells.some(s => s.name === selectedSpellName)) {
                const selectedSpell = spells.find(spell => spell.name === selectedSpellName);
                if (selectedSpell) {
                    character.spells.push(selectedSpell);
                    updateSpellList();
                    updateCombatPage(); // Add this line
                }
            }
        });
    
        updateSpellList();
    }
    
    function updateSpellList() {
        const spellList = document.getElementById('spell-list');
        spellList.innerHTML = '';
    
        for (let level = 0; level <= 9; level++) {
            const levelSpells = character.spells.filter(spell => spell.level === level);
            if (levelSpells.length > 0) {
                const levelGroup = document.createElement('div');
                levelGroup.id = `spell-level-${level}`;
                levelGroup.innerHTML = `<h5>Level ${level} ${level === 0 ? '(Cantrips)' : ''}</h5>`;
                
                levelSpells.forEach(spell => {
                    const spellItem = document.createElement('div');
                    spellItem.classList.add('spell-item');
                    spellItem.innerHTML = `
                        <div class="spell-header">
                            <span>${spell.name}</span>
                            <i class="bi bi-chevron-down"></i>
                        </div>
                        <div class="spell-details hidden">
                            <p><strong>Classes:</strong> ${spell.classes.join(', ')}</p>
                            <p>${spell.description}</p>
                        </div>
                    `;
    
                    const header = spellItem.querySelector('.spell-header');
                    const details = spellItem.querySelector('.spell-details');
                    const chevron = spellItem.querySelector('.bi-chevron-down');
    
                    header.addEventListener('click', () => {
                        details.classList.toggle('hidden');
                        chevron.classList.toggle('bi-chevron-up');
                        chevron.classList.toggle('bi-chevron-down');
                    });
    
                    levelGroup.appendChild(spellItem);
                });
    
                spellList.appendChild(levelGroup);
            }
        }
    }

    function calculateCantrips(characterClass, level) {
        const cantripProgression = {
            'wizard': [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            'sorcerer': [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            'bard': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            'cleric': [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            'druid': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            'warlock': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            'artificer': [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            'paladin': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            'ranger': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

        return cantripProgression[characterClass.toLowerCase()][level - 1] || 0;
    }

    function calculateSpellSlots(characterClass, level) {
        const fullCasters = ['wizard', 'sorcerer', 'bard', 'cleric', 'druid'];
        const halfCasters = ['paladin', 'ranger'];
        const artificer = 'artificer';
        const warlock = 'warlock';

        let slots = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
        };

        if (fullCasters.includes(characterClass)) {
            const effectiveLevel = level;
            if (effectiveLevel >= 1) slots[1] = effectiveLevel >= 1 ? 2 : 0;
            if (effectiveLevel >= 2) slots[1] = 3;
            if (effectiveLevel >= 3) { slots[1] = 4; slots[2] = 2; }
            if (effectiveLevel >= 4) slots[2] = 3;
            if (effectiveLevel >= 5) { slots[1] = 4; slots[2] = 3; slots[3] = 2; }
            if (effectiveLevel >= 6) slots[3] = 3;
            if (effectiveLevel >= 7) { slots[4] = 1; }
            if (effectiveLevel >= 8) slots[4] = 2;
            if (effectiveLevel >= 9) { slots[4] = 3; slots[5] = 1; }
            if (effectiveLevel >= 10) slots[5] = 2;
            if (effectiveLevel >= 11) slots[6] = 1;
            if (effectiveLevel >= 13) slots[7] = 1;
            if (effectiveLevel >= 15) slots[8] = 1;
            if (effectiveLevel >= 17) slots[9] = 1;
            if (effectiveLevel >= 18) slots[5] = 3;
            if (effectiveLevel >= 19) slots[6] = 2;
            if (effectiveLevel >= 20) slots[7] = 2;
        } else if (halfCasters.includes(characterClass)) {
            const effectiveLevel = Math.ceil(level / 2);
            if (effectiveLevel >= 2) slots[1] = 2;
            if (effectiveLevel >= 3) slots[1] = 3;
            if (effectiveLevel >= 5) { slots[1] = 4; slots[2] = 2; }
            if (effectiveLevel >= 7) slots[2] = 3;
            if (effectiveLevel >= 9) { slots[3] = 2; }
            if (effectiveLevel >= 11) slots[3] = 3;
            if (effectiveLevel >= 13) slots[4] = 1;
            if (effectiveLevel >= 15) slots[4] = 2;
            if (effectiveLevel >= 17) { slots[4] = 3; slots[5] = 1; }
            if (effectiveLevel >= 19) slots[5] = 2;
        } else if (characterClass === artificer) {
            const effectiveLevel = Math.ceil(level / 2);
            if (effectiveLevel >= 1) slots[1] = 2;
            if (effectiveLevel >= 2) slots[1] = 2;
            if (effectiveLevel >= 3) { slots[1] = 3; slots[2] = 2; }
            if (effectiveLevel >= 4) slots[2] = 2;
            if (effectiveLevel >= 5) { slots[1] = 4; slots[2] = 3; slots[3] = 2; }
            if (effectiveLevel >= 7) slots[3] = 3;
            if (effectiveLevel >= 9) { slots[3] = 3; slots[4] = 1; }
            if (effectiveLevel >= 11) slots[4] = 2;
            if (effectiveLevel >= 13) slots[4] = 3;
            if (effectiveLevel >= 15) slots[5] = 1;
            if (effectiveLevel >= 17) slots[5] = 2;
            if (effectiveLevel >= 19) slots[5] = 2;
        } else if (characterClass === warlock) {
            const pactMagicSlots = Math.min(Math.floor((level + 1) / 2), 4);
            const pactMagicLevel = Math.min(Math.floor((level - 1) / 6) + 1, 5);
            slots[pactMagicLevel] = pactMagicSlots;
        }

        return slots;
    }

    function rollInitiative() {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + character.initiative;
        const result = `Initiative: ${roll} + ${character.initiative} = ${total}`;
        showNotification(result);
        addRollResult(result);
    }

    function performDeathSavingThrow() {
        const roll = Math.floor(Math.random() * 20) + 1;
        let result;

        if (roll === 20) {
            character.hp = 1;
            resetDeathSaves();
            result = "Natural 20! You regain 1 hit point and become conscious!";
        } else if (roll === 1) {
            deathSaveFailures += 2;
            result = "Natural 1! That's two failures!";
        } else if (roll >= 10) {
            deathSaveSuccesses++;
            result = "Success!";
        } else {
            deathSaveFailures++;
            result = "Failure!";
        }

        addDeathSaveEmoji(roll >= 10 ? '⭐' : '💀');
        showNotification(`Death Saving Throw: ${result}`);

        if (deathSaveSuccesses >= 3) {
            character.hp = 1;
            resetDeathSaves();
            showNotification("You've stabilized and regained 1 hit point!");
            document.getElementById('current-hp').textContent = character.hp;
        } else if (deathSaveFailures >= 3) {
            resetDeathSaves();
            showNotification("You've died. Game over.");
        }

        updateDeathSaveDisplay();
    }

    function addDeathSaveEmoji(emoji) {
        const emojiContainer = document.getElementById('death-save-emojis');
        const span = document.createElement('span');
        span.textContent = emoji;
        emojiContainer.appendChild(span);
    }

    function updateDeathSaveDisplay() {
        const emojiContainer = document.getElementById('death-save-emojis');
        emojiContainer.innerHTML = '⭐'.repeat(deathSaveSuccesses) + '💀'.repeat(deathSaveFailures);
    }

    function resetDeathSaves() {
        deathSaveSuccesses = 0;
        deathSaveFailures = 0;
        updateDeathSaveDisplay();
    }

    function changeHP(action) {
        const amount = parseInt(prompt(`Enter amount to ${action}:`));
        if (isNaN(amount) || amount < 0) return;

        if (action === 'damage') {
            character.hp = Math.max(0, character.hp - amount);
        } else if (action === 'heal') {
            character.hp = Math.min(character.maxHp, character.hp + amount);
        }

        document.getElementById('current-hp').textContent = character.hp;
        showNotification(`${action === 'damage' ? 'Damaged' : 'Healed'} for ${amount} HP. Current HP: ${character.hp}`);

        if (character.hp <= 0) {
            performDeathSavingThrow();
        } else {
            resetDeathSaves();
        }
    }


    function levelUp() {
    // window.levelUp = function() {
        character.level++;
        console.log("Leveled up to", character.level);
        character.maxHp += calculateHPIncrease(character.class, character.abilityScores.constitution);
        character.hp = character.maxHp;
        character.proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

        const levelForASI = [4, 8, 12, 16, 19];
        if (levelForASI.includes(character.level)) {
            character.abilityScoreImprovementsLeft = 2;
            console.log("Level up to ASI level. Reset abilityScoreImprovementsLeft to 2");
        }

        const featLevels = [4, 8, 12, 16, 19];
        if (featLevels.includes(character.level)) {
            showFeatChooser();
        }

        displayCharacterSheet();
        updateSpellSlots();
        handleAbilityScoreImprovements();
        showNotification(`Congratulations! You are now level ${character.level}!`);
    };

    function showFeatChooser() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Choose a Feat</h2>
                <select id="feat-select">
                    <option value="">Select a feat</option>
                </select>
                <div id="feat-description"></div>
                <button id="confirm-feat">Confirm Feat</button>
            </div>
        `;
        document.body.appendChild(modal);

        const featSelect = document.getElementById('feat-select');
        const featDescription = document.getElementById('feat-description');
        const confirmButton = document.getElementById('confirm-feat');

        feats.forEach(feat => {
            if (feat.appliesTo === 'All classes' || feat.appliesTo.includes(character.class)) {
                const option = document.createElement('option');
                option.value = feat.name;
                option.textContent = feat.name;
                featSelect.appendChild(option);
            }
        });

        featSelect.addEventListener('change', () => {
            const selectedFeat = feats.find(f => f.name === featSelect.value);
            if (selectedFeat) {
                featDescription.textContent = selectedFeat.description;
            } else {
                featDescription.textContent = '';
            }
        });

        confirmButton.addEventListener('click', () => {
            const selectedFeat = featSelect.value;
            if (selectedFeat) {
                character.feats.push(selectedFeat);
                modal.remove();
                showNotification(`You've gained the ${selectedFeat} feat!`);
                displayCharacterSheet();
            } else {
                showNotification('Please select a feat before confirming.');
            }
        });
    }

    function updateAbilityScoreImprovementButtons() {
        const attributesPage = document.getElementById('attributes-page');
        console.log("Updating ASI buttons. Improvements left:", character.abilityScoreImprovementsLeft);

        if (!attributesPage) {
            console.error('Attributes page not found');
            return;
        }

        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

        abilities.forEach(ability => {
            const abilityDiv = attributesPage.querySelector(`#${ability}-score`);

            if (abilityDiv) {
                const existingButton = abilityDiv.querySelector('.improve-ability-btn');
                if (existingButton) {
                    existingButton.remove();
                }

                if (character.abilityScoreImprovementsLeft > 0) {
                    const improveButton = document.createElement('button');
                    improveButton.textContent = '+1';
                    improveButton.className = 'improve-ability-btn small-button';
                    improveButton.setAttribute('data-ability', ability);
                    abilityDiv.appendChild(improveButton);
                    console.log(`Added button to ${ability}`);
                }
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('improve-ability-btn')) {
            const ability = event.target.getAttribute('data-ability');

            console.log(`Button clicked for ${ability}. Current improvements left: ${character.abilityScoreImprovementsLeft}`);

            if (character.abilityScoreImprovementsLeft > 0) {
                character.abilityScores[ability]++;
                character.abilityScoreImprovementsLeft--;
                
                console.log(`Improved ${ability}. Improvements left: ${character.abilityScoreImprovementsLeft}`);
                
                if (character.abilityScoreImprovementsLeft === 0) {
                    console.log('No improvements left, removing buttons.');
                    removeAllImproveButtons();
                } else {
                    updateAbilityScoreImprovementButtons();
                }
                
                displayCharacterSheet();
            }
        }
    });

    function removeAllImproveButtons() {
        const buttons = document.querySelectorAll('.improve-ability-btn');
        console.log('Found buttons to remove:', buttons.length);
        buttons.forEach(button => {
            button.remove();
        });
        console.log('All +1 buttons removed');
    }

    function calculateHPIncrease(characterClass, constitutionScore) {
        const hitDice = {
            barbarian: 12, fighter: 10, paladin: 10, ranger: 10,
            bard: 8, cleric: 8, druid: 8, monk: 8, rogue: 8, warlock: 8,
            sorcerer: 6, wizard: 6, artificer: 8
        };
        const conModifier = Math.floor((constitutionScore - 10) / 2);
        return Math.floor(hitDice[characterClass] / 2) + 1 + conModifier;
    }

    function playSound(soundFile) {
        const audio = new Audio(soundFile);
        audio.play();
    }

    function updateSpellSlots() {
        const spellSlots = calculateSpellSlots(character.class, character.level);
        for (let level = 1; level <= 9; level++) {
            const input = document.querySelector(`.spell-slot-cell input[onchange="updateSpellSlots(${level}, this.value)"]`);
            if (input) {
                input.value = spellSlots[level] || 0;
                input.max = spellSlots[level] || 0;
                input.disabled = spellSlots[level] === 0;
            }
        }
    }

    function saveCharacter() {
        const characterData = {
            name: character.name,
            race: character.race,
            class: character.class,
            subclass: character.subclass,
            level: character.level,
            background: character.background,
            abilityScores: character.abilityScores,
            skills: character.skills,
            feats: character.feats,
            inventory: character.inventory.map(item => ({
                ...item,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height
            })),
            spells: character.spells,
            hp: character.hp,
            maxHp: character.maxHp,
            ac: character.ac,
            initiative: character.initiative,
            proficiencyBonus: character.proficiencyBonus,
            savingThrows: character.savingThrows,
            notes: character.notes,
            currency: character.currency,
            abilityScoreImprovementsLeft: character.abilityScoreImprovementsLeft,
            spellSlots: calculateSpellSlots(character.class, character.level)
        };

        const characterDataString = JSON.stringify(characterData, null, 2);

        localStorage.setItem('savedCharacter', characterDataString);

        downloadCharacterJSON(characterDataString);

        showNotification('Character saved successfully!');
    }

    function downloadCharacterJSON(jsonString) {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${character.name || 'character'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function updateSkillsAndFeatsPage() {
        const skillsFeatsPage = document.getElementById('skills-feats-page');

        skillsFeatsPage.innerHTML = `
            <h3>Skills</h3>
            <div class="skills">
                ${skills.map(skill => `
                    <div class="skill" onclick="myApp.rollSkill('${skill}')">
                        <span>${skill}</span>
                        <span class="${character.skills.includes(skill) ? 'proficiency-bonus' : ''}">${getSkillModifier(skill)}</span>
                    </div>
                `).join('')}
            </div>
            <h3>Feats</h3>
            <div class="feats">
                ${character.feats.map(featName => {
                    const feat = feats.find(f => f.name === featName);
                    return feat ? `
                        <div class="feat-item">
                            <h4>${feat.name}</h4>
                            <p>${feat.description}</p>
                            <p><small>Applies to: ${feat.appliesTo}</small></p>
                        </div>
                    ` : '';
                }).join('')}
            </div>
        `;
    }

    function saveCharacterToCookie(character) {
        const cookieName = `character_${encodeURIComponent(character.name)}`;
        const existingCookies = document.cookie.split(';').map(c => c.trim());
        const characterCookies = existingCookies.filter(c => c.startsWith('character_'));
        
        if (characterCookies.length >= 10) {
            const oldestCookie = characterCookies[0].split('=')[0];
            document.cookie = `${oldestCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        const encodedData = encodeURIComponent(JSON.stringify(character));
        document.cookie = `${cookieName}=${encodedData}; max-age=31536000; path=/`;
    }

    function updateInventoryPreview() {
        const startingEquipmentList = document.getElementById('starting-equipment-list');
        startingEquipmentList.innerHTML = '';

        const classEquipment = getClassStartingEquipment(character.class);
        const equipmentList = document.createElement('ul');
        classEquipment.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            equipmentList.appendChild(li);
        });

        startingEquipmentList.appendChild(equipmentList);
    }

    function getClassStartingEquipment(characterClass) {
        const startingEquipment = {
            artificer: ["A light crossbow and 20 bolts", "Any two simple weapons", "A set of artisan's tools", "Studded leather armor", "A dungeoneer's pack"],
            barbarian: ["A greataxe", "Two handaxes", "Four javelins", "An explorer's pack"],
            bard: ["A rapier", "A diplomat's pack", "A lute", "Leather armor"],
            cleric: ["A mace", "Scale mail", "A light crossbow and 20 bolts", "A priest's pack", "A shield"],
            druid: ["A wooden shield", "A scimitar", "Leather armor", "An explorer's pack"],
            fighter: ["Chain mail", "A martial weapon and a shield", "Two martial weapons", "A light crossbow and 20 bolts", "A dungeoneer's pack"],
            monk: ["A shortsword", "10 darts", "A dungeoneer's pack"],
            paladin: ["A martial weapon and a shield", "Five javelins", "Chain mail", "A priest's pack"],
            ranger: ["Scale mail", "Two shortswords", "A longbow and a quiver of 20 arrows", "A dungeoneer's pack"],
            rogue: ["A rapier", "A shortbow and quiver of 20 arrows", "Leather armor", "Two daggers", "A burglar's pack"],
            sorcerer: ["A light crossbow and 20 bolts", "Two daggers", "A component pouch", "A dungeoneer's pack"],
            warlock: ["A light crossbow and 20 bolts", "Any simple weapon", "Leather armor", "Two daggers", "A scholar's pack"],
            wizard: ["A quarterstaff", "A component pouch", "A scholar's pack", "A spellbook"]
        };

        return startingEquipment[characterClass] || ["No specific starting equipment"];
    }

    function editCharacter() {
        document.getElementById('character-sheet').classList.add('hidden');
        characterCreator.classList.remove('hidden');
        document.getElementById(steps[0]).classList.remove('hidden');
        currentStep = 0;

        document.getElementById('character-name').value = character.name;
        document.getElementById('race').value = character.race;
        document.getElementById('class').value = character.class;
        document.getElementById('level').value = character.level;
        document.getElementById('background').value = character.background;

        Object.entries(character.abilityScores).forEach(([ability, score]) => {
            const scoreSpan = document.getElementById(`${ability}-score`);
            scoreSpan.textContent = `${score} (Modifier: ${getModifierString(score)}) (Selected)`;
            document.querySelector(`.dice[data-ability="${ability}"]`).style.display = 'none';
        });

        updateRaceInfo();
        updateClassInfo();
        updateBackgroundInfo();
        updateSubclassOptions();
        updateSkillsAndFeats();
        setupInventoryManager();
        updateCharacterInventory();
        updateCombatPage();
    }

    function addRollResult(result) {
        rollResults.unshift(result);
        if (rollResults.length > 25) {
            rollResults.pop();
        }
        updateRollResultsDisplay();
    }

    function updateRollResultsDisplay() {
        const rollResultsDiv = document.getElementById('roll-results');
        rollResultsDiv.innerHTML = rollResults.map(result => `<div class="roll-item">${result}</div>`).join('');
    }

    function longRest() {
        character.hp = character.maxHp;
        document.getElementById('current-hp').textContent = character.hp;
        document.getElementById('max-hp').textContent = character.maxHp;
        resetDeathSaves();
        if (isSpellcaster(character.class)) {
            updateSpellSlots();
        }
        showNotification('Long rest completed. HP restored to maximum and death saves reset.');
        displayCharacterSheet();
    }



    function populateItemDropdown() {
        const itemSelect = document.getElementById('item-select');
        if (itemSelect) {
            itemSelect.innerHTML = '<option value="">Select an item</option>';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = `${item.name} (${item.width}x${item.height})`;
                itemSelect.appendChild(option);
            });
        } else {
            console.error('Item select element not found');
        }
    }

    function populateCharacterSheetItemDropdown() {
        const itemSelect = document.getElementById('character-sheet-item-select');
        if (itemSelect) {
            itemSelect.innerHTML = '<option value="">Select an item</option>';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = `${item.name} (${item.width}x${item.height})`;
                itemSelect.appendChild(option);
            });
        } else {
            console.error('Character sheet item select element not found');
        }
    }

    function loadRaces() {
        const raceSelect = document.getElementById('race');
        Array.from(raceSelect.options).forEach(option => {
            if (option.value) {
                races[option.value] = { name: option.value };
            }
        });

        fetch('races.json')
            .then(response => response.json())
            .then(data => {
                races = { ...races, ...data };
                console.log('Races loaded:', Object.keys(races).length);
                
                updateRaceDropdown();
            })
            .catch(error => console.error('Error loading races:', error));
    }

    function shortRest() {
        const maxHitDice = character.level;
        const currentHitDice = character.hitDice || maxHitDice;

        const hitDiceToSpend = prompt(`You have ${currentHitDice} hit dice remaining. How many do you want to spend? (0-${currentHitDice})`);

        if (hitDiceToSpend === null) return;

        const diceCount = Math.min(parseInt(hitDiceToSpend) || 0, currentHitDice);
        if (diceCount <= 0) return;

        const conModifier = Math.floor((character.abilityScores.constitution - 10) / 2);
        let healing = 0;

        for (let i = 0; i < diceCount; i++) {
            const roll = rollDice(1, 6);
            healing += roll + conModifier;
        }

        character.hp = Math.min(character.hp + healing, character.maxHp);
        character.hitDice = currentHitDice - diceCount;

        updateHPDisplay();
        showNotification(`You regained ${healing} HP. Current HP: ${character.hp}/${character.maxHp}`);
    }

    document.getElementById('short-rest-btn').addEventListener('click', shortRest);

    function updateRaceDropdown() {
        const raceSelect = document.getElementById('race');
        raceSelect.innerHTML = '<option value="">Select a race</option>';

        Object.keys(races).sort().forEach(raceName => {
            const option = document.createElement('option');
            option.value = raceName;
            option.textContent = raceName;
            raceSelect.appendChild(option);
        });
    }

    function safeInitializeThemeControls() {
        try {
            initializeThemeControls();
        } catch (error) {
            console.error('Error initializing theme controls:', error);
        }
    }

    function initializeTheme() {
        const colorTheme = getCookie('colorTheme') || 'default';
        const darkMode = getCookie('darkMode') === 'true';
    
        document.getElementById('color-theme').value = colorTheme;
        document.getElementById('dark-mode-toggle').checked = darkMode;
    
        applyTheme(colorTheme, darkMode);
    }

    function initializeThemeControls() {
        const themeControls = document.getElementById('theme-controls');
        if (!themeControls) return;
    
        const colorThemeSelect = document.getElementById('color-theme');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
    
        if (colorThemeSelect && darkModeToggle) {
            const colorTheme = getCookie('colorTheme') || 'default';
            const darkMode = getCookie('darkMode') === 'true';
    
            colorThemeSelect.value = colorTheme;
            darkModeToggle.checked = darkMode;
    
            applyTheme(colorTheme, darkMode);
    
            colorThemeSelect.addEventListener('change', function() {
                const newColorTheme = this.value;
                const currentDarkMode = darkModeToggle.checked;
                applyTheme(newColorTheme, currentDarkMode);
                setCookie('colorTheme', newColorTheme);
            });
    
            darkModeToggle.addEventListener('change', function() {
                const currentColorTheme = colorThemeSelect.value;
                const newDarkMode = this.checked;
                applyTheme(currentColorTheme, newDarkMode);
                setCookie('darkMode', newDarkMode);
            });
        }
    }
    
    function applyTheme(colorTheme, darkMode) {
        document.body.className = `theme-${colorTheme} ${darkMode ? 'dark-mode' : ''}`;
    }
    
    function setCookie(name, value, days = 365) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name + "=") == 0) {
                return c.substring(name.length + 1);
            }
        }
        return "";
    }
    
    function setupThemeControls() {
        const colorThemeSelect = document.getElementById('color-theme');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
    
        colorThemeSelect.addEventListener('change', function() {
            const colorTheme = this.value;
            const darkMode = darkModeToggle.checked;
            applyTheme(colorTheme, darkMode);
            setCookie('colorTheme', colorTheme);
        });
    
        darkModeToggle.addEventListener('change', function() {
            const colorTheme = colorThemeSelect.value;
            const darkMode = this.checked;
            applyTheme(colorTheme, darkMode);
            setCookie('darkMode', darkMode);
        });
    }
    function updateDPIInfo() {
        const inventoryCanvas = document.getElementById('inventory-canvas');
        if (!inventoryCanvas) return;
    
        const dpr = window.devicePixelRatio || 1;
        const rect = inventoryCanvas.getBoundingClientRect();
        const smallestDimension = Math.max(Math.min(rect.width, rect.height), MIN_CANVAS_SIZE);
    
        dpiInfo = {
            dpr: dpr,
            gridSize: GRID_SIZE,
            canvasSize: smallestDimension,
            cellSize: smallestDimension / GRID_SIZE
        };
    
        console.log('Updated DPI Info:', dpiInfo);
    
        // Ensure the canvas size is updated
        inventoryCanvas.style.width = `${dpiInfo.canvasSize}px`;
        inventoryCanvas.style.height = `${dpiInfo.canvasSize}px`;
        inventoryCanvas.width = dpiInfo.canvasSize * dpr;
        inventoryCanvas.height = dpiInfo.canvasSize * dpr;
    
        // Redraw the grid
        drawGrid();
    }

    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    function adjustInventoryLayout() {
        const inventoryContainer = document.querySelector('.inventory-container');
        const characterInventory = document.getElementById('character-inventory');
        const inventoryControls = document.querySelector('.inventory-controls');
        const inventoryCanvas = document.getElementById('inventory-canvas');
    
        if (!inventoryContainer || !characterInventory || !inventoryControls || !inventoryCanvas) {
            console.log('Inventory elements not found. Skipping layout adjustment.');
            return;
        }
    
        if (isMobileDevice() || window.innerWidth < 768) {
            inventoryContainer.style.flexDirection = 'column';
            characterInventory.style.maxHeight = '200px';
            characterInventory.style.marginTop = '10px';
            inventoryControls.insertAdjacentElement('afterend', characterInventory);
            
            // Adjust canvas size for mobile
            const containerWidth = Math.max(inventoryContainer.clientWidth, MIN_CANVAS_SIZE);
            inventoryCanvas.style.width = `${containerWidth}px`;
            inventoryCanvas.style.height = `${containerWidth}px`;
        } else {
            inventoryContainer.style.flexDirection = 'row';
            characterInventory.style.maxHeight = 'none';
            characterInventory.style.marginTop = '0';
            inventoryContainer.appendChild(characterInventory);
            
            // Reset canvas size for desktop
            inventoryCanvas.style.width = `${MIN_CANVAS_SIZE}px`;
            inventoryCanvas.style.height = `${MIN_CANVAS_SIZE}px`;
        }
    
        // Update DPI info, setup inventory manager, and redraw the grid
        updateDPIInfo();
        setupInventoryManager();
        drawGrid();
    }



    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(`${character.name}`, 105, 15, null, null, 'center');
        doc.setFontSize(14);
        doc.text(`Level ${character.level} ${character.race} ${character.class}`, 105, 25, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`HP: ${character.hp}/${character.maxHp}`, 20, 40);
        doc.text(`AC: ${character.ac}`, 80, 40);
        doc.text(`Initiative: +${character.initiative}`, 140, 40);

        doc.setFontSize(14);
        doc.text("Ability Scores", 20, 55);
        let yPos = 65;
        for (const [ability, score] of Object.entries(character.abilityScores)) {
            doc.setFontSize(12);
            doc.text(`${ability.charAt(0).toUpperCase() + ability.slice(1)}: ${score} (${getModifierString(score)})`, 20, yPos);
            yPos += 10;
        }

        yPos += 10;
        doc.setFontSize(14);
        doc.text("Skills", 20, yPos);
        yPos += 10;
        doc.setFontSize(12);
        character.skills.forEach(skill => {
            doc.text(skill, 20, yPos);
            yPos += 10;
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
        });

        yPos += 10;
        doc.setFontSize(14);
        doc.text("Inventory", 20, yPos);
        yPos += 10;
        doc.setFontSize(12);
        character.inventory.forEach(item => {
            doc.text(item.name, 20, yPos);
            yPos += 10;
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
        });

        if (isSpellcaster(character.class)) {
            yPos += 10;
            doc.setFontSize(14);
            doc.text("Spells", 20, yPos);
            yPos += 10;
            doc.setFontSize(12);
            character.spells.forEach(spell => {
                doc.text(spell.name, 20, yPos);
                yPos += 10;
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        }

        doc.addPage();
        doc.setFontSize(14);
        doc.text("Notes", 20, 20);
        doc.setFontSize(12);
        const splitNotes = doc.splitTextToSize(character.notes, 180);
        doc.text(splitNotes, 20, 30);

        doc.save(`${character.name}_character_sheet.pdf`);
    }

    function scrollToSpellLevel(level) {
        const element = document.getElementById(`spell-level-${level}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // fetch('spells.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         spells = data;
    //         console.log('Spells loaded:', spells.length);

    //         if (document.getElementById('character-sheet').style.display !== 'none') {
    //             displayCharacterSheet();
    //         }
    //     })
    //     .catch(error => console.error('Error loading spells:', error));

        // function initializeUI() {
        //     populateDropdowns();
        //     setupEventListeners();
        //     setupAbilityScores();
        //     populateItemDropdown();
        //     loadRaces();
        //     document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
        //     // Remove the direct call to adjustInventoryLayout here
        //     if (spells.length > 0) {
        //         displayCharacterSheet();
        //     }
        // }
        
        // document.addEventListener('DOMContentLoaded', function() {
        //     initializeUI();
        //     fetch('spells.json')
        //         .then(response => response.json())
        //         .then(data => {
        //             spells = data;
        //             console.log('Spells loaded:', spells.length);
        //             if (document.getElementById('character-sheet').style.display !== 'none') {
        //                 displayCharacterSheet();
        //                 // Call adjustInventoryLayout after displaying the character sheet
        //                 adjustInventoryLayout();
        //             }
        //         })
        //         .catch(error => console.error('Error loading spells:', error));
        
        //     // Add a window resize event listener to adjust layout when the window size changes
        //     window.addEventListener('resize', adjustInventoryLayout);
        // });


        document.addEventListener('DOMContentLoaded', function() {
            // initializeTheme();
            initializeUI();
            fetch('spells.json')
                .then(response => response.json())
                .then(data => {
                    spells = data;
                    console.log('Spells loaded:', spells.length);
                    if (document.getElementById('character-sheet').style.display !== 'none') {
                        displayCharacterSheet();
                        // Call adjustInventoryLayout after displaying the character sheet
                        adjustInventoryLayout();
                    }
                })
                .catch(error => console.error('Error loading spells:', error));
        
            // Add a window resize event listener to adjust layout when the window size changes
            window.addEventListener('resize', function() {
                updateDPIInfo();
                adjustInventoryLayout();
            });
        });

    window.myApp = {
        rollAbility: rollAbility,
        rollSkill: rollSkill,
        rollToHit: rollToHit,
        rollDamage: rollDamage,
        rollInitiative: rollInitiative,
        changeHP: changeHP,
        editCharacterName: editCharacterName,
        generateRandomName: generateRandomName,
        longRest: longRest,
        scrollToSpellLevel: scrollToSpellLevel,
        rollSavingThrow: rollSavingThrow,
        updateSpellSlots: updateSpellSlots,
        addItemToInventory: addItemToInventory,
        updateCharacterInventory: updateCharacterInventory,
        updateCombatPage: updateCombatPage,
        handleItemClick: handleItemClick,
        drawGrid: drawGrid,
        setupInventoryManager: setupInventoryManager,
        initializeUI: initializeUI,
        displayCharacterSheet: displayCharacterSheet,
        // updateCurrency: updateCurrency,
        saveCharacter: saveCharacter,
        loadCharacter: loadCharacterFromFile,
        exportToPDF: exportToPDF,
        shortRest: shortRest,
        levelUp: levelUp,

        scrollToSpellLevel: function(level) {
            const element = document.getElementById(`spell-level-${level}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        castSpell: function(spellName) {
            const spell = character.spells.find(s => s.name === spellName);
            if (spell) {
                let message = `Casting ${spell.name} (Level ${spell.level})`;
                
                // You can add more complex logic here based on the spell's properties
                if (spell.damage) {
                    const damageRoll = rollDice(spell.damage);
                    message += `\nDamage: ${damageRoll}`;
                }
                
                // Display the message (you can modify this to fit your UI)
                showNotification(message);
                addRollResult(message);
            }
        }
    };
    console.log("myApp initialized:", window.myApp);

    window.onerror = function(message, source, lineno, colno, error) {
        console.error('An error occurred:', message, 'at', source, 'line', lineno);
        return false;
    };

})(window, document);
} catch (error) {
    console.error("Error in app initialization:", error);
  }
