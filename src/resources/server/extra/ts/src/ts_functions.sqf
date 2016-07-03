#include "\x\ark\addons\hull3\hull3_macros.h"



ts_fnc_preinit = {
    ts_camouflage = ["woodland", "desert", "snow"] select (["TownSweep_Camouflage", 0] call BIS_fnc_getParamValue);
    ts_player_faction = "Default";
    ts_player_factionRawSide = "west";
    ts_player_factionSide = west;
    ts_player_gearTemplate = "Default";
    ts_player_uniformTemplate = "Default";
    ts_player_side = west;
    ts_enemy_side = east;

    hull3_gear_fnc_validateFaction = { true };
    hull3_gear_fnc_getFaction = { ts_player_faction };
    hull3_gear_fnc_getTemplate = { ts_player_gearTemplate };
    hull3_uniform_fnc_getTemplate = { ts_player_uniformTemplate };

    [] call ts_fnc_selectRandomFaction;
};

ts_fnc_selectRandomFaction = {
    private ["_factionConfigs", "_factionConfig"];
    _factionConfigs = "ts_camouflage in getArray (_x >> 'camouflage') && {getText (_x >> 'name') != 'Default'}" configClasses (HULL3_CONFIG_FILE >> FACTION_CONFIG);
    _factionConfig = _factionConfigs select floor random count _factionConfigs;
    ts_player_faction = configName _factionConfig;
    ts_player_factionRawSide = getText (_factionConfig >> "side");
    ts_player_factionSide = call compile ts_player_factionRawSide;
    ts_player_gearTemplate = getText (_factionConfig >> "gear");
    ts_player_uniformTemplate = getText (_factionConfig >> "uniform");
};