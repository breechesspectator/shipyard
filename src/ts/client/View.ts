/// <reference path="./typings/tsd.d.ts" />

import $ = require('jquery');
import _ = require('lodash');
import Hull3 = require('./Hull3');
import Mission = require('./Mission');

var factionIdCounter = 0; 
var TERRAIN_FIELD: JQuery = null,
    MISSION_TYPE_FIELD: JQuery = null,
    MAX_PLAYERS_FIELD: JQuery = null,
    ON_LOAD_NAME_FIELD: JQuery = null,
    AUTHOR_FIELD: JQuery = null,
    BRIEFING_NAME_FIELD: JQuery = null,
    OVERVIEW_TEXT_FIELD: JQuery = null,
    FACTION_SELECT_FIELD_TEMPLATE: _.TemplateExecutor = null,
    FACTION_GROUP_FIELDS_TEMPLATE: _.TemplateExecutor = null,
    FACTION_VEHICLE_CLASSNAME_FIELDS_TEMPLATE: _.TemplateExecutor = null,
    ADD_FACTION_BUTTON: JQuery = null,
    FACIONS_CONTAINER: JQuery = null,
    ADMIRAL_FIELD: JQuery = null,
    PLANK_FIELD: JQuery = null,
    GENERATE_MISSION_BUTTON: JQuery = null;

interface Option {
    value: string;
    text: string;
}

function nextFactionId(): number {
    factionIdCounter = factionIdCounter + 1;
    return factionIdCounter;
}

function initMissionFields(terrains: Mission.Terrain[], missionTypes: Mission.MissionType[]) {
    TERRAIN_FIELD = $('#terrain').eq(0);
    MISSION_TYPE_FIELD = $('#missionType').eq(0);
    MAX_PLAYERS_FIELD = $('#maxPlayers').eq(0);
    ON_LOAD_NAME_FIELD = $('#onLoadName').eq(0);
    AUTHOR_FIELD = $('#author').eq(0);
    BRIEFING_NAME_FIELD = $('#briefingName').eq(0);
    OVERVIEW_TEXT_FIELD = $('#overviewText').eq(0);

    initSelectField(TERRAIN_FIELD, terrains.map(terrainToOption));
    initSelectField(MISSION_TYPE_FIELD, missionTypes.map(missionTypeToOption));
}

function initFactions() {
    FACTION_SELECT_FIELD_TEMPLATE = _.template($('#faction-select-field-template').html());
    FACTION_GROUP_FIELDS_TEMPLATE = _.template($('#faction-group-fields-template').html());
    FACTION_VEHICLE_CLASSNAME_FIELDS_TEMPLATE = _.template($('#faction-vehicle-classname-fields-template').html());
    ADD_FACTION_BUTTON = $('#add-faction').eq(0);
    FACIONS_CONTAINER = $('#factions').eq(0);
    ADD_FACTION_BUTTON.click(() => { addFaction(FACIONS_CONTAINER); });
}

function terrainToOption(t: Mission.Terrain): Option {
    return { value: t.id, text: t.name }    
}

function missionTypeToOption(mt: Mission.MissionType): Option {
    return {
        value: Mission.missionTypeToString(mt),
        text: Mission.missionTypeToString(mt)
    }    
}

function sideToOption(s: Mission.Side): Option {
    return {
        value: Mission.sideToString(s),
        text: Mission.sideToString(s)
    }
}

function factionToOption(f: Hull3.Faction): Option {
    return { value: f.id, text: f.name }    
}

function templateToOption(t: Hull3.Template): Option {
    return { value: t.id, text: t.name }    
}

function initSelectField(field: JQuery, options: Option[], selectedValue?: string) {
    field.empty();
    options.forEach(o => {
        field.append(`<option value="${o.value}" ${selectedValue && o.value == selectedValue ? 'selected="selected"' : ''}>${o.text}</option>`);
    });
}

