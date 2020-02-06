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

var newMarginTopCity = 0;
var newMarginLeftCity = 0;
var marginTCity = -242;
var marginLCity = 448;

// CUSTOM CITY BUTTONS (GLOBAL VARIABLES)

var quito=0;
var paris=0;
var madrid=0;
var montreal=0;
var ibiza=0;
var seville=0;
var newyork=0;
var sydney=0;
var london=0;
var title ="";

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
"Boston",
"Caracas"
,"Rio De Janeiro",
"Recife","Azores"
,"London"
,"Ibiza",
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

var la = ["-172.1","-155.5","-134.4","-122.4","-104.9","-87.62","-71.05","-66.90","-43.17","-34.92","-25.67","0.1278","1.4821","31.235","37.617","49.867","67.001","90.412","100.50","114.16","139.65","151.20","166.44","174.77"];
var lo = ["13.759","19.896","58.301","37.774","39.739","41.878","42.360","10.480","-22.90","-8.052","37.741","51.507","39.020","30.044","55.755","40.409","24.860","23.810","13.756","22.319","35.676","-33.86","-22.27","-41.28"];

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
  if (quito == 1)
  offset = 5;
  if (paris == 1)
  offset = -1;
  if (madrid == 1) 
  offset = -1;
  if (montreal == 1)
  offset = 5;
  if (ibiza == 1)
  offset = -1;
  if (seville == 1)
  offset = -1;
  if (newyork == 1)
  offset = 5;
  if (sydney == 1)
  offset = -10;
  if (london == 1)
  offset = 0;
  // create time zone outputs
  for(i = -11;i <= 12;i++) {
      
    var color;
    document.getElementById("v" + (i+11)).innerHTML = formatDate(d);

    // SET UP TIME FOR EACH BUTTON WITH CLOCK
    
     if (i == -5)
     { 
       document.getElementById("quito").innerHTML = "Quito" + "<br>" + formatDateSidekick(d);
     }
     if (i == 1)
     {
     	document.getElementById("paris").innerHTML = "Paris" + "<br>" + formatDateSidekick(d);           
     }
     if (i == 1)
     { 
       document.getElementById("madrid").innerHTML = "Madrid" + "<br>" + formatDateSidekick(d);
     }
     if (i == -5)
     {
     	document.getElementById("montreal").innerHTML = "Montreal" + "<br>" + formatDateSidekick(d);
     }     
     if (i == 1)
     {
        document.getElementById("ibiza").innerHTML = "Ibiza" + "<br>" + formatDateSidekick(d);  
     }
     if (i == 0)
     {
        document.getElementById("london").innerHTML = "London" + "<br>" + formatDateSidekick(d);         
     }
     if (i == -5)
     {
          document.getElementById("newyork").innerHTML = "New York" + "<br>" + formatDateSidekick(d);
     }
     if (i == 1)
     {
          document.getElementById("seville").innerHTML = "Seville" + "<br>" + formatDateSidekick(d);
     } 
     if (i == 10)
     {
        document.getElementById("sydney").innerHTML = "Sydney" + "<br>" + formatDateSidekick(d); 
     } 

     //  CITIES ON THE WORLD MAP
     
     if (i == -5)
     {
       var style = window.getComputedStyle(document.getElementById('big1'));
       newMarginTopCity = (marginTCity - (( -0.1807 * 2.444))) + 5;
       newMarginLeftCity = (marginLCity + ((-78.467 * 2.444))) - 15;
       document.getElementById("big1").style.marginLeft = newMarginLeftCity;
       document.getElementById("big1").style.marginTop = newMarginTopCity; 
       var string = "Quito" + " " + formatDateSidekick(d);
       var stringmod = string.replace(/(<br ?\/?>)*/g,"");
        $("#big1").prop("title", stringmod);         
     }
     if (i == 1)
     {
       var style = window.getComputedStyle(document.getElementById('big3'));
       newMarginTopCity = (marginTCity - ((40.416 * 2.444))) + 5;
       newMarginLeftCity = (marginLCity + ((-3.7038 * 2.444))) - 15;
        document.getElementById("big3").style.marginLeft = newMarginLeftCity;
        document.getElementById("big3").style.marginTop = newMarginTopCity; 
        var string3 = "Madrid" + " " + formatDateSidekick(d);
        var stringmod3 = string3.replace(/(<br ?\/?>)*/g,"");
        $("#big3").prop("title", stringmod3);          
     }
     if (i == 0)
     {
        var style = window.getComputedStyle(document.getElementById('big2'));
        newMarginTopCity = (marginTCity - ((51.507 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((0.1278 * 2.444))) - 15;
        document.getElementById("big2").style.marginLeft = newMarginLeftCity;
        document.getElementById("big2").style.marginTop = newMarginTopCity;   
        var string2 = "London" + " " + formatDateSidekick(d);
        var stringmod2 = string2.replace(/(<br ?\/?>)*/g,"");
        $("#big2").prop("title", stringmod2);          
     }
     if (i == -5)
     {
        var style = window.getComputedStyle(document.getElementById('big4'));
        newMarginTopCity = (marginTCity - ((38.907 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((-77.036 * 2.444))) - 15;
        document.getElementById("big4").style.marginLeft = newMarginLeftCity;
        document.getElementById("big4").style.marginTop = newMarginTopCity;   
        var string4 = "Washington" + " " + formatDateSidekick(d);
        var stringmod4 = string4.replace(/(<br ?\/?>)*/g,"");
        $("#big4").prop("title", stringmod4);             
     }
     if (i == 10)
     {
        var style = window.getComputedStyle(document.getElementById('big5'));
        newMarginTopCity = (marginTCity - ((-33.86 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((151.20 * 2.444))) - 15;
        document.getElementById("big5").style.marginLeft = newMarginLeftCity;
        document.getElementById("big5").style.marginTop = newMarginTopCity;   
        var string5 = "Sydney" + " " + formatDateSidekick(d);
        var stringmod5 = string5.replace(/(<br ?\/?>)*/g,"");
        $("#big5").prop("title", stringmod5);         
     }
     if (i == 3)
     {
        var style = window.getComputedStyle(document.getElementById('big6'));
        newMarginTopCity = (marginTCity - ((55.755 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((37.617 * 2.444))) - 15;
        document.getElementById("big6").style.marginLeft = newMarginLeftCity;
        document.getElementById("big6").style.marginTop = newMarginTopCity;   
        var string6 = "Moscow" + " " + formatDateSidekick(d);
        var stringmod6 = string6.replace(/(<br ?\/?>)*/g,"");
        $("#big6").prop("title", stringmod6); 
     }           
     if (i == -10)
     {
        var style = window.getComputedStyle(document.getElementById('big7'));
        newMarginTopCity = (marginTCity - ((19.896 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((-155.5 * 2.444))) - 15;
        document.getElementById("big7").style.marginLeft = newMarginLeftCity;
        document.getElementById("big7").style.marginTop = newMarginTopCity;   
        var string7 = "Hawaii" + " " + formatDateSidekick(d);
        var stringmod7 = string7.replace(/(<br ?\/?>)*/g,"");
        $("#big7").prop("title", stringmod7); 
     }   
     if (i == 8)
     {
        var style = window.getComputedStyle(document.getElementById('big8'));
        newMarginTopCity = (marginTCity - ((22.319 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((114.16 * 2.444))) - 15;
        document.getElementById("big8").style.marginLeft = newMarginLeftCity;
        document.getElementById("big8").style.marginTop = newMarginTopCity;   
        var string8 = "Hong Kong" + " " + formatDateSidekick(d);
        var stringmod8 = string8.replace(/(<br ?\/?>)*/g,"");
        $("#big8").prop("title", stringmod8); 
     }   
     if (i == 0)
     {
        var style = window.getComputedStyle(document.getElementById('big9'));
        newMarginTopCity = (marginTCity - ((7.5400 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((-5.547 * 2.444))) - 15;
        document.getElementById("big9").style.marginLeft = newMarginLeftCity;
        document.getElementById("big9").style.marginTop = newMarginTopCity;   
        var string9 = "Ivory Coast" + " " + formatDateSidekick(d);
        var stringmod9 = string9.replace(/(<br ?\/?>)*/g,"");
        $("#big9").prop("title", stringmod9); 
     } 
     if (i == 7)
     {
        var style = window.getComputedStyle(document.getElementById('big10'));
        newMarginTopCity = (marginTCity - ((13.756 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((100.50 * 2.444))) - 15;
        document.getElementById("big10").style.marginLeft = newMarginLeftCity;
        document.getElementById("big10").style.marginTop = newMarginTopCity;   
        var string10 = "Bangkok" + " " + formatDateSidekick(d);
        var stringmod10 = string10.replace(/(<br ?\/?>)*/g,"");
        $("#big10").prop("title", stringmod10); 
     } 
     if (i == -3)
     {
        var style = window.getComputedStyle(document.getElementById('big11'));
        newMarginTopCity = (marginTCity - ((-22.90 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((-43.17 * 2.444))) - 15;
        document.getElementById("big11").style.marginLeft = newMarginLeftCity;
        document.getElementById("big11").style.marginTop = newMarginTopCity;   
        var string11 = "Rio de Janeiro" + " " + formatDateSidekick(d);
        var stringmod11 = string11.replace(/(<br ?\/?>)*/g,"");
        $("#big11").prop("title", stringmod11); 
     }     
     if (i == -8)
     {
        var style = window.getComputedStyle(document.getElementById('big12'));
        newMarginTopCity = (marginTCity - ((34.052 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((-118.2 * 2.444))) - 15;
        document.getElementById("big12").style.marginLeft = newMarginLeftCity;
        document.getElementById("big12").style.marginTop = newMarginTopCity;   
        var string12 = "Los Angeles" + " " + formatDateSidekick(d);
        var stringmod12 = string12.replace(/(<br ?\/?>)*/g,"");
        $("#big12").prop("title", stringmod12); 
     }      
     if (i == 9)
     {
        var style = window.getComputedStyle(document.getElementById('big13'));
        newMarginTopCity = (marginTCity - ((35.676 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((139.65 * 2.444))) - 15;
        document.getElementById("big13").style.marginLeft = newMarginLeftCity;
        document.getElementById("big13").style.marginTop = newMarginTopCity;   
        var string13 = "Tokyo" + " " + formatDateSidekick(d);
        var stringmod13 = string13.replace(/(<br ?\/?>)*/g,"");
        $("#big13").prop("title", stringmod13); 
     }      
     if (i == 3)
     {
        var style = window.getComputedStyle(document.getElementById('big14'));
        newMarginTopCity = (marginTCity - ((8.9806 * 2.444))) + 5;
        newMarginLeftCity = (marginLCity + ((38.757 * 2.444))) - 15;
        document.getElementById("big14").style.marginLeft = newMarginLeftCity;
        document.getElementById("big14").style.marginTop = newMarginTopCity;   
        var string14 = "Addis Ababa" + " " + formatDateSidekick(d);
        var stringmod14 = string14.replace(/(<br ?\/?>)*/g,"");
        $("#big14").prop("title", stringmod14); 
     }       
     
     mod = (i == -offset)?"lawngreen":"white";
    
     if (mod == "lawngreen")
     {
         // CHANGE HOME BUTTON CLOCK TIME AND TOOLTIP WORLD LOCATION
         
            homeloc = locations[i + 11];
            if (quito == 1)
            homeloc = "Quito";
            if (paris == 1)
            homeloc = "Paris";
            if (madrid == 1)
            homeloc = "Madrid";
            if (montreal == 1)
            homeloc = "Montreal";
            if (ibiza == 1)
            homeloc = "Ibiza";
            if (london == 1)
            homeloc = "London";
            if (newyork == 1)
            homeloc = "New York";
            if (seville == 1)
            homeloc = "Seville";
            if (sydney == 1)
            homeloc = "Sydney";
            title = homeloc;
            var stringanycity = title + " " + formatDateSidekick(d);
            var stringmodcity = stringanycity.replace(/(<br ?\/?>)*/g,"");
            $("#casa").prop("title", stringmodcity);

            document.getElementById("homeclock").innerHTML = "Home" + "<br>" + formatDateSidekick(d);


     // SET UP LOCATION ON WORLD MAP FOR DIFFERENT CITY LOCATIONS WHEN ANY BUTTON IS ACTIVATED      
            
     if (i== -5 && quito == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
     	 newMarginTop = (marginT - (( -0.1807 * 2.444))) + 5;
         newMarginLeft = (marginL + ((-78.467 * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop;  
         
     }
     if (i == 1 && paris == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
     	newMarginTop = (marginT - (( 48.856 * 2.444))) + 5;
        newMarginLeft = (marginL + ((2.3522 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop;      
     
     }
     if (i == 1 && madrid == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
        newMarginTop = (marginT - ((40.416 * 2.444))) + 5;
        newMarginLeft = (marginL + ((-3.7038 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop;      
     
     }    
     if (i == -5 && montreal == 1)
     {
         var style = window.getComputedStyle(document.getElementById('casa'));
         newMarginTop = (marginT - ((45.5017 * 2.444))) + 5;
         newMarginLeft = (marginL + ((-73.567 * 2.444))) - 15;
         document.getElementById("casa").style.marginLeft = newMarginLeft;
         document.getElementById("casa").style.marginTop = newMarginTop; 
     }      
     if (i == 1 && ibiza == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
     	newMarginTop = (marginT - ((39.020 * 2.444))) + 5;
        newMarginLeft = (marginL + ((1.4821 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop; 
     }         
     if (i == 1 && seville == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
        newMarginTop = (marginT - ((37.389 * 2.444))) + 5;
        newMarginLeft = (marginL + ((-5.9845 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop; 
     }      
     if (i == 0 && london == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
        newMarginTop = (marginT - ((51.507 * 2.444))) + 5;
        newMarginLeft = (marginL + ((0.1278 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop; 
     }     
     if (i == -5 && newyork == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
        newMarginTop = (marginT - ((40.712 * 2.444))) + 5;
        newMarginLeft = (marginL + ((-74.00 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop; 
     }   
     if (i == 10 && sydney == 1)
     {
        var style = window.getComputedStyle(document.getElementById('casa'));
        newMarginTop = (marginT - ((-33.86 * 2.444))) + 5;
        newMarginLeft = (marginL + ((151.20 * 2.444))) - 15;
        document.getElementById("casa").style.marginLeft = newMarginLeft;
        document.getElementById("casa").style.marginTop = newMarginTop;
     } 
    }

    if(old_offset != offset) {

      color=(i == -offset)?"#f0f0ff":"#999999";
      document.getElementById("row" + (i+11)).style.background = color;
      
      if (i == -offset)
      {
        var style = window.getComputedStyle(document.getElementById('casa'));
        /*
        var marginTop = parseInt(style.getPropertyValue('margin-top')); 
        var marginLeft = parseInt(style.getPropertyValue('margin-left')); 
        */   
        if (!(quito == 1 || paris == 1 || madrid == 1 || montreal == 1 || ibiza == 1 || london == 1 || newyork == 1 || seville == 1 || sydney == 1))
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
    
    
            if (phase > 0 && phase < 0.12)
			{
                document.getElementById("phase").src = "moonphases/new_moon.png";			
			}
			if (phase > 0.12 && phase < 0.25)
			{
                document.getElementById("phase").src = "moonphases/waxing_crescent.png";		
			}
			if (phase > 0.25 && phase < 0.37)
			{
                document.getElementById("phase").src = "moonphases/first_quarter.png";		
			}
			if (phase > 0.37 && phase < 0.50)
			{
                document.getElementById("phase").src = "moonphases/waxing_gibbous.png";		
			}
			if (phase > 0.50 && phase < 0.62)
			{
                document.getElementById("phase").src = "moonphases/full_moon.png";			
			}			
			if (phase > 0.62 && phase < 0.75)
			{
                document.getElementById("phase").src = "moonphases/waning_gibbous.png";
			}
			if (phase > 0.75 && phase < 0.87)
			{
                document.getElementById("phase").src = "moonphases/third_quarter.png";		
			}
			if (phase > 0.87 && phase < 1.0)
			{
                document.getElementById("phase").src = "moonphases/waning_crescent.png";		
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



