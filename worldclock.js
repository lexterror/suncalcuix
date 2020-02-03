var LocationSunriseStr = "";
var LocationSunsetStr = "";
var LocationMoonriseStr = "";
var LocationMoonsetStr = "";
var k = "";
var b = "";
var myboolean = 0;


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

var la = ["-172","-155","-134","-122","-104","-87","-71","-66","-43","-35","-25","0.1","1.4"," 31"," 37"," 50"," 67"," 90","100","114","140"," 151"," 166"," 174"];
var lo = [" -14","  19","  58","  38","  40"," 41"," 42"," 10","-22"," -8"," 37"," 51"," 39"," 30"," 55"," 40"," 25"," 24"," 13"," 22"," 35"," -34"," -22"," -41"];





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

}


function updateall() {
  update_clock();
  MySunCalc();    
}








function setup_disp()
{ 

    

    
    
  s = "<table width =\"880px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=#999999 style=\"color:#000000;font-family:digital;vertical-align: middle;color: #000000;border-collapse: collapse;padding:0;border:0;\">";
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
  s += "<td class=\"ccb\" style=\"height:18px;font-size:12px !important; line-height: 18px;\">Moonrise/Moonset</td></tr>";
  
  daylight = (cookie_array && cookie_array[1] == "1")?1:0;
  isampm =  (cookie_array && cookie_array[0] == "1")?1:0;
  offset = (new Date().getTimezoneOffset()/60) + daylight;
  for(i = 0; i < 24;i++) {
    q = "tz" + i;
    j = i-11;
    si = "" + Math.abs(j)
    if(si.length < 2) si = "0" + si;
    si = ((j < 0)?"-":"+") + si;
    mod = (i-11 == -offset)?" style=\"color:lawngreen;\"":"";
        
            
    if (i % 2 == 0)
    {
    
    s += "<tr" + mod + " id=\"row" + i + "\" style=\"height:18px; \"><td class=\"cc\" valign=\"middle\" style=\"background: #222;height:18px;font-size:12px !important; line-height: 18px;\">UTC" + si + "</td>";
    s += "<td class=\"cc\" valign=\"middle\" style=\"background: #222;height:18px;font-size:12px !important; line-height: 18px;   \">" + locations[i] + "</td>";
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"v" + i + "\" style=\"background: #222;height:18px;font-size:12px !important;right:0; line-height: 18px; \"></td>";
  
    

    s += "<td class=\"ccm\"valign=\"middle\"  id=\"c" + i + "\" style=\"background: #222;height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td>"; 
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"d" + i + "\" style=\"background: #222;height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td></tr>"; 
 
        
    }
    
    if (i % 2 != 0)
    {
    s += "<tr" + mod + " id=\"row" + i + "\" style=\"height:18px; \"><td class=\"cc\" valign=\"middle\" style=\"background: #333;height:18px;font-size:12px !important; line-height: 18px; \">UTC" + si + "</td>";
    s += "<td class=\"cc\" valign=\"middle\" style=\"background: #333;height:18px;font-size:12px !important; line-height: 18px; \">" + locations[i] + "</td>";
    s += "<td class=\"ccm\"  valign=\"middle\" id=\"v" + i + "\" style=\"background: #333;height:18px;font-size:12px !important;line-height: 18px; \"></td>";
    

   
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"c" + i + "\" style=\"background: #333;height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td>";
    s += "<td class=\"ccm\"valign=\"middle\"  id=\"d" + i + "\" style=\"background: #333;height:18px;font-size:12px !important;right:0; line-height: 18px; \">---</td></tr>"; 
 
    }
    
    
  }
  s += "</table>";
  document.getElementById("clock_disp").innerHTML = s;
}


function lz(v)
{
  return (v < 10)?"0" + v:v;
}

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
var old_offset = -1;
var hour = 3600000; // one hour in milliseconds
var homeloc;
var sign;
var homeutc;
var mytime;

function update_clock() {
  var d = new Date();

  offset = d.getTimezoneOffset()/60;
  // add daylight hour if specified
  daylight = (document.getElementById("daylight1").checked)?1:0;
  // set initial TZ to UTC-11
  offset += daylight;
  d.setTime(d.getTime() - (11 * hour) + offset * hour); 
  // create time zone outputs
  for(i = -11;i <= 12;i++) {
   var color;
    document.getElementById("v" + (i+11)).innerHTML = formatDate(d);

    mod = (i == -offset)?"lawngreen":"white";
    
    if (mod == "lawngreen")
    {
            homeloc = locations[i + 11];
      
            j = i-11;
            
            sign = ((j < 0)?"-":"+");   
      
            homeutc = offset;

            document.getElementById("home").innerHTML = homeloc + "&nbsp;(UTC" + sign + offset + ")<br>";

            document.getElementById("localtime").innerHTML = formatDate(d); 
    }


    
    if(old_offset != offset) {
      /*color=(i == -offset)?"white":"lawngreen";*/
      color=(i == -offset)?"white":"lawngreen";
      document.getElementById("row" + (i+11)).style.color = color;

      
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
                document.getElementById("phase").src = "moonphases/new_moon.svg";			
			}
			if (phase > 0.12 && phase < 0.25)
			{
                document.getElementById("phase").src = "moonphases/waxing_crescent.svg";		
			}
			if (phase > 0.25 && phase < 0.37)
			{
                document.getElementById("phase").src = "moonphases/first_quarter.svg";		
			}
			if (phase > 0.37 && phase < 0.50)
			{
                document.getElementById("phase").src = "moonphases/waxing_gibbous.svg";		
			}
			if (phase > 0.50 && phase < 0.62)
			{
                document.getElementById("phase").src = "moonphases/full_moon.svg";			
			}			
			if (phase > 0.62 && phase < 0.75)
			{
                document.getElementById("phase").src = "moonphases/waning_gibbous.svg";
			}
			if (phase > 0.75 && phase < 0.87)
			{
                document.getElementById("phase").src = "moonphases/third_quarter.svg";		
			}
			if (phase > 0.87 && phase < 1.0)
			{
                document.getElementById("phase").src = "moonphases/waning_crescent.svg";		
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
    mod = (i-11 == -offset)?"style=\"color:lawngreen;\"":"white";
        
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
            
            
         if (mod == "style=\"color:lawngreen;\"")
         {
         document.getElementById("mysunrise").innerHTML = LocationSunriseStr;
         document.getElementById("mysunset").innerHTML = LocationSunsetStr;             
         }            
            
            
            
            
            
         k = LocationSunriseStr + " / " + LocationSunsetStr;
         b = LocationMoonriseStr + " / " + LocationMoonsetStr;
         document.getElementById("c" + i).innerHTML = k;
         document.getElementById("d" + i).innerHTML = b;
        

         

  }    
    
    

    
    
};



function myinterval() {
  update_clock();
  MySunCalc();    
  setInterval('myinterval()', 60000);    
}

