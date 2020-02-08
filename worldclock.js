// A FEW GLOBAL VARIABLES

var LocationSunriseStr = "";
var LocationSunsetStr = "";
var LocationMoonriseStr = "";
var LocationMoonsetStr = "";
var k = "";
var b = "";
var myboolean = 0;
var homeset = 0;
var mychange = 0;
var mychangenegative = 0;
var newMarginTop=0;
var newMargingLeft=0;

// CENTER OF MY WORLD MAP

var marginT = -245;
var marginL = 440;

// RANDOM CITIES 
var randomcity1 = 0;
var randomcity2 = 0;
var randomcity3 = 0;
var randomcity4 = 0;
var randomcity5 = 0;
var randomcity6 = 0;
var randomcity7 = 0;
var randomcity8 = 0;

var newMarginTopCity = 0;
var newMarginLeftCity = 0;
var marginTCity = -242;
var marginLCity = 448;

// CUSTOM CITY BUTTONS (GLOBAL VARIABLES)

var button1 = 0;
var button2 = 0;
var button3 = 0;
var button4 = 0;
var button5 = 0;
var button6 = 0;
var button7 = 0;
var button8 = 0;
var title ="";

var min = -11;
var max = 12;

function getRandomInt(min, max) {
         return Math.floor(Math.random() * (max - min + 1) + min);
}
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
var nums = [-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12];

shuffle(nums);

randomcity1 = nums[0];
randomcity2 = nums[1];
randomcity3 = nums[2];
randomcity4 = nums[3];
randomcity5 = nums[4];
randomcity6 = nums[5];
randomcity7 = nums[6];
randomcity8 = nums[7];

function addEvent(o,e,f) {
  if (o.addEventListener) {
    o.addEventListener(e,f,false);
    return true;
  }
  else if (o.attachEvent) {
    return o.attachEvent("on"+e,f);
  }
  else {
    return false;
  }
}

addEvent(window,"load",setup);
addEvent(window,"unload",makeCookie);

function getCookie(path)
{
  var result = "";
  var a = document.cookie.indexOf(path);
  if(a != -1) {
    a += path.length + 1;
    var b = document.cookie.indexOf(";",a);
    if(b == -1) {
      b = document.cookie.length;
    }
    result = unescape(document.cookie.substring(a,b));
  }
  return result;
}

var cookie_array = null;
function processCookie()
{
  var cookie = getCookie(window.location.pathname);
  if (cookie != ''){
    cookie_array = cookie.split(" ");
  }
}

function makeCookie() {
  var values = ((document.getElementById("ampm1").checked)?"1":"0");
  values += " " + ((document.getElementById("daylight1").checked)?"1":"0");
  var exp = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
  document.cookie=window.location.pathname + "=" + values + "; expires=" + exp.toGMTString();
}

// LOCATIONS FOR THE DIFFERENT TIME ZONES ONLY

var locations=[
"Samoa", 
"Hawaii", 
"Juneau",
"San Francisco"
,"Denver",
"Chicago",
"New York",
"Caracas"
,"Rio De Janeiro",
"Recife","Azores"
,"London"
,"Paris",
"Cairo",
"Moscow",
"Baku"
,"Karachi",
"Dacca",
"Bangkok",
"Hong Kong"
,"Tokyo",
"Sydney",
"Noumea",
"Wellington"];

// LONGITUDE / LATITUDE FOR TIME ZONES ONLY

var la = ["-172.1","-155.5","-134.4","-122.4","-104.9","-87.62","-74.00","-66.90","-43.17","-34.92","-25.67","0.1278","2.3522","31.235","37.617","49.867","67.001","90.412","100.50","114.16","139.65","151.20","166.44","174.77"];
var lo = ["13.759","19.896","58.301","37.774","39.739","41.878","40.712","10.480","-22.90","-8.052","37.741","51.507","48.856","30.044","55.755","40.409","24.860","23.810","13.756","22.319","35.676","-33.86","-22.27","-41.28"];