function addFaction(container: JQuery) {
    var factionId = nextFactionId();
    var factionContainer = $(`<div class="faction-container"></div>`),
        factionFieldContainer = $(`<div class="faction-field-container"></div>`),
        factionField = FACTION_SELECT_FIELD_TEMPLATE({
            factionId: factionId,
            label: 'Faction',
            options: Hull3.getFactions().map(factionToOption),
            selectedValue: ''
        }),
        sideField = FACTION_SELECT_FIELD_TEMPLATE({
            factionId: factionId,
            label: 'Side',
            options: Mission.getSides().map(sideToOption),
            selectedValue: ''
        }),
        gearField = FACTION_SELECT_FIELD_TEMPLATE({
            factionId: factionId,
            label: 'Gear template',
            options: Hull3.getGearTemplates().map(templateToOption),
            selectedValue: ''
        }),
        uniformField = FACTION_SELECT_FIELD_TEMPLATE({
            factionId: factionId,
            label: 'Uniform template',
            options: Hull3.getUniformTemplates().map(templateToOption),
            selectedValue: ''
        }),
        removeFooter = $(`<div class="remove-footer"></div>`),
        removeButton = $(`<button class="remove-button">Remove</button>`);
    factionFieldContainer.append(factionField);
    factionFieldContainer.append(sideField);
    factionFieldContainer.append(gearField);
    factionFieldContainer.append(uniformField);
    factionContainer.append(factionFieldContainer);
    addGroups(factionContainer, factionId);
    addVehicleClassnames(factionContainer, factionId);
    removeButton.click(() => { factionContainer.remove(); });
    removeFooter.append(removeButton);
    removeFooter.append($('<div style="clear: both;"></div>'));
    factionContainer.append(removeFooter);
    container.append(factionContainer);
}

function addGroups(container: JQuery, factionId: number) {
    var factionGroupFields = FACTION_GROUP_FIELDS_TEMPLATE({
            factionId: factionId,
            groupTemplates: Hull3.getGroupTemplates()
        });
    container.append($('<h4 class="before">Groups</h4>'));
    container.append(factionGroupFields);
}

function addVehicleClassnames(container: JQuery, factionId: number) {
    var factionVehicleClassnameFields = FACTION_VEHICLE_CLASSNAME_FIELDS_TEMPLATE({
            factionId: factionId,
            vehicleClassnameTemplates: Hull3.getVehicleClassnameTemplates()
        });
    container.append($('<h4 class="before small">Vehicle classnames</h4>'));
    container.append(factionVehicleClassnameFields);
}

function getFactions(): Mission.FactionRequest[] {
    return FACIONS_CONTAINER.find('.faction-field-container').map((idx, container) => {
        var children = $(container).children();
        return {
            factionId: children.eq(0).find('select :selected').val(),
            sideName: children.eq(1).find('select :selected').val(),
            gearTemplateId: children.eq(2).find('select :selected').val(),
            uniformTemplateId: children.eq(3).find('select :selected').val()
        } 
    }).toArray();
}

function initAddons() {
    ADMIRAL_FIELD = $('#admiral').eq(0);
    PLANK_FIELD = $('#plank').eq(0);
}

function initGenerateMission() {
    GENERATE_MISSION_BUTTON = $('#generate-mission').eq(0);
    GENERATE_MISSION_BUTTON.click(generateMission);
}

function getMission(): Mission.Mission {
    return {
        terrainId: TERRAIN_FIELD.find(':selected').val(),
        missionTypeName: MISSION_TYPE_FIELD.find(':selected').val(),
        maxPlayers: MAX_PLAYERS_FIELD.val(),
        onLoadName: ON_LOAD_NAME_FIELD.val(),
        author: AUTHOR_FIELD.val(),
        briefingName: BRIEFING_NAME_FIELD.val(),
        overviewText: OVERVIEW_TEXT_FIELD.val(),
        factions: getFactions(),
        addons: {
            admiral: ADMIRAL_FIELD.prop('checked'),
            plank: PLANK_FIELD.prop('checked')
        }
    }
}

function generateMission() {
    console.log(getMission());   
}

export function init() {
    initMissionFields(Mission.getTerrains(), Mission.getMissionTypes());
    initFactions();
    initAddons();
    initGenerateMission();
}