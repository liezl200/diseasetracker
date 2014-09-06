
var xhttp = null;

function initializeXMLRequest(){
	if (window.XMLHttpRequest){
		xhttp = new XMLHttpRequest();
	}
	else{ // for IE 5/6
	  xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
}
function getStateData(apikey, event, disease, state){
	if(xhttp == null)
		initializeXMLRequest();
	var diseases = [];
	//serverUrl = "http://www.tycho.pitt.edu/api/diseases?apikey="
	var serverUrl = "http://localhost:8080/stateData";

	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	d = xmlDoc.getElementsByTagName('disease')
	for (i = 0; i < d.length; i++) {
		diseases.push(d[i].childNodes[0].nodeValue);
	}
	return diseases;
}

function getCityData(apikey, event, disease, city){
	if(xhttp == null)
		initializeXMLRequest();
	var diseases = [];
	//serverUrl = "http://www.tycho.pitt.edu/api/diseases?apikey="
	var serverUrl = "http://localhost:8080/cityData";

	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	d = xmlDoc.getElementsByTagName('disease')
	for (i = 0; i < d.length; i++) {
		diseases.push(d[i].childNodes[0].nodeValue);
	}
	return diseases;
}

function getStates(apikey){
	if(xhttp == null)
		initializeXMLRequest();
	var states = [];
	//serverUrl = "http://www.tycho.pitt.edu/api/states?apikey="
	var serverUrl = "http://localhost:8080/listStates";

	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	var s = xmlDoc.getElementsByTagName('state')
	var des = xmlDoc.getElementsByTagName('loc')
	for (i = 0; i < s.length; i++) {
		states.push(s[i].childNodes[0].nodeValue);
	}
	return states;
}

function getCities(apikey){
	if(xhttp == null)
		initializeXMLRequest();
	var cities = [];
	//serverUrl = "http://www.tycho.pitt.edu/api/diseases?apikey="
	var serverUrl = "http://localhost:8080/listCities";

	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	var c = xmlDoc.getElementsByTagName('loc')
	var s = xmlDoc.getElementsByTagName('state')
	for (i = 0; i < c.length; i++) {
		cities.push(c[i].childNodes[0].nodeValue);
	}
	return diseases;
}

function getDiseases(apikey){
	if(xhttp == null)
		initializeXMLRequest();
	var diseases = [];
	//serverUrl = "http://www.tycho.pitt.edu/api/diseases?apikey="
	var serverUrl = "http://localhost:8080/listDiseases";

	xhttp.open("GET", serverUrl, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	var d = xmlDoc.getElementsByTagName('disease')
	for (i = 0; i < d.length; i++) {
		diseases.push(d[i].childNodes[0].nodeValue);
	}
	return diseases;

}