function setup()
{
  var d = new Date();
  var ltz = d.getTimezoneOffset();
  var dec = new Date(d.getFullYear(), 11, 1);
  var jun = new Date(d.getFullYear(), 5, 1);
  var a = dec.getTimezoneOffset();
  var b = jun.getTimezoneOffset();
  var isdst;
  if(b > a) {
    isdst = ltz != b;
  }
  else {
    isdst = ltz != a;
  }
  
  processCookie();
  setup_disp();
  // default DST setting based on date
  document.getElementById((isdst)?"daylight1":"daylight0").checked = true;
  if(cookie_array) {
    document.getElementById("ampm" + cookie_array[0]).checked = true;
    document.getElementById("daylight" + cookie_array[1]).checked = true;
  }
 
  update_clock();
  MySunCalc();
  myinterval(); 
  myinterval2();
}

function updateall() {
  update_clock();
  MySunCalc();    
}

// SET UP TIME ZONE TABLE

function setup_disp()
{ 
  s = "<table width =\"880px\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\"bordercolor=\"#c0c0c0\" bgcolor=\"#999999\" style=\"font-family: digital;\"";
  s += "<tr><td class=\"ccm\" colspan=\"2\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">";
  s += "<input id=\"ampm0\" type=\"radio\" name=\"ampm\" checked=\"checked\" onclick=\"updateall();\">24 Hour&nbsp;";
  s += "<input id=\"ampm1\" type=\"radio\" name=\"ampm\"  onclick=\"updateall();\" >AM/PM";
  s += "</td><td class=\"ccm\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">";
  s += "<input id=\"daylight0\" type=\"radio\" name=\"daylight\" onclick=\"updateall();\">Standard&nbsp;";
  s += "<input id=\"daylight1\" type=\"radio\" name=\"daylight\" onclick=\"updateall();\">Daylight";
  s += "</td><td></td><td class=\"ccm\" style=\"height:18px;font-size:12px !important; line-height: 18px;\"></td></tr>";
  s += "<tr bgcolor=\"lawngreen\" style=\"color:#000;\"><td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Zone</td>";
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Place</td>";
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Date/Time</td>";
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Sunrise/Sunset</td>";
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Moonrise/Moonset</td>";
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Lat/Long</td></tr>";
  
    daylight = (cookie_array && cookie_array[1] == "1")?1:0;
    offset = (new Date().getTimezoneOffset()/60) + daylight;
    for(i = 0; i < 24;i++) {
    q = "tz" + i;
    j = i-11;
    si = "" + Math.abs(j)
    if(si.length < 2) si = "0" + si;
    si = ((j < 0)?"-":"+") + si;
    mod = (i-11 == -offset)?" bgcolor=\"#f0f0ff\"":"";  // STYLE FOR COLORS
        
    // EVEN AND ODD ROWS FOR TIME ZONE TABLE

    s += "<tr" + mod + " id=\"row" + i + "\" style=\"height:18px; \"><td class=\"cc\" valign=\"middle\" style=\"height:18px;font-size:12px !important; line-height: 18px; \">UTC" + si + "</td>";
    s += "<td class=\"cc\" valign=\"middle\" style=\"height:18px;font-size:12px !important; line-height: 18px; \">" + locations[i] + "</td>";
    s += "<td class=\"ccm\"  valign=\"middle\" id=\"v" + i + "\" style=\"height:18px;font-size:12px !important;line-height: 18px; \"></td>";
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"c" + i + "\" style=\"height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td>";
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"d" + i + "\" style=\"height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td>"; 
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"l" + i + "\" style=\"height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td></tr>";

  }
  s += "</table>";
  document.getElementById("clock_disp").innerHTML = s;  // FINALLY DISPLAY TIME ZONE TABLE
}


function lz(v)
{
  return (v < 10)?"0" + v:v;
}

// FORMAT DATE FOR TIME ZONE TABLE

function formatDate(d)
{
  s = lz((d.getMonth()+1))
  + "/" + lz(d.getDate())
  + "/" + d.getFullYear() + " ";
  h = d.getHours();
  if (document.getElementById("ampm1").checked) {
    myboolean = 1;
    ap = (h >= 12)?"PM":"AM";
    h = (h % 12);
    if(h == 0) h = 12;
    s += lz(h)
    + ":" + lz(d.getMinutes())
  /*  + ":" + lz(d.getSeconds()) */
    + " " + ap;
  }
  else {
    myboolean = 0;
    s += lz(h)
    + ":" + lz(d.getMinutes())
  /*  + ":" + lz(d.getSeconds()); */
  }
  return s;
}

