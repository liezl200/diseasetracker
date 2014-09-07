
var xhttp = null;
var cities = null;
var states = null;
var diseases = null;
var stateGeo = {'AL':[32.3182314, -86.902298], 
'AK':[64.2008413, -149.4936733], 
'AZ':[34.0489281, -111.0937311], 
'AR':[35.20105, -91.8318334], 
'CA':[36.778261, -119.4179324], 
'CO':[39.5500507, -105.7820674], 
'CT':[41.6032207, -73.087749], 
'DE':[38.9108325, -75.52766989999999], 
'FL':[27.6648274, -81.5157535], 
'GA':[32.1656221, -82.9000751], 
'HI':[19.8967662, -155.5827818], 
'ID':[44.0682019, -114.7420408], 
'IL':[40.6331249, -89.3985283], 
'IN':[40.2671941, -86.1349019], 
'IA':[41.8780025, -93.097702], 
'KS':[39.011902, -98.4842465], 
'KY':[37.8393332, -84.2700179], 
'LA':[30.9842977, -91.96233269999999], 
'ME':[45.253783, -69.4454689], 
'MD':[39.0457549, -76.64127119999999], 
'MA':[42.4072107, -71.3824374], 
'MI':[44.3148443, -85.60236429999999], 
'MN':[46.729553, -94.6858998], 
'MS':[32.3546679, -89.3985283], 
'MO':[37.9642529, -91.8318334], 
'MT':[46.8796822, -110.3625658], 
'NE':[41.4925374, -99.9018131], 
'NV':[38.8026097, -116.419389], 
'NH':[43.1938516, -71.5723953], 
'NJ':[40.0583238, -74.4056612], 
'NM':[34.5199402, -105.8700901], 
'NY':[42.8482, -75.0000], 
'NC':[35.7595731, -79.01929969999999], 
'ND':[47.5514926, -101.0020119], 
'OH':[40.4172871, -82.90712300000001], 
'OK':[35.0077519, -97.092877], 
'OR':[44.0000, -120.5000], 
'PA':[41.2033216, -77.1945247], 
'RI':[41.5800945, -71.4774291], 
'SC':[33.836081, -81.1637245], 
'SD':[43.9695148, -99.9018131], 
'TN':[35.5174913, -86.5804473], 
'TX':[31.9685988, -99.9018131], 
'UT':[39.3209801, -111.0937311], 
'VT':[44.5588028, -72.57784149999999], 
'VA':[37.4315734, -78.6568942], 
'WA':[47.7510741, -120.7401386], 
'WV':[38.5976262, -80.4549026], 
'WI':[43.7844397, -88.7878678], 
'WY':[43.0759678, -107.2902839]};

function getStateGeoCache(){
	return stateGeo;
}
function initializeXMLRequest(){
	if (window.XMLHttpRequest){
		xhttp = new XMLHttpRequest();
	}
	else{ // for IE 5/6
	  xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
}
function spaceReplace(s){
	return s.replace(/ /g, '+');
}
function getLocData(loc_type, loc, state, disease, ev, start, end){
	if(xhttp == null)
		initializeXMLRequest();
	var diseases = [];
	var serverUrl = "http://localhost:8080/locData?" 
		+ 'loc_type=' + spaceReplace(loc_type)
		+ '&state=' + spaceReplace(state)
		+ '&disease=' + spaceReplace(disease)
		+ '&event=' + spaceReplace(ev)
	var dateflg = false; // currently no functionality
	var cityflg = false; // currently no functionality
	if(typeof start != undefined && start != null && start != ""){ //optional query param
		dateflg = true;
		serverUrl += '&start=' + start;
	}
	if(typeof end != undefined && end != null && end != ""){ //optional query param
		dateflg = true;
		serverUrl += '&end=' + end;
	}
	if(typeof loc != undefined && loc != null && loc != ""){
		cityflg = true;
		serverUrl += '&loc='+ loc;
	}
	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	var r = xmlDoc.getElementsByTagName('number');
	var countSum = 0;
	//@todo: add more efficient xml parsing later
	for (i = 0; i < r.length; i++) {
		countSum += parseInt(r[i].childNodes[0].nodeValue);
	}
	return countSum;
}
// all cities
function getYrCityDCounts(disease, year){
	var location = null;
	var diseaseCounts = {};
	var cityList = Object.keys(getCities()); // once getCities() is called, we can reference the global var cities without problems
	for(i in cityList){
		var currCity = cityList[i];
		location = currCity + ', ' + cities[currCity]; // cities is an object {city:state}
		diseaseCounts[location] = getLocData('city', currCity, cities[currCity], disease, 'cases', year, year);
	}
	return diseaseCounts;
}
//all states
function getYrStateDCounts(disease, year){
	var stateList = getStates();
	var diseaseCounts = {};
	for(i in stateList){
		var currState = stateList[i];
		diseaseCounts[currState] = getLocData('state', null, currState, disease, 'cases', year, year);
	}
	return diseaseCounts;
}
// not intended to be used
function getStates(){
	if(states == null || states.isEmpty()){
		if(xhttp == null)
			initializeXMLRequest();
		states = [];
		//serverUrl = "http://www.tycho.pitt.edu/api/states?apikey="
		var serverUrl = "http://localhost:8080/listStates";

		xhttp.open("GET", serverUrl, false);
		xhttp.send();
		xmlDoc = xhttp.responseXML;
		var s = xmlDoc.getElementsByTagName('state');
		var des = xmlDoc.getElementsByTagName('loc');
		for (i = 0; i < s.length; i++) {
			states.push(s[i].childNodes[0].nodeValue);
		}
	}
	return states;
}

//will provide the data that will be used for querying and geocoding
function getCities(){
	if(cities == null || cities.isEmpty()){
		if(typeof xhttp == undefined || xhttp == null)
			initializeXMLRequest();
		cities = {};
		//serverUrl = "http://www.tycho.pitt.edu/api/cities?apikey="
		var serverUrl = "http://localhost:8080/listCities";

		xhttp.open("GET", serverUrl, false);
		xhttp.send();
		xmlDoc = xhttp.responseXML;
		var c = xmlDoc.getElementsByTagName('loc');
		var s = xmlDoc.getElementsByTagName('state');

		for (i = 0; i < c.length; i++) {
			cities[c[i].childNodes[0].nodeValue] = s[i].childNodes[0].nodeValue;
		}
	}
	return cities;
}

function getDiseases(){
	if(diseases == null || diseases.isEmpty()){
		if(xhttp == null)
			initializeXMLRequest();
		diseases = [];
		//serverUrl = "http://www.tycho.pitt.edu/api/diseases?apikey="
		var serverUrl = "http://localhost:8080/listDiseases";

		xhttp.open("GET", serverUrl, false);
		xhttp.send();
		xmlDoc = xhttp.responseXML;
		var d = xmlDoc.getElementsByTagName('disease')
		for (i = 0; i < d.length; i++) {
			diseases.push(d[i].childNodes[0].nodeValue);
		}
	}
	return diseases;
}