// yo



/* Configuration file for the ROI webmap
    Copyright (C) 2015  Center for Regional Change, University of California, Davis

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Services Provider.  Uncomment the line to provide services from the map server
// Note that the active line will need to be switched when you move code between the development and production servers
// Additional comments here

// Production/Development switch.
var isProd = false; // Set to false to run the development site

if (isProd == false) {
	varSerProv = "http://crcdemo.caes.ucdavis.edu"; //Development Server
} else {
	varSerProv = "http://interact.regionalchange.ucdavis.edu" //Production Server;
};

// Location of the geocode service
var GEOCODE_URL = "http://tasks.arcgis.com/ArcGIS/rest/services/WorldLocator/GeocodeServer";

// Location of the print service
//var PRINT_URL = "http://interact.regionalchange.ucdavis.edu/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
var PRINT_URL = varSerProv.concat("/arcgis/rest/services/PYOM/ExportWebMap/GPServer/Export%20Web%20Map");
// For fixing an issue with the ESRI print return. 
// The first array element is your internal server address. The second is the external address to replace it with.
// Set this equal to null if no replacement is necessary --> var PRINT_PROXY_REPLACE = null;
//var PRINT_PROXY_REPLACE = ['vags101a', 'mapserver.vestra.com'];
var PRINT_PROXY_REPLACE = null;
var SOCIAL_MEDIA_PRINT_TEMPLATE = "letter";
var PRINT_SOURCE_TEXT = "http://interact.regionalchange.ucdavis.edu/youth/";

// Proxy page, necessary for print functionality
var PROXY_PAGE = "/agsproxy/proxy.ashx";

// Title that will display in various parts of the application
var VIEWER_TITLE = "Putting Youth on the Map";

// Default extent that the viewer will open to
var CA_EXTENT_JSON = { "xmin": -13793000, "ymin": 3686700, "xmax": -12800000, "ymax": 5300000, "spatialReference": { "wkid": 102100 } };

// Basemaps to be available in the order they'll appear in the dropdown.  
// First in the list will be the default shown when the viewer loads.
var BASEMAPS = [{
        // name text is what shows in the dropdown box
        name: "Streets",
        // the path to the basemap service
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
    }, {
        name: "Terrain",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
    }, {
        name: "Aerial",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }, {
        name: "Grey",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"
    }];

// List of gender identifiers. This text will show in (...) after the layer titles in the blue bar above the maps and on charts.
var GENDER = ["All", "Males", "Females"];

// List of ethnicity identifiers. This text will show in (...) after the layer titles in the blue bar above the maps and on charts.
var ETH = ["All", "Nat.Amer/Alask", "Asian", "Black", "Filipino", "Hispanic", "Pac.Islander", "White", "Two or More"];

// On the popup box - if the clicked polygon contains a field mathcing any of the names listed under "field:", then display its
//  value in the popup box with the title in the "title:" portion.  For example, using the existing options below:
//  if the feature contains a CntyNm or COUNTY_1 or County field, it will display in the popup as "County: Sacramento".
var POPUP_FIELDS = [
    { field: "COUNTY_1", title: "County"}, 
	{ field: "County", title: "County"}, 
    { field: "CntyNm", title: "County"}];

// For translating MOE values to text. The values below correspond to [0, 1, 2, 3], with -99 or anything zero or less being treated as zero
//  and thus loading whatever is in that first position.
var MOE_RANGES = ['n/a','Under 35%','35-50%','Over 50%'];

// An array of years for which data exists in the app's map services
var DATA_YEARS = [2010, 2011, 2012, 2013];
var DEFAULT_YEAR = 2010;

// Storage variables.
// These are for application use - do not modify.
var OP_MAPS = [{
        name: "Map One",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        preloadExtent: null,
        preloadRendererField: "",
        selectedGraphics: {}
    }, {
        name: "Map Two",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        preloadExtent: null,
        preloadRendererField: "",
        selectedGraphics: {}
    }, {
        name: "Map Three",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        preloadExtent: null,
        preloadRendererField: "",
        selectedGraphics: {}
    }];
    


var SERVICES = [{
        // Name isn't used anywhere - it's just for reference when editing this file
        name: "Youth Wellbeing",
        // The URL to the ArcGIS server service
        url: varSerProv.concat("/arcgis/rest/services/Vestra/PYOM_ywi_SchoolDist/"),
        // This is required to be here, but should always be set to [] in this file. The application will make use of it later.
        layerObs: [],
        // If any of the services in this layer should show in a map tab when the application initially loads, then include the map #'s here.
        //  Maps numbers are 0, 1 and 2, from left to right. 
        // If layers from this service should default into more than one map, include both #'s here,
        //  for example [0, 1], if layers from this service will be present by default in the first and second map
        defaultForMap: [0],
        // If any of the services in this layer should show in a map tab when the application initially loads, then include the layer index for those layers here.
        //  The layer index numbers can be seen in (#) after the layer names when looking at the map service details in a web browser,
        //  (i.e. pasting the URL above into browser and adding MapServer to the end of it, 
        //   like: http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service345_well_district/MapServer)
        // If layers from this service should default into more than one map, include one layer index per map # from the prior defaultForMap config item,
        //  for example [3, 5], if layer 3 from this service should go into the first map, and layer 5 should go into the second map, following along
        //  with the example from the prior defaultForMap item.
        defaultLayerIndex: [0],
        //
        toc: [
            { id: 0, name: "Youth Well-Being Index", parentLayerId: -1, subLayerIndices: [1, 2, 8, 12, 15] }, 
            { id: 0, name: "Youth Well-Being Index", parentLayerId: 0, subLayerIndices: null },
            { id: 1, name: "Health", parentLayerId: 0, subLayerIndices: [3, 4, 5, 6, 7] }, 
            { id: 1, name: "Health", parentLayerId: 1, subLayerIndices: null }, 
            { id: 2, name: "Physical Fitness", parentLayerId: 1, subLayerIndices: null }, 
            { id: 3, name: "Substance Use Avoidance", parentLayerId: 1, subLayerIndices: null }, 
            { id: 4, name: "Feeling Safe", parentLayerId: 1, subLayerIndices: null }, 
            { id: 5, name: "Feeling Safe at School", parentLayerId: 1, subLayerIndices: null }, 
            { id: 6, name: "Education", parentLayerId: 0, subLayerIndices: [9, 10, 11] }, 
            { id: 6, name: "Education", parentLayerId: 6, subLayerIndices: null }, 
            { id: 7, name: "High School Graduation Rate", parentLayerId: 6, subLayerIndices: null }, 
            { id: 8, name: "University Ready", parentLayerId: 6, subLayerIndices: null }, 
            { id: 9, name: "Social Relationships", parentLayerId: 0, subLayerIndices: [13, 14] }, 
            { id: 9, name: "Social Relationships", parentLayerId: 9, subLayerIndices: null }, 
            { id: 10, name: "Positive Relationships", parentLayerId: 9, subLayerIndices: null }, 
            { id: 11, name: "Community Involvement", parentLayerId: 0, subLayerIndices: [16] }, 
            { id: 11, name: "Community Involvement", parentLayerId: 11, subLayerIndices: null }
        ],
        // Use this parameter to tell the application what the field names are for gender and ethnicity disaggregated values, per layer.
        // There is one {...} item per layer index in the service. It is vital that this remains true and a 1-for-1 relationship.
        // The gender and ethnicity keys before the : are fixed and must be included exactly as typed, if new layers are added.
        // The portion after the : is the name of the field in the feature class with the data for that gender or ethnicty.
        // If the feature class does not include data for a given gender or ethnicty, supply a value of false, without quotes, as shown below in some cases.
        disagg: [
            { overall: "dywi001", male: "dywi101", female: "dywi201", amind: "dywi011", asian: false, asian_nf: "dywi021", black: "dywi031", filipino: "dywi041", hispanic: "dywi051", islander: "dywi061", white: "dywi071", multi: "dywi081" },
            { overall: "dpha001", male: "dpha101", female: "dpha201", amind: "dpha011", asian: false, asian_nf: "dpha021", black: "dpha031", filipino: "dywi041", hispanic: "dpha051", islander: "dywi061", white: "dpha071", multi: "dpha081" }, 
            { overall: "dphb001", male: "dphb101", female: "dphb201", amind: "dphb011", asian: false, asian_nf: "dphb021", black: "dphb031", filipino: "dywi041", hispanic: "dphb051", islander: "dywi061", white: "dphb071", multi: "dphb081" }, 
            { overall: "dphc001", male: "dphc101", female: "dphc201", amind: "dphc011", asian: false, asian_nf: "dphc021", black: "dphc031", filipino: "dywi041", hispanic: "dphc051", islander: "dywi061", white: "dphc071", multi: "dphc081" }, 
            { overall: "dphd001", male: "dphd101", female: "dphd201", amind: "dphd011", asian: false, asian_nf: "dphd021", black: "dphd031", filipino: "dywi041", hispanic: "dphd051", islander: "dywi061", white: "dphd071", multi: "dphd081" }, 
            { overall: "dphe001", male: "dphe101", female: "dphe201", amind: "dphe011", asian: false, asian_nf: "dphe021", black: "dphe031", filipino: "dywi041", hispanic: "dphe051", islander: "dywi061", white: "dphe071", multi: "dphe081" }, 
            { overall: "deda001", male: "deda101", female: "deda201", amind: "deda011", asian: false, asian_nf: "deda021", black: "deda031", filipino: "dywi041", hispanic: "deda051", islander: "dywi061", white: "deda071", multi: "deda081" }, 
            { overall: "dedb001", male: "dedb101", female: "dedb201", amind: "dedb011", asian: false, asian_nf: "dedb021", black: "dedb031", filipino: "dywi041", hispanic: "dedb051", islander: "dywi061", white: "dedb071", multi: "dedb081" }, 
            { overall: "dedc001", male: "dedc101", female: "dedc201", amind: "dedc011", asian: false, asian_nf: "dedc021", black: "dedc031", filipino: "dywi041", hispanic: "dedc051", islander: "dywi061", white: "dedc071", multi: "dedc081" }, 
            { overall: "dsca001", male: "dsca101", female: "dsca201", amind: "dsca011", asian: false, asian_nf: "dsca021", black: "dsca031", filipino: "dywi041", hispanic: "dsca051", islander: "dywi061", white: "dsca071", multi: "dsca081" }, 
            { overall: "dscb001", male: "dscb101", female: "dscb201", amind: "dscb011", asian: false, asian_nf: "dscb021", black: "dscb031", filipino: "dywi041", hispanic: "dscb051", islander: "dywi061", white: "dscb071", multi: "dscb081" }, 
            { overall: "dcma001", male: "dcma101", female: "dcma201", amind: "dcma011", asian: false, asian_nf: "dcma021", black: "dcma031", filipino: "dywi041", hispanic: "dcma051", islander: "dywi061", white: "dcma071", multi: "dcma081" }, 
            { overall: "dcmb001", male: "dcmb101", female: "dcmb201", amind: "dcmb011", asian: false, asian_nf: "dcmb021", black: "dcmb031", filipino: "dywi041", hispanic: "dcmb051", islander: "dywi061", white: "dcmb071", multi: "dcmb081" }
        ],
        chart: [{
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "ywi", subs: ["pha", "eda", "sca", "cma"], scale: "%", subScale: "%",
                title: "Index of Youth Wellbeing: All", subTitle: "Score Breakdown",
                categories: ['District', 'State Average'], subCategories: ['Health', 'Education', 'Social', 'Community'], subColors: null,
                subLayerNames: {"pha": "Health", "eda": "Education", "sca": "Social Relationships", "cma": "Community Involvement"},
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "pha", subs: ['phb', 'phc', 'phd'], scale: "%", subScale: "%", // re-enabling the subs array will cause a 2nd chart to show for the indicators in this domain (requires data to be visible in the layer)
                title: "Youth Wellbeing Health", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['Phys. Fitness', 'Subst. Use Avoidance', 'Feeling Safe'], subColors: null,
                subLayerNames: {"phb": "Physical Fitness", "phc": "Substance Use Avoidance", "phd": "Feeling Safe" },
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phb", subs: [], scale: "%",
                title: "Physical Fitness",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phc", subs: [], scale: "%",
                title: "Substance Use Avoidance",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phd", subs: [], scale: "%",
                title: "Feeling Safe",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phe", subs: [], scale: "%",
                title: "Feeling Safe at School",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "eda", subs: ['edb', 'edc'], scale: "%", subScale: "%", 
                title: "Youth Wellbeing Education", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['High School Graduation Rate', 'University Ready'], subColors: null,
                subLayerNames: {"edb": "High School Graduation Rate", "edc": "University Ready" },
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "edb", subs: [], scale: "%",
                title: "High School Graduation Rate",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "edc", subs: [], scale: "%",
                title: "University Ready",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "sca", subs: ['scb'], scale: "%",
                title: "Social Relationships", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['Positive Relationships'], subColors: null,
                subLayerNames: {"scb": "Positive Relationships" },
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "scb", subs: [], scale: "%",
                title: "Positive Relationships",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "cma", subs: [], scale: "%",
                title: "Community Involvement Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }]
    }, {
        name: "Youth Vuln",
        url: varSerProv.concat("/arcgis/rest/services/Vestra/Service12_vuln_ungrouped/"),
        layerObs: [],
        defaultForMap: [1],
        defaultLayerIndex: [0],
        toc: [
            { id: 0, name: "Youth Vulnerability Index", parentLayerId: -1, subLayerIndices: [1, 7] }, 
            { id: 0, name: "Youth Vulnerability Index: County", parentLayerId: -1, subLayerIndices: [2, 3, 4, 5, 6] }, 
            { id: 0, name: "Youth Vulnerability Index: County", parentLayerId: 0, subLayerIndices: null }, 
            { id: 1, name: "Foster Care Entry Rate: County", parentLayerId: 0, subLayerIndices: null }, 
            { id: 2, name: "High School Non-Completion Rate: County", parentLayerId: 0, subLayerIndices: null }, 
            { id: 3, name: "Poverty Rate: County", parentLayerId: 0, subLayerIndices: null }, 
            { id: 4, name: "Teen Birth Rate: County", parentLayerId: 0, subLayerIndices: null }, 
            { id: 5, name: "Youth Vulnerability Index: CCD", parentLayerId: 0, subLayerIndices: [8, 9, 10] }, 
            { id: 5, name: "High School Non-Completion Rate: CCD", parentLayerId: -1, subLayerIndices: null }, 
            { id: 6, name: "Poverty Rate: CCD", parentLayerId: -1, subLayerIndices: null }, 
            { id: 7, name: "Teen Birth Rate: CCD", parentLayerId: -1, subLayerIndices: null }
        ],
        disagg: [{
                overall: "cyvi001", male: "cyvi101", female: "cyvi201", amind: "cyvi011", asian: "cyvi021", asian_nf: false, black: "cyvi031", filipino: false, hispanic: "cyvi051", islander: false, white: "cyvi071", multi: "cyvi081"
            }, {
                overall: "cfc001", male: "cfc101", female: "cfc201", amind: "cfc011", asian: "cfc021", asian_nf: false, black: "cfc031", filipino: false, hispanic: "cfc051", islander: false, white: "cfc071", multi: "cfc081"
            }, {
                overall: "cnhs001", male: "cnhs101", female: "cnhs201", amind: "cnhs011", asian: "cnhs021", asian_nf: false, black: "cnhs031", filipino: false, hispanic: "cnhs051", islander: false, white: "cnhs071", multi: "cnhs081"
            }, {
                overall: "cpov001", male: "cpov101", female: "cpov201", amind: "cpov011", asian: "cpov021", asian_nf: false, black: "cpov031", filipino: false, hispanic: "cpov051", islander: false, white: "cpov071", multi: "cpov081"
            }, {
                overall: "ctb001", male: false, female: false, amind: "ctb011", asian: "ctb021", asian_nf: false, black: "ctb031", filipino: false, hispanic: "ctb051", islander: false,  white: "ctb071", multi: "ctb081"
            }, {
                overall: "gnhs001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "gpov001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "gtb001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }],
        chart: [{
                local: "c", region: "s", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "yvi", subs: ["fc","nhs","pov","tb"], scale: 5, subScale: 5, hoverFormat: "%",
                title: "Youth Vulnerability Index", subTitle: "Score Breakdown",
                categories: ['County', 'State Average'], subCategories: ['Foster Care', 'High School Dropout', 'Poverty Rate', 'Teen Birth Rate'], subColors: null,
                subLayerNames: { "fc": "Foster Care Entry Rate: County", "nhs": "High School Non-Completion Rate: County", "pov": "Poverty Rate: County", "tb": "Teen Birth Rate: County" }, //High School Dropout Rate: County
                showMOE: false, showCHKS: false, showRates: true, showEquity: true
            }, {
                local: "c", region: "s", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "fc", subs: [], scale: 5, hoverFormat: "## per 1000",
                title: "Foster Care Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: true
            }, {
                local: "c", region: "s", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "nhs", subs: [], scale: 5, hoverFormat: "%",
                title: "High School Dropout Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: true
            }, {
                local: "c", region: "s", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "pov", subs: [], scale: 5, hoverFormat: "%",
                title: "Poverty Rate Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: true
            }, {
                local: "c", region: "s", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "tb", subs: [], scale: 5, hoverFormat: "##",
                title: "Teen Births Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: true
            }, {
                local: "g", region: "s", ccdField: "NAMELSAD10", //countyField: "",
                unit: "nhs", subs: [], scale: 5, hoverFormat: "%",
                title: "High School Dropout Score",
                categories: ['CCD', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "g", region: "s", ccdField: "NAMELSAD10",
                unit: "pov", subs: [], scale: 5, hoverFormat: "%", //countyField: "",
                title: "Poverty Rate Score",
                categories: ['CCD', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "g", region: "s", ccdField: "NAMELSAD10",
                unit: "tb", subs: [], scale: 5, hoverFormat: "##", //countyField: "",
                title: "Teen Births Score",
                categories: ['CCD', 'State Average'],
                showMOE: true, showCHKS: false, showRates: true, showEquity: false
            }]
    }, {
        name: "Civic Engagement",
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service9_CivicEng/"),
        layerObs: [],
        defaultForMap: [2],
        defaultLayerIndex: [8],
        disagg: [],
        toc: [
            { id: 0, name: "YOUTH VOTING - CCEP", subLayerIndices: [1, 26] },
            { id: 1, name: "YOUTH VOTING - CCEP: County", subLayerIndices: [2, 10, 18] },
            { id: 2, name: "2014", subLayerIndices: [3, 4, 5, 6, 7, 8, 9] },
            { id: 3, name: "2014 Citizen Voting Age Population: % Youth (Age 18-24)", subLayerIndices: null },
            { id: 4, name: "2014 General Election Registered Voters: % Youth (Age 18-24)", subLayerIndices: null },
            { id: 5, name: "2014 General Election Voters: % Youth (Age 18-24)", subLayerIndices: null },
            { id: 6, name: "2014 General Election Voters: % Age 65+", subLayerIndices: null },
            { id: 7, name: "2014 General Election: Youth (Age 18-24) Registered Voter Turnout", subLayerIndices: null },
            { id: 8, name: "2014 General Election Youth (Age 18-24) Eligible Voter Turnout", subLayerIndices: null },
            { id: 9, name: "2014 General Election Youth (Age 18-24) Registration Rates", subLayerIndices: null },
            { id: 10, name: "2012", subLayerIndices: [11, 12, 13, 14, 15, 16, 17] },
            { id: 11, name: "2012 Citizen Voting Age Population: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 12, name: "2012 General Election Registered Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 13, name: "2012 General Election Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 14, name: "2012 General Election Voters: % Age 64+", subLayerIndices: null },
            { id: 15, name: "2012 General Election: Youth (Age 18-23) Registered Voter Turnout", subLayerIndices: null },
            { id: 16, name: "2012 General Election Youth (Age 18-23) Eligible Voter Turnout", subLayerIndices: null },
            { id: 17, name: "2012 General Election Youth (Age 18-23) Registration Rates", subLayerIndices: null },
            { id: 18, name: "2010", subLayerIndices: [19, 20, 21, 22, 23, 24, 25] },
            { id: 19, name: "2010 Citizen Voting Age Population: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 20, name: "2010 General Election Registered Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 21, name: "2010 General Election Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 22, name: "2010 General Election Voters: % Age 64+", subLayerIndices: null },
            { id: 23, name: "2010 General Election: Youth (Age 18-23) Registered Voter Turnout", subLayerIndices: null },
            { id: 24, name: "2010 General Election Youth (Age 18-23) Eligible Voter Turnout", subLayerIndices: null },
            { id: 25, name: "2010 General Election Youth (Age 18-23) Registration Rates", subLayerIndices: null },
            { id: 26, name: "YOUTH VOTING - CCEP: Tract", subLayerIndices: [27, 28, 29, 30] },
            { id: 27, name: "2010 General Election Registered Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 28, name: "2010 General Election Voters: % Youth (Age 18-23)", subLayerIndices: null },
            { id: 29, name: "2010 General Election Voters: % Age 64+", subLayerIndices: null },
            { id: 30, name: "2010 General Election: Youth (Age 18-23) Registered Voter Turnout", subLayerIndices: null }
        ],
        chart: [{
                // group layer, no data, VOTER DATA - CCEP 
            }, {
			    // group layer, no data, VOTER DATA - CCEP: County
            }, {
                // group layer, no data, 2014
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytcvap14", subs: [], scale: "%", specificValueField: "cytcv14", valueLabel: "Number of cvap youth",
                title: "2014 Citizen Voting Age Population: % Youth (Age 18-24)",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yregvr14", subs: ["ydemrv14","yreprv14","ynpprv14"], scale: "%", specificValueField: "cyregv14",
                title: "2014 General Election Registered Voters: % Youth (Age 18-24)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth registered ",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytotv14", subs: ["ydemav14","yrepav14","ynppav14"], scale: "%", specificValueField: "cyactv14",
                title: "2014 General Election Voters: % Youth (Age 18-24)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ototv14", subs: [], scale: "%", specificValueField: "coactv14", valueLabel: "Number of age 64+ voters",
                title: "2014 General Election Voters: % Age 65+",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrvtout14", subs: ["ydemav14","yrepav14","ynppav14"], scale: "%", specificValueField: "cyregv14",
                title: "2014 General Election: Youth (Age 18-24) Registered Voter Turnout", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yeliout14", subs: [], scale: "%", specificValueField: "cyactv14", valueLabel: "Number of youth voters",
                title: "2014 General Election Youth (Age 18-24) Eligible Voter Turnout",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrrate14", subs: [], scale: "%", specificValueField: "cyregv14", valueLabel: "Number of youth  registered",
                title: "2014 General Election Youth (Age 18-24) Registration Rates",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
			    // group layer, no data, 2012
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytcvap12", subs: [], scale: "%", specificValueField: "cytcv12", valueLabel: "Number of cvap youth",
                title: "2012 Citizen Voting Age Population: % Youth (Age 18-23)",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yregvr12", subs: ["ydemrv12","yreprv12","ynpprv12"], scale: "%", specificValueField: "cyregv12",
                title: "2012 General Election Registered Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth registered ",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytotv12", subs: ["ydemav12","yrepav12","ynppav12"], scale: "%", specificValueField: "cyactv12",
                title: "2012 General Election Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ototv12", subs: [], scale: "%", specificValueField: "coactv12", valueLabel: "Number of age 64+ voters",
                title: "2012 General Election Voters: % Age 64+",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrvtout12", subs: ["ydemav12","yrepav12","ynppav12"], scale: "%", specificValueField: "cyregv12",
                title: "2012 General Election: Youth (Age 18-23) Registered Voter Turnout", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yeliout12", subs: [], scale: "%", specificValueField: "cyactv12", valueLabel: "Number of youth voters",
                title: "2012 General Election Youth (Age 18-23) Eligible Voter Turnout",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrrate12", subs: [], scale: "%", specificValueField: "cyregv12", valueLabel: "Number of youth  registered",
                title: "2012 General Election Youth (Age 18-23) Registration Rates",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
			    // group layer, no data, 2010
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytcvap10", subs: [], scale: "%", specificValueField: "cytcv10", valueLabel: "Number of cvap youth",
                title: "2010 Citizen Voting Age Population: % Youth (Age 18-23)",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yregvr10", subs: ["ydemrv10","yreprv10","ynpprv10"], scale: "%", specificValueField: "cyregv10",
                title: "2010 General Election Registered Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth registered ",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytotv10", subs: ["ydemav10","yrepav10","ynppav10"], scale: "%", specificValueField: "cyactv10",
                title: "2010 General Election Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ototv10", subs: [], scale: "%", specificValueField: "coactv10", valueLabel: "Number of age 64+ voters",
                title: "2010 General Election Voters: % Age 64+",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrvtout10", subs: ["ydemav10","yrepav10","ynppav10"], scale: "%", specificValueField: "cyregv10",
                title: "2010 General Election: Youth (Age 18-23) Registered Voter Turnout", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['County', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yeliout10", subs: [], scale: "%", specificValueField: "cyactv10", valueLabel: "Number of youth voters",
                title: "2010 General Election Youth (Age 18-23) Eligible Voter Turnout",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "yrrate10", subs: [], scale: "%", specificValueField: "cyregv10", valueLabel: "Number of youth  registered",
                title: "2010 General Election Youth (Age 18-23) Registration Rates",
                categories: ['County', 'State Average'],
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                // group layer, no data, tract 2010
            }, {
                local: "t", region: "s", tractField: "GEOID10", countyField: "CtyName", districtField: "",
                unit: "prg1_10", subs: ["prg2_10","prg3_10","prg4_10"], scale: "%", specificValueField: "tregy1_10",
                title: "2010 General Election Registered Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth registered",
                categories: ['Tract', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "t", region: "s", tractField: "Tract", countyField: "CtyName", districtField: "",
                unit: "pvy1_10", subs: ["pvy3_10","pvy4_10","pvy5_10"], scale: "%", specificValueField: "tregy1_10",
                title: "2010 General Election Voters: % Youth (Age 18-23)", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['Tract', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "t", region: "s", tractField: "GEOID10", countyField: "", districtField: "",
                unit: "pvo2_10", subs: ["pvo6_10","pvo7_10","pvo8_10"], scale: "%", specificValueField: "trego2_10",
                title: "2010 General Election Voters: % Age 64+", subTitle: "Breakdown by Political Party", valueLabel: "Number of age 64+ voters",
                categories: ['Tract', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }, {
                local: "t", region: "s", tractField: "GEOID10", countyField: "CtyName", districtField: "",
                unit: "rto1_10", subs: ["pvy3_10","pvy4_10","pvy5_10"], scale: "%", specificValueField: "tregy1_10",
                title: "2010 General Election: Youth (Age 18-23) Registered Voter Turnout", subTitle: "Breakdown by Political Party", valueLabel: "Number of youth voters",
                categories: ['Tract', 'State Average'], subCategories: ['Democratic', 'Republican', 'No Political Pref'],
                subColors: ["#9BBB59", "#4BACC6", "#FFC000"], subLayerNames: null,
                showMOE: false, showCHKS: false, showRates: true, showEquity: false
            }]
    }, {
        name: "Demographics",
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service6_YouthDemog_1/"),
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
        toc: [
            { id: 0, name: "YOUTH DEMOGRAPHICS", subLayerIndices: [1] },
            { id: 1, name: "Youth Demographics", subLayerIndices: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
            { id: 2, name: "% of the Population Age 10 to 14", subLayerIndices: null },
            { id: 3, name: "% of the Population Age 15 to 19", subLayerIndices: null },
            { id: 4, name: "% of the Population Age 10 to 19", subLayerIndices: null },
            { id: 5, name: "Number of Youth Age 10 to 14", subLayerIndices: null },
            { id: 6, name: "Number of Youth Age 15 to 19", subLayerIndices: null },
            { id: 7, name: "Number of Youth Age 10 to 19", subLayerIndices: null },
            { id: 8, name: "% of White Youth", subLayerIndices: null },
            { id: 9, name: "% of Black Youth", subLayerIndices: null },
            { id: 10, name: "% of Asian Youth", subLayerIndices: null },
            { id: 11, name: "% of Hispanic Youth", subLayerIndices: null },
            { id: 12, name: "% of Amer. Ind/Alaskan Native Youth", subLayerIndices: null },
            { id: 13, name: "% of Hawaiian Native/Pac. Isl. Youth", subLayerIndices: null },
            { id: 14, name: "Number of White Youth", subLayerIndices: null },
            { id: 15, name: "Number of Black Youth", subLayerIndices: null },
            { id: 16, name: "Number of Asian Youth", subLayerIndices: null },
            { id: 17, name: "Number of Hispanic Youth", subLayerIndices: null },
            { id: 18, name: "Number of Amer. Ind/Alaskan Native Youth", subLayerIndices: null },
            { id: 19, name: "Number of Hawaiian Native/Pac. Isl. Youth", subLayerIndices: null }
        ],
        disagg: [],
        chart: []
    }, {
        name: "Other",
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service7_Other_1/"),
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
        toc: [
            { id: 0, name: "OTHER", subLayerIndices: [1, 11, 20, 31, 37, 40, 41] },
            { id: 1, name: "Percent Out of Work and Out of School", subLayerIndices: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
            { id: 2, name: "All - % Out of Work and School", subLayerIndices: null },
            { id: 3, name: "Male - % Out of Work and School", subLayerIndices: null },
            { id: 4, name: "Female - % Out of Work and School", subLayerIndices: null },
            { id: 5, name: "Native Am./Alaskan - % Out of Work and School", subLayerIndices: null },
            { id: 6, name: "Asian - % Out of Work and School", subLayerIndices: null },
            { id: 7, name: "Hispanic - % Out of Work and School", subLayerIndices: null },
            { id: 8, name: "Black - % Out of Work and School", subLayerIndices: null },
            { id: 9, name: "White - % Out of Work and School", subLayerIndices: null },
            { id: 10, name: "Two or more ethnicities - % Out of Work and School", subLayerIndices: null },
            { id: 11, name: "Sexually Transmitted Diseases", subLayerIndices: [12, 13, 14, 15, 16, 17, 18, 19] },
            { id: 12, name: "Chlamydia Rate Females Age 10-14", subLayerIndices: null },
            { id: 13, name: "Chlamydia Rate Females Age 15-19", subLayerIndices: null },
            { id: 14, name: "Chlamydia Rate Males Age 10-14", subLayerIndices: null },
            { id: 15, name: "Chlamydia Rate Males Age 15-19", subLayerIndices: null },
            { id: 16, name: "Gonorrhea Rate Females Age 10-14", subLayerIndices: null },
            { id: 17, name: "Gonorrhea Rate Females Age 15-19", subLayerIndices: null },
            { id: 18, name: "Gonorrhea Rate Males Age 10-14", subLayerIndices: null },
            { id: 19, name: "Gonorrhea Rate Males Age 15-19", subLayerIndices: null },
            { id: 20, name: "Truancy and Suspensions", subLayerIndices: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { id: 21, name: "Truancy Rate (All Schools)", subLayerIndices: null },
            { id: 22, name: "Suspension Rate (All Schools)", subLayerIndices: null },
            { id: 23, name: "Truancy Rates (Elementary)", subLayerIndices: null },
            { id: 24, name: "Truancy Rates (K-12)", subLayerIndices: null },
            { id: 25, name: "Truancy Rates (Middle/Intermediate/JrHi)", subLayerIndices: null },
            { id: 26, name: "Truancy Rates (High School)", subLayerIndices: null },
            { id: 27, name: "Suspension Rates (Elementary)", subLayerIndices: null },
            { id: 28, name: "Suspension Rates (K-12)", subLayerIndices: null },
            { id: 29, name: "Suspension Rates (Middle/Intermediate/JrHi)", subLayerIndices: null },
            { id: 30, name: "Suspension Rates (High School)", subLayerIndices: null },
            { id: 31, name: "Transit Data", subLayerIndices: [32, 33, 34, 35, 36] },
            { id: 32, name: "Distance to Transit Stop (meters)", subLayerIndices: null },
            { id: 33, name: "% Households With 0 Cars", subLayerIndices: null },
            { id: 34, name: "% Households With 1 Car", subLayerIndices: null },
            { id: 35, name: "% Households With 2+ Cars", subLayerIndices: null },
            { id: 36, name: "Transit Service Frequency", subLayerIndices: null },
            { id: 37, name: "Food Access", subLayerIndices: [38, 39] },
            { id: 38, name: "Food Access (#)", subLayerIndices: null },
            { id: 39, name: "Food Access (%)", subLayerIndices: null },
            { id: 40, name: "Adequate Financial Resources", subLayerIndices: null },
            { id: 41, name: "Building Healthy Communities Boundaries", subLayerIndices: null }
        ],
        disagg: [],
        chart: []
    }];
    
// Configuration for the locator box dropdowns.
// This first is the ArcGIS service that contains all of the layers for searching
//var SEARCH_SVC = "http://crcgis2.caes.ucdavis.edu/ArcGIS/rest/services/PYOM/pyom-05072013/";
// This next parameter holds one {...} section per item that will appear in the dropdown list.
// The order that these sections appear in this list is the order they will appear in the dropdown.
/*
var SEARCH = [{
        title: "School Districts",  // the text that will show in the dropdown box
        index: 1,                   // the layer index for this layer in the map service above
        idField: "SCSDLEA10",       // the field that contains a unique identifier for each feature in the feature class
        compareField: "NAME10"      // the field that will be matched against the text the user types in the search box 
    },{
        title: "California Counties",
        index: 52,
        idField: "FIPS",
        compareField: "COUNTY"
    },{
        title: "State Assembly",
        index: 53,
        idField: "ID",
        compareField: "DISTRICT"
    },{
        title: "US Congressional",
        index: 54,
        idField: "DISTRICT",
        compareField: "DISTRICT"
    },{
        title: "State Senate",
        index: 55,
        idField: "ID",
        compareField: "DISTRICT"
    }];
*/
var SEARCH_SVC = varSerProv.concat("/arcgis/rest/services/PYOM/Service8_Search/");
var SEARCH = [{
        title: "School Districts",
        index: 4,
        idField: "OBJECTID",
        compareField: "NAME10",
        filter: false
    },{
        title: "California Counties",
        index: 2,
        idField: "OBJECTID",
        compareField: "CntyNm",
        filter: false
    },{
        title: "Census Tracts",
        index: 3,
        idField: "OBJECTID",
        compareField: "GEOID10",
        filter: false
    },{
        title: "Cities and Census Designated Places",
        index: 1,
        idField: "OBJECTID",
        compareField: "NAME",
        filter: false
    },{
        title: "State Assembly",
        index: 5,
        idField: "OBJECTID",
        compareField: "AssemblyNa",
        filter: false
    },{
        title: "US Congressional",
        index: 6,
        idField: "OBJECTID",
        compareField: "CongrName",
        filter: false
    },{
        title: "State Senate",
        index: 7,
        idField: "OBJECTID",
        compareField: "SenateName",
        filter: false
    }];	
	
	
// application use - do not modify
var vgis = {
    /**
    * Using a namespace() method on your one global allows the assumption
    * that the namespace exists. That way, each file can call namespace() first to declare
    * the namespace the developers are using, knowing that they won't destroy the name-
    * space if it already exists. This approach also frees developers from the task of
    * checking to see whether the namespace exists before using. 
    * @param {string} ns The new namespace to add, e.g. "vgis.widget.basemap"
    * @returns {object} The newly created namespace.
    * @static
    */
    namespace: function (ns) {
        var parts = ns.split("."),
            object = this,
            i, len;
        for (i = 0, len = parts.length; i < len; i += 1) {
            if (!object[parts[i]]) {
                object[parts[i]] = {};
            }
            object = object[parts[i]];
        }
        return object;
    }
};