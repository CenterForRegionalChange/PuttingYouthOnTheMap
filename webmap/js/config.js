// Services Provider.  Uncomment the line to provide services from the map server
// Additional comments here
// varSerProv = "http://interact.regionalchange.ucdavis.edu" //Production Server
varSerProv = "http://crcdemo.caes.ucdavis.edu" //Development Server

// Location of the geocode service
var GEOCODE_URL = "http://tasks.arcgis.com/ArcGIS/rest/services/WorldLocator/GeocodeServer";

// Location of the print service
//var PRINT_URL = "http://interact.regionalchange.ucdavis.edu/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
var PRINT_URL =varSerProv.concat("/arcgis/rest/services/PYOM/ExportWebMap/GPServer/Export%20Web%20Map");
// For fixing an issue with the ESRI print return. 
// The first array element is your internal server address. The second is the external address to replace it with.
// Set this equal to null if no replacement is necessary --> var PRINT_PROXY_REPLACE = null;
//var PRINT_PROXY_REPLACE = ['vags101a', 'mapserver.vestra.com'];
var PRINT_PROXY_REPLACE = null;

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
//  if the feature contains a CntyNm or COUNTY_1 field, it will display in the popup as "County: Sacramento".
var POPUP_FIELDS = [
    { field: "COUNTY_1", title: "County"}, 
    { field: "CntyNm", title: "County"}];

// For translating MOE values to text. The values below correspond to [0, 1, 2, 3], with -99 or anything zero or less being treated as zero
//  and thus loading whatever is in that first position.
var MOE_RANGES = ['n/a','Under 35%','35-50%','Over 50%'];

// An array of years for which data exists in the app's map services
var DATA_YEARS = [2010, 2011, 2012];
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
        selectedGraphics: {}
    }];
    