// FORMAT DATE FOR CITY BUTTONS

function formatDateSidekick(d)
{
  s = lz((d.getMonth()+1))
  + "/" + lz(d.getDate())
  + "/" + d.getFullYear() + "<br> ";
  h = d.getHours();
  if (document.getElementById("ampm1").checked) {
    myboolean = 1;
    ap = (h >= 12)?"PM":"AM";
    h = (h % 12);
    if(h == 0) h = 12;
    s += lz(h)
    + ":" + lz(d.getMinutes())
  /*  + ":" + lz(d.getSeconds()) */
    + " " + ap;
  }
  else {
    myboolean = 0;
    s += lz(h)
    + ":" + lz(d.getMinutes())
  /*  + ":" + lz(d.getSeconds()); */
  }
  return s;
}

// A FEW MORE GLOBAL VARIABLES

var old_offset = -1;
var hour = 3600000; // one hour in milliseconds
var homeloc;
var sign;
var homeutc;
var mytime;

// GET INPUT FROM KEYBOARD (LEFT and RIGHT ARROWS *ONLY*)

function temp(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        mychange--;
    }
    else if (e.keyCode == '39') {
        mychange++;
    } 
  update_clock();
}

// MAIN FUNCTION FOR UPDATING TIME ZONE CLOCK AND CLOCK BUTTONS

