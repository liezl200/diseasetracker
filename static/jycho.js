
var xhttp = null;
var cities = null;
var states = null;
var diseases = null;
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