var SERVICES = [{
        // Name isn't used anywhere - it's just for reference when editing this file
        name: "Youth Wellbeing",
        // The URL to the ArcGIS server service
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service345_well_district/"),
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
        defaultLayerIndex: [1],
        // Use this parameter to tell the application what the field names are for gender and ethnicity disaggregated values, per layer.
        // There is one {...} item per layer index in the service. It is vital that this remains true and a 1-for-1 relationship.
        // In the case of group layers (which will have no relevant data), simply include an empty { }, with an optional comment inside for clarity, as shown below.
        // The gender and ethnicity keys before the : are fixed and must be included exactly as typed, if new layers are added.
        // The portion after the : is the name of the field in the feature class with the data for that gender or ethnicty.
        // If the feature class does not include data for a given gender or ethnicty, supply a value of false, without quotes, as shown below in some cases.
        disagg: [{
                // topmost group layer, no data
            }, {
                overall: "dywi001", male: "dywi101", female: "dywi201", amind: "dywi011", asian: false, asian_nf: "dywi021", black: "dywi031", filipino: "dywi041", hispanic: "dywi051", islander: "dywi061", white: "dywi071", multi: "dywi081"
            },{
                // health domain group layer, no data
            }, {
                overall: "dpha001", male: "dpha101", female: "dpha201", amind: "dpha011", asian: false, asian_nf: "dpha021", black: "dpha031", filipino: "dywi041", hispanic: "dpha051", islander: "dywi061", white: "dpha071", multi: "dpha081"
            }, {
                overall: "dphb001", male: "dphb101", female: "dphb201", amind: "dphb011", asian: false, asian_nf: "dphb021", black: "dphb031", filipino: "dywi041", hispanic: "dphb051", islander: "dywi061", white: "dphb071", multi: "dphb081"
            }, {
                overall: "dphc001", male: "dphc101", female: "dphc201", amind: "dphc011", asian: false, asian_nf: "dphc021", black: "dphc031", filipino: "dywi041", hispanic: "dphc051", islander: "dywi061", white: "dphc071", multi: "dphc081"
            }, {
                overall: "dphd001", male: "dphd101", female: "dphd201", amind: "dphd011", asian: false, asian_nf: "dphd021", black: "dphd031", filipino: "dywi041", hispanic: "dphd051", islander: "dywi061", white: "dphd071", multi: "dphd081"
            }, {
                overall: "dphe001", male: "dphe101", female: "dphe201", amind: "dphe011", asian: false, asian_nf: "dphe021", black: "dphe031", filipino: "dywi041", hispanic: "dphe051", islander: "dywi061", white: "dphe071", multi: "dphe081"
            }, {
                // education domain group layer, no data
            }, {
                overall: "deda001", male: "deda101", female: "deda201", amind: "deda011", asian: false, asian_nf: "deda021", black: "deda031", filipino: "dywi041", hispanic: "deda051", islander: "dywi061", white: "deda071", multi: "deda081"
            }, {
                overall: "dedb001", male: "dedb101", female: "dedb201", amind: "dedb011", asian: false, asian_nf: "dedb021", black: "dedb031", filipino: "dywi041", hispanic: "dedb051", islander: "dywi061", white: "dedb071", multi: "dedb081"
            }, {
                overall: "dedc001", male: "dedc101", female: "dedc201", amind: "dedc011", asian: false, asian_nf: "dedc021", black: "dedc031", filipino: "dywi041", hispanic: "dedc051", islander: "dywi061", white: "dedc071", multi: "dedc081"
            }, {
                // social domain group layer, no data
            }, {
                overall: "dsca001", male: "dsca101", female: "dsca201", amind: "dsca011", asian: false, asian_nf: "dsca021", black: "dsca031", filipino: "dywi041", hispanic: "dsca051", islander: "dywi061", white: "dsca071", multi: "dsca081"
            }, {
                overall: "dscb001", male: "dscb101", female: "dscb201", amind: "dscb011", asian: false, asian_nf: "dscb021", black: "dscb031", filipino: "dywi041", hispanic: "dscb051", islander: "dywi061", white: "dscb071", multi: "dscb081"
            }, {
                // community domain group layer, no data            
            }, {
                overall: "dcma001", male: "dcma101", female: "dcma201", amind: "dcma011", asian: false, asian_nf: "dcma021", black: "dcma031", filipino: "dywi041", hispanic: "dcma051", islander: "dywi061", white: "dcma071", multi: "dcma081"
            }, {
                overall: "dcmb001", male: "dcmb101", female: "dcmb201", amind: "dcmb011", asian: false, asian_nf: "dcmb021", black: "dcmb031", filipino: "dywi041", hispanic: "dcmb051", islander: "dywi061", white: "dcmb071", multi: "dcmb081"
            }],
        chart: [{
                // topmost group layer, no data
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "ywi", subs: ["pha", "eda", "sca", "cma"], scale: "%", subScale: "%",
                title: "Index of Youth Wellbeing: All", subTitle: "Score Breakdown",
                categories: ['District', 'State Average'], subCategories: ['Health', 'Education', 'Social', 'Community'], subColors: null,
                subLayerNames: {"pha": "Health", "eda": "Education", "sca": "Social Relationships", "cma": "Community Involvement"},
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }, {
                // health domain group layer, no data
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
                // education domain group layer, no data
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
                // group layer, no data
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
                // group layer, no data
            }, {
                local: "d", region: "s", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "cma", subs: [], scale: "%",
                title: "Community Involvement Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true, showRates: false, showEquity: true
            }]
    }, {
        name: "Youth Vuln",
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service12_vuln_tract_1/"),
        layerObs: [],
        defaultForMap: [1],
        defaultLayerIndex: [2],
        disagg: [{
                // group layer, no data
            }, {
                // group layer, no data
            }, {
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
                // group layer, no data
            }, {
                overall: "gnhs001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "gpov001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "gtb001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }],
        chart: [{
                // group layer, no data
            }, {
                // group layer, no data
            }, {
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
                // group layer, no data
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
        defaultForMap: [],
        defaultLayerIndex: [],
        disagg: [],
        chart: [{
                // group layer, no data
            }, {
                // group layer, no data
            }, {
                local: "c", region: "s", tractField: "", countyField: "CtyName", districtField: "",
                unit: "ytcvap10", subs: [], scale: "%", specificValueField: "cytcv10", valueLabel: "Number of cvap youth",
                title: "2010 Citizen Voting Age Population: % Youth (Age 18-24)",
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
                // group layer, no data
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
        defaultForMap: [2],
        defaultLayerIndex: [4],
        disagg: [],
        chart: []
    }, {
        name: "Other",
        url: varSerProv.concat("/arcgis/rest/services/PYOM/Service7_Other_1/"),
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
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