function update_clock() {

  var d = new Date();
  offset = d.getTimezoneOffset()/60;
  // add daylight hour if specified
  daylight = (document.getElementById("daylight1").checked)?1:0;
  // set initial TZ to UTC-11
  offset += daylight;
  d.setTime(d.getTime() - (11 * hour) + offset * hour); 
  
  // SET TIME "OFFSET" FOR ANY BUTTON ACTIVATED
  
  offset = offset + mychange;
  
  // create time zone outputs
  for(i = -11;i <= 12;i++) {
      
    var color;
    document.getElementById("v" + (i+11)).innerHTML = formatDate(d);

    // SET UP TIME FOR EACH BUTTON WITH CLOCK

   var min = -11;
   var max = 12;
   
   // RANDOM ALGORITHMS
   
    function getRandomInt(min, max) {
         return Math.floor(Math.random() * (max - min + 1) + min);
    }



// Shuffle lunch
 

// Create a new, shuffled array from lunch
//var shuffledLunch = shuffle(lunch.slice());
   

 
   
     if (i == randomcity1)
     { 
       document.getElementById("buttoncity1").innerHTML = locations[i+11] + "<br>" + formatDateSidekick(d);
     }
     if (i == randomcity2)
     {
     	document.getElementById("buttoncity2").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);           
     }
     if (i == randomcity3)
     { 
       document.getElementById("buttoncity3").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);
     }
     if (i == randomcity4)
     {
     	document.getElementById("buttoncity4").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);
     }     
     if (i == randomcity5)
     {
        document.getElementById("buttoncity5").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);  
     }
     if (i == randomcity6)
     {
        document.getElementById("buttoncity6").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);         
     }
     if (i == randomcity7)
     {
          document.getElementById("buttoncity7").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d);
     }
     if (i == randomcity8)
     {
        document.getElementById("buttoncity8").innerHTML = locations[i+11]  + "<br>" + formatDateSidekick(d); 
     } 

     //  CITIES ON THE WORLD MAP
     
     if (i == -11)
     {
         var style = window.getComputedStyle(document.getElementById('big1'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big1").style.marginLeft = newMarginLeftCity;
         document.getElementById("big1").style.marginTop = newMarginTopCity;
         var string = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod = string.replace(/(<br ?\/?>)*/g,"");
         $("#big1").prop("title", stringmod);         
     }
     if (i == -10)
     {
         var style = window.getComputedStyle(document.getElementById('big2'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big2").style.marginLeft = newMarginLeftCity;
         document.getElementById("big2").style.marginTop = newMarginTopCity;
         var string2 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod2 = string2.replace(/(<br ?\/?>)*/g,"");
         $("#big2").prop("title", stringmod2);           
     }
     if (i == -9)
     {
         var style = window.getComputedStyle(document.getElementById('big3'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big3").style.marginLeft = newMarginLeftCity;
         document.getElementById("big3").style.marginTop = newMarginTopCity;
         var string3 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod3 = string3.replace(/(<br ?\/?>)*/g,"");
         $("#big3").prop("title", stringmod3);           
     }
     if (i == -8)
     {
         var style = window.getComputedStyle(document.getElementById('big4'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big4").style.marginLeft = newMarginLeftCity;
         document.getElementById("big4").style.marginTop = newMarginTopCity;
         var string4 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod4 = string4.replace(/(<br ?\/?>)*/g,"");
         $("#big4").prop("title", stringmod4);             
     }
     if (i == -7)
     {
         var style = window.getComputedStyle(document.getElementById('big5'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big5").style.marginLeft = newMarginLeftCity;
         document.getElementById("big5").style.marginTop = newMarginTopCity;
         var string5 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod5 = string5.replace(/(<br ?\/?>)*/g,"");
         $("#big5").prop("title", stringmod5);          
     }
     if (i == -6)
     {
         var style = window.getComputedStyle(document.getElementById('big6'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big6").style.marginLeft = newMarginLeftCity;
         document.getElementById("big6").style.marginTop = newMarginTopCity;
         var string6 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod6 = string6.replace(/(<br ?\/?>)*/g,"");
         $("#big6").prop("title", stringmod6);    
     }           
     if (i == -5)
     {
         var style = window.getComputedStyle(document.getElementById('big7'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big7").style.marginLeft = newMarginLeftCity;
         document.getElementById("big7").style.marginTop = newMarginTopCity;
         var string7 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod7 = string7.replace(/(<br ?\/?>)*/g,"");
         $("#big7").prop("title", stringmod7);   
     }   
     if (i == -4)
     {
         var style = window.getComputedStyle(document.getElementById('big8'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big8").style.marginLeft = newMarginLeftCity;
         document.getElementById("big8").style.marginTop = newMarginTopCity;
         var string8 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod8 = string8.replace(/(<br ?\/?>)*/g,"");
         $("#big8").prop("title", stringmod8);   
     }   
     if (i == -3)
     {
         var style = window.getComputedStyle(document.getElementById('big9'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big9").style.marginLeft = newMarginLeftCity;
         document.getElementById("big9").style.marginTop = newMarginTopCity;
         var string9 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod9 = string9.replace(/(<br ?\/?>)*/g,"");
         $("#big9").prop("title", stringmod9);   
     } 
     if (i == -2)
     {
         var style = window.getComputedStyle(document.getElementById('big10'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big10").style.marginLeft = newMarginLeftCity;
         document.getElementById("big10").style.marginTop = newMarginTopCity;
         var string10 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod10 = string10.replace(/(<br ?\/?>)*/g,"");
         $("#big10").prop("title", stringmod10);  
     } 
     if (i == -1)
     {
         var style = window.getComputedStyle(document.getElementById('big11'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big11").style.marginLeft = newMarginLeftCity;
         document.getElementById("big11").style.marginTop = newMarginTopCity;
         var string11 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod11 = string11.replace(/(<br ?\/?>)*/g,"");
         $("#big11").prop("title", stringmod11);  
     }     
     if (i == 0)
     {
         var style = window.getComputedStyle(document.getElementById('big12'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big12").style.marginLeft = newMarginLeftCity;
         document.getElementById("big12").style.marginTop = newMarginTopCity;
         var string12 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod12 = string12.replace(/(<br ?\/?>)*/g,"");
         $("#big12").prop("title", stringmod12);  
     }      
     if (i == 1)
     {
         var style = window.getComputedStyle(document.getElementById('big13'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big13").style.marginLeft = newMarginLeftCity;
         document.getElementById("big13").style.marginTop = newMarginTopCity;
         var string13 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod13 = string13.replace(/(<br ?\/?>)*/g,"");
         $("#big13").prop("title", stringmod13);   
     }      
     if (i == 2)
     {
         var style = window.getComputedStyle(document.getElementById('big14'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big14").style.marginLeft = newMarginLeftCity;
         document.getElementById("big14").style.marginTop = newMarginTopCity;
         var string14 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod14 = string14.replace(/(<br ?\/?>)*/g,"");
         $("#big14").prop("title", stringmod14);   
     }    
     if (i == 3)
     {
         var style = window.getComputedStyle(document.getElementById('big15'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big15").style.marginLeft = newMarginLeftCity;
         document.getElementById("big15").style.marginTop = newMarginTopCity;
         var string15 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod15 = string15.replace(/(<br ?\/?>)*/g,"");
         $("#big15").prop("title", stringmod15);   
     }  
     if (i == 4)
     {
         var style = window.getComputedStyle(document.getElementById('big16'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big16").style.marginLeft = newMarginLeftCity;
         document.getElementById("big16").style.marginTop = newMarginTopCity;
         var string16 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod16 = string16.replace(/(<br ?\/?>)*/g,"");
         $("#big16").prop("title", stringmod16);   
     }  
     if (i == 5)
     {
         var style = window.getComputedStyle(document.getElementById('big17'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big17").style.marginLeft = newMarginLeftCity;
         document.getElementById("big17").style.marginTop = newMarginTopCity;
         var string17 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod17 = string17.replace(/(<br ?\/?>)*/g,"");
         $("#big17").prop("title", stringmod17);   
     }  
     if (i == 6)
     {
         var style = window.getComputedStyle(document.getElementById('big18'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big18").style.marginLeft = newMarginLeftCity;
         document.getElementById("big18").style.marginTop = newMarginTopCity;
         var string18 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod18 = string18.replace(/(<br ?\/?>)*/g,"");
         $("#big18").prop("title", stringmod18);   
     }  
     if (i == 7)
     {
         var style = window.getComputedStyle(document.getElementById('big19'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big19").style.marginLeft = newMarginLeftCity;
         document.getElementById("big19").style.marginTop = newMarginTopCity;
         var string19 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod19 = string19.replace(/(<br ?\/?>)*/g,"");
         $("#big19").prop("title", stringmod19);   
     }  
      if (i == 8)
     {
         var style = window.getComputedStyle(document.getElementById('big20'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big20").style.marginLeft = newMarginLeftCity;
         document.getElementById("big20").style.marginTop = newMarginTopCity;
         var string20 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod20 = string20.replace(/(<br ?\/?>)*/g,"");
         $("#big20").prop("title", stringmod20);   
     }                            
      if (i == 9)
     {
         var style = window.getComputedStyle(document.getElementById('big21'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big21").style.marginLeft = newMarginLeftCity;
         document.getElementById("big21").style.marginTop = newMarginTopCity;
         var string21 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod21 = string21.replace(/(<br ?\/?>)*/g,"");
         $("#big21").prop("title", stringmod21);   
     }    
      if (i == 10)
     {
         var style = window.getComputedStyle(document.getElementById('big22'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big22").style.marginLeft = newMarginLeftCity;
         document.getElementById("big22").style.marginTop = newMarginTopCity;
         var string22 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod22 = string22.replace(/(<br ?\/?>)*/g,"");
         $("#big22").prop("title", stringmod22);   
     }   
      if (i == 11)
     {
         var style = window.getComputedStyle(document.getElementById('big23'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big23").style.marginLeft = newMarginLeftCity;
         document.getElementById("big23").style.marginTop = newMarginTopCity;
         var string23 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod23 = string23.replace(/(<br ?\/?>)*/g,"");
         $("#big23").prop("title", stringmod23);   
     }   
      if (i == 12)
     {
         var style = window.getComputedStyle(document.getElementById('big24'));
         newMarginTopCity = (marginTCity - ((lo[i+11] * 2.444))) + 5;
         newMarginLeftCity = (marginLCity + ((la[i+11] * 2.444))) - 15; 
         document.getElementById("big24").style.marginLeft = newMarginLeftCity;
         document.getElementById("big24").style.marginTop = newMarginTopCity;
         var string24 = locations[i+11] + " " + formatDateSidekick(d);
         var stringmod24 = string24.replace(/(<br ?\/?>)*/g,"");
         $("#big24").prop("title", stringmod24);   
     } 
// RANDOM CITIES ON MAP
     
     
     if (i == randomcity1 && button1 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     
     if (i == randomcity2 && button2 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     
     if (i == randomcity3 && button3 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == randomcity4 && button4 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == randomcity5 && button5 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == randomcity6 && button6 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == randomcity7 && button7 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == randomcity8 && button8 == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
         newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;   
       //  document.getElementById("casa").style.marginLeft = newMarginLeft;
      //   document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }         
     
     
     mod = (i == -offset)?"lawngreen":"white";
     
     if (mod == "lawngreen")
     if (button1 == 0 & button2 == 0 & button3 == 0 & button4 == 0 & button5 == 0 & button6 == 0 & button7 == 0 & button8 == 0)
     {
         
             homeloc = locations[i + 11];
            title = homeloc;
            var stringanycity = title + " " + formatDateSidekick(d);
            var stringmodcity = stringanycity.replace(/(<br ?\/?>)*/g,"");
            $("#casa").prop("title", stringmodcity);

            document.getElementById("homeclock").innerHTML = homeloc + "<br>" + formatDateSidekick(d);    
     // SET UP LOCATION ON WORLD MAP FOR DIFFERENT CITY LOCATIONS WHEN ANY BUTTON IS ACTIVATED      
            
            
            
 
     
    }
    
    if(old_offset != offset) 
    if (button1 == 0 & button2 == 0 & button3 == 0 & button4 == 0 & button5 == 0 & button6 == 0 & button7 == 0 & button8 == 0)
   // if (buttoncity1 == 0 && buttoncity2 == 0 && buttoncity3 == 0 && buttoncity4 == 0 && buttoncity5 == 0 && buttoncity6 == 0 && buttoncity7 == 0 && buttoncity8 == 0)
    {
        

      color=(i == -offset)?"#f0f0ff":"#999999";

      document.getElementById("row" + (i+11)).style.background = color;  
    
      if (i == -offset)
      {
          
 
  
        var style = window.getComputedStyle(document.getElementById('casa'));
        /*
        var marginTop = parseInt(style.getPropertyValue('margin-top')); 
        var marginLeft = parseInt(style.getPropertyValue('margin-left')); 
        */   
        if (!(buttoncity1 == 1 || buttoncity2 == 1 || buttoncity3 == 1 || buttoncity4 == 1 || buttoncity5 == 1 || buttoncity6 == 1 || buttoncity7 == 1 || buttoncity8 == 1))
        {
        newMarginTop = (marginT - ((lo[i+11] * 2.444))) + 5;
        newMarginLeft = (marginL + ((la[i+11] * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop;   
        }
      }
    }
    d.setTime(d.getTime() + hour);
      
  }
  old_offset = offset;
/*  setInterval('update_clock()', 1000); */
}

function MySunCalc() { 
            
            /*********************** MOONPHASE ************************/

            var phase = SunCalc.getMoonIllumination(new Date()).phase;
    
    
            if (phase > 0 && phase < 0.032)
			{
                document.getElementById("phase").src = "moonphases/0.png";			
			}
			if (phase > 0.032 && phase < 0.064)
			{
                document.getElementById("phase").src = "moonphases/1.png";		
			}
			if (phase > 0.064 && phase < 0.096)
			{
                document.getElementById("phase").src = "moonphases/2.png";		
			}
			if (phase > 0.096 && phase < 0.128)
			{
                document.getElementById("phase").src = "moonphases/3.png";		
			}
			if (phase > 0.128 && phase < 0.160)
			{
                document.getElementById("phase").src = "moonphases/4.png";			
			}			
			if (phase > 0.160 && phase < 0.192)
			{
                document.getElementById("phase").src = "moonphases/5.png";
			}
			if (phase > 0.192 && phase < 0.224)
			{
                document.getElementById("phase").src = "moonphases/6.png";		
			}
			if (phase > 0.224 && phase < 0.256)
			{
                document.getElementById("phase").src = "moonphases/7.png";		
			} 
			if (phase > 0.256 && phase < 0.288)
			{
                document.getElementById("phase").src = "moonphases/8.png";		
			} 
			if (phase > 0.288 && phase < 0.320)
			{
                document.getElementById("phase").src = "moonphases/9.png";		
			} 
			if (phase > 0.320 && phase < 0.352)
			{
                document.getElementById("phase").src = "moonphases/10.png";		
			} 
			if (phase > 0.352 && phase < 0.384)
			{
                document.getElementById("phase").src = "moonphases/11.png";		
			} 
			if (phase > 0.384 && phase < 0.416)
			{
                document.getElementById("phase").src = "moonphases/12.png";		
			} 
			if (phase > 0.416 && phase < 0.448)
			{
                document.getElementById("phase").src = "moonphases/13.png";		
			} 
			if (phase > 0.448 && phase < 0.480)
			{
                document.getElementById("phase").src = "moonphases/14.png";		
			} 
			if (phase > 0.480 && phase < 0.5)
			{
                document.getElementById("phase").src = "moonphases/15.png";		
			} 
			if (phase > 0.5 && phase < 0.532)
			{
                document.getElementById("phase").src = "moonphases/16.png";		
			} 
			if (phase > 0.532 && phase < 0.564)
			{
                document.getElementById("phase").src = "moonphases/17.png";		
			} 
			if (phase > 0.564 && phase < 0.596)
			{
                document.getElementById("phase").src = "moonphases/18.png";		
			} 
			if (phase > 0.596 && phase < 0.628)
			{
                document.getElementById("phase").src = "moonphases/19.png";		
			}
			if (phase > 0.628 && phase < 0.660)
			{
                document.getElementById("phase").src = "moonphases/20.png";		
			} 
			if (phase > 0.660 && phase < 0.692)
			{
                document.getElementById("phase").src = "moonphases/21.png";		
			} 
            if (phase > 0.692 && phase < 0.724)
			{
                document.getElementById("phase").src = "moonphases/22.png";		
			} 
			if (phase > 0.724 && phase < 0.756)
			{
                document.getElementById("phase").src = "moonphases/23.png";		
			} 			
			if (phase > 0.756 && phase < 0.788)
			{
                document.getElementById("phase").src = "moonphases/24.png";		
			}
            if (phase > 0.788 && phase < 0.810)
			{
                document.getElementById("phase").src = "moonphases/25.png";		
			} 
			if (phase > 0.810 && phase < 0.842)
			{
                document.getElementById("phase").src = "moonphases/26.png";		
			} 			
			if (phase > 0.842 && phase < 0.876)
			{
                document.getElementById("phase").src = "moonphases/27.png";		
			} 
			if (phase > 0.876 && phase < 0.908)
			{
                document.getElementById("phase").src = "moonphases/28.png";		
			} 
			if (phase > 0.908 && phase < 0.940)
			{
                document.getElementById("phase").src = "moonphases/29.png";		
			} 			
			if (phase > 0.940 && phase < 0.972)
			{
                document.getElementById("phase").src = "moonphases/30.png";		
			} 
            if (phase > 0.972 && phase < 1)
			{
                document.getElementById("phase").src = "moonphases/31.png";		
			} 
			
    daylight = (cookie_array && cookie_array[1] == "1")?1:0;
    isampm =  (cookie_array && cookie_array[0] == "1")?1:0;
    offset = (new Date().getTimezoneOffset()/60) + daylight;
  
    for(i = 0; i < 24;i++) {
    q = "tz" + i;
    j = i-11;
    si = "" + Math.abs(j)
    if(si.length < 2) si = "0" + si;
    si = ((j < 0)?"-":"+") + si;
    mod = (i-11 == -offset)?"style=\"color:lawngreen;\"":"";
        
    function checkTime(x) {
            if (x < 10) {
            x = "0" + x;
            };
            return x;
            }   
            var Location_off = si;
            var location = SunCalc.getTimes(new Date(), lo[i],la[i]);
            var Location_Sunrise_minutes = checkTime(location.sunrise.getMinutes());
            var location_utc_sunrise = location.sunrise.getTime()+(location.sunrise.getTimezoneOffset() * 60000);
            var location_nd_sunrise = new Date(location_utc_sunrise+(3600000*Location_off));
            var location_sunriseStr = checkTime(location_nd_sunrise.getHours()) + ':' + Location_Sunrise_minutes;
            var h = checkTime(location_nd_sunrise.getHours());            
            
            if (isampm == 1 ||  myboolean == 1)
            {
                var ap = (h >= 12)?"PM":"AM";
                h = (h % 12);
                if(h == 0) h = 12;
                LocationSunriseStr = checkTime(h) + ":" + Location_Sunrise_minutes + " " + ap;
            }
            
            else{
            LocationSunriseStr = location_sunriseStr;
            }            
            
            var Location_Sunset_minutes = checkTime(location.sunset.getMinutes());
            var location_utc_sunset = location.sunset.getTime()+(location.sunset.getTimezoneOffset() * 60000);
            var location_nd_sunset = new Date(location_utc_sunset+(3600000*Location_off));
            var location_sunsetStr = checkTime(location_nd_sunset.getHours()) + ':' + Location_Sunset_minutes;
            var h = checkTime(location_nd_sunset.getHours());

            if (isampm == 1 ||  myboolean == 1)
            {
                var ap = (h >= 12)?"PM":"AM";
                h = (h % 12);
                if(h == 0) h = 12;
                LocationSunsetStr = checkTime(h) + ":" + Location_Sunset_minutes + " " + ap;
            }
            else {
            LocationSunsetStr = location_sunsetStr;
            }
			
            /************************ MOON *****************************/
            
            var moonLocation_off = si;
            var moonlocation = SunCalc.getMoonTimes(new Date(), lo[i],la[i]);
            var checkundef1 = moonlocation.rise;
            var checkundef2 = moonlocation.set;
			if (checkundef1 === undefined)
			{
            if (isampm == 1 || myboolean == 1)					
			LocationMoonriseStr = "--------";
            else
			LocationMoonriseStr = "-----";			
			}
			if (checkundef1 !== undefined)
            {
            var Location_Moonrise_minutes = checkTime(moonlocation.rise.getMinutes());
            var location_utc_moonrise = moonlocation.rise.getTime()+(moonlocation.rise.getTimezoneOffset() * 60000);
            var location_nd_moonrise = new Date(location_utc_moonrise+(3600000*Location_off));
            var location_moonriseStr = checkTime(location_nd_moonrise.getHours()) + ':' + Location_Moonrise_minutes;
            var h = checkTime(location_nd_moonrise.getHours());            
            
            if (isampm == 1 || myboolean == 1)
            {
                var ap = (h >= 12)?"PM":"AM";
                h = (h % 12);
                if(h == 0) h = 12;
                LocationMoonriseStr = checkTime(h) + ":" + Location_Moonrise_minutes + " " + ap;
            }
                     
            else {
            LocationMoonriseStr = location_moonriseStr;
            }               
            }
            
			if (checkundef2 === undefined)
			{      
            if (isampm == 1 || myboolean == 1)	
 			LocationMoonsetStr = "--------";
            else
 			LocationMoonsetStr = "-----";			
			}     
			if (checkundef2 !== undefined)
            {
            var Location_Moonset_minutes = checkTime(moonlocation.set.getMinutes());
            var location_utc_moonset = moonlocation.set.getTime()+(moonlocation.set.getTimezoneOffset() * 60000);
            var location_nd_moonset = new Date(location_utc_moonset+(3600000*Location_off));
            var location_moonsetStr = checkTime(location_nd_moonset.getHours()) + ':' + Location_Moonset_minutes;
            var h = checkTime(location_nd_moonset.getHours());
        
            if (isampm == 1 || myboolean == 1)
            {
                var ap = (h >= 12)?"PM":"AM";
                h = (h % 12);
                if(h == 0) h = 12;
            LocationMoonsetStr = checkTime(h) + ":" + Location_Moonset_minutes + " " + ap;
            }
                     
            else {
            LocationMoonsetStr = location_moonsetStr;
            }          
            }
            
         k = LocationSunriseStr + "&nbsp;" + LocationSunsetStr;
         b = LocationMoonriseStr + "&nbsp;" + LocationMoonsetStr;
         document.getElementById("c" + i).innerHTML = k;
         document.getElementById("d" + i).innerHTML = b;
         document.getElementById("l" + i).innerHTML = lo[i] + "&nbsp;" + la[i];        
  }    
};

function myinterval2() {
   MySunCalc(); 
   setTimeout('myinterval2()', 60000*60);    
}

function myinterval() {
  update_clock();  
  setTimeout('myinterval()', 60000);    
}

document.onkeydown = temp;



