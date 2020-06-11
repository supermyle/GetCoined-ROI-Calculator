//Get Date of Yesterday
var date = new Date();
date.setDate(date.getDate()-1); //Get Date of Yesterday
var yyyy = date.getFullYear(); //Get Year 
var mm = date.getMonth()+1; //Get Month +1 because months are (0-11)
var dd = date.getDate(); //Get Day
var date = new Date();
date.setDate(date.getDate()-1); //Get Date of Yesterday
var yyyy = date.getFullYear(); //Get Year 
var mm = date.getMonth()+1; //Get Month +1 because months are (0-11)
var dd = date.getDate(); //Get Day
//Add leading '0' before months and days below '10'
if (mm < 10) {
	mm = '0' + mm
}
if (dd < 10) {
	dd = '0' + dd
}
var yesterday = yyyy+'-'+mm+'-'+dd; //Get Yesterday in YYYY/MM/DD format

//Set max and placeholder value of date input field to yesterday's date default
window.onload = function() {
	document.getElementById("date_field").setAttribute("value", yesterday);
	document.getElementById("date_field").setAttribute("max", yesterday);
}

//Global variables
var currentPriceURL = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json'; //Current BTC Price URL
var request = new XMLHttpRequest(); //Request for current Price
var closingPriceURL = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-18&end=' + yesterday; //Historic BTC data URL
var request2 = new XMLHttpRequest(); //Request2 for date invested in BTC closing price
var btcPriceData = 0;
var usdPrice = 0;
var closingPriceData = 0;
var closingPrice = 0;
var bitcoin_amt = 0;
var current_worth = 0;
var percent_change = 0;
var ROI_final = 0;

//Calculate and print return on investment
function calcROI() {
	var invest_amt = document.getElementById("invest_field").value;	
	var	search_date = document.getElementById("date_field").value;
	
	//Create promise and use AJAX to request current BTC price
	const requestDataOne = new Promise((resolve, reject) => {
	request.open('GET', currentPriceURL, true);
	request.responseType = 'json';
	request.send(); 
	request.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		btcPriceData = request.response; //Get our json object for BTC current price
		usdPrice = btcPriceData.bpi.USD.rate; //Grab Current USD price from JSON object
		usdPrice = parseFloat(usdPrice.replace(/,/g, '')); //Remove comma and convert String to float 
		resolve('data one taken');
	  }
	};
	})

	//Create promise and use AJAX to request historic BTC data and get closing price of BTC on date user searched
	const requestDataTwo = new Promise((resolve, reject) => {
	request2.open('GET', closingPriceURL, true);
	request2.responseType = 'json';
	request2.send();
	request2.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		closingPriceData = request2.response; //Get our JSON object for BTC Closing price
		closingPrice = closingPriceData.bpi[search_date]; //Get closing price of BTC on date user searched
		resolve('data two taken');
	  }
	};
	})
	
	//Run after both Promises have been fulfilled
	Promise.all([requestDataOne,requestDataTwo]).then((messages) => {
		console.log(messages); //Print message to console that data was recieved
		bitcoin_amt = (invest_amt/closingPrice); //Amount of Bitcoin bought on date
		current_worth = (bitcoin_amt*usdPrice); //Get value of user's Bitcoins
		percent_change = (current_worth/invest_amt); //Calc percentage fluxuation
		ROI_final = (current_worth-invest_amt); //Calc final ROI value
		
		document.getElementById("ROI_Calc_Field").innerHTML = "The price of BTC right now is $" + usdPrice.toFixed(2) + "/BTC" +
		"<br>On " + search_date + " the price of BTC closed at $" + closingPrice + "<br>You bought " + bitcoin_amt + " BTC for $" +
		invest_amt + "<br>You have seen a " + percent_change.toFixed(2) + "% change. Your ROI is $" + ROI_final.toFixed(2);
	})
}
