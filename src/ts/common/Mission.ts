import Hull3 = require('./Hull3');

export enum Side {
    BLUFOR,
    OPFOR,
    INDFOR,
    CIVILIAN
}

export enum MissionType {
    COOP,
    TVT,
    GTVT,
    COTVT
}

export interface Terrain {
    id: string;
    name: string;
}

export interface Faction {
    side: Side;
    faction: Hull3.Faction;
    gearTemplateId: string;
    uniformTemplateId: string;
}

export interface Addons {
    admiral: boolean;
    plank: boolean;
}

export interface FactionRequest {
    factionId: string;
    sideName: string;
    gearTemplateId: string;
    uniformTemplateId: string;
    groups: { [id: string]: boolean };
    vehicleClassnames: { [id: string]: string }
}

export interface Mission {
    terrainId: string;
    missionTypeName: string;
    maxPlayers: number;
    onLoadName: string;
    author: string;
    briefingName: string;
    overviewText: string;
    factions: FactionRequest[];
    addons: Addons;
}

export interface Config {
    sideNames: string[];
    missionTypeNames: string[];
    terrains: Terrain[];
    Hull3: Hull3.Config;
}

export interface GeneratedMission {
    missionId: number;
    missionWorkingDir: string;
    missionDirName: string;
    missionDir: string;
}