  //Tracking
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-32685589-1']);
  _gaq.push(['_trackPageview']);

  (function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

// Auto* section

$(document).ready(function(e) {
	if (document.location.pathname=="/") return;//Don't add to front page
	
	API.addEventListener(API.DJ_ADVANCE, function(){
		ppDJAdvance();
		autoWoot();
	});

	API.addEventListener(API.DJ_UPDATE, function(){
		ppDJUpdate();
		autoJoin();
	});
	
	API.addEventListener(API.CHAT,function(data){
		if (data.message.indexOf(API.getSelf().username)!=-1){
			var message = {};
			message.image = "http://www.plug.dj/images/avatars/thumbs/" + API.getUser(data.fromID).avatarID + ".png";
			message.title = "Chat";
			message.text = data.from + " said: \"" + data.message + "\"";
			firePPEvent(message);
		}
	});
	
	$('#plugPlus .option').bind('click',function(eventData){
		var pressed = eventData.currentTarget;
		if($(pressed).data('active')!='true'){
			$(pressed).data('active','true').css('background-color','green');
			if (pressed.id == "ppaj"){
				autoJoin();
			}
			if (pressed.id == "ppaw"){
				autoWoot();
			}
			setCookie(pressed.id,'true',7);
		}else{
			$(pressed).data('active','false').css('background-color','red');
			setCookie(pressed.id,'false',7);
		}
	});
	//Remember options for 7 days
	if (getCookie('ppaw')=="true"){
		$('#ppaw').click();
		setTimeout(autoWoot,10000);//Wait an extra 10 seconds to autoWoot again.
	}else{
		setCookie('ppaw','false',7);
	}	
	if (getCookie('ppaj')=="true"){
		$('#ppaj').click();
		setTimeout(autoJoin,10000);//Wait an extra 10 seconds to autoJoin again.
	}else{
		setCookie('ppaj','false',7);
	}
});


function autoWoot(){
	var dj = API.getDJs()[0];
	if(dj == null) return; //no dj
	if(dj == API.getSelf()) return; //don't woot yourself
	if($('#ppaw').data('active')!='true') return; //AutoWoot Off
	$('#button-vote-positive').click(); //Woot
}

function autoJoin(){
	if ($('#ppaj').data('active')!='true') return; //autoJoin off
	if ($('#button-dj-quit').css('display')!="none") return;//Already a dj.
	if ($('#button-dj-waitlist-leave').css('display')!="none") return; //Already on waitlist
	if ($('#button-dj-play').css('display')!="none"){//Check for waitlist.
		$('#button-dj-play').click();//Join
	}else if ($('#button-dj-waitlist-join').css('display')!="none"){//Waitlist available
		$('#button-dj-waitlist-join').click();//Join
	}//Things shouldn't get here but we should check TODO
}

/* Begin Notifications */

var baseEvent = document.createEvent('Event');
baseEvent.initEvent('baseEvent',true,true);

function firePPEvent(data){
	$('#ppEvents').html(JSON.stringify(data));
	$('#ppEvents').get(0).dispatchEvent(baseEvent);
}

function ppDJAdvance(){
	var data = {};
	data.image = API.getMedia().image;
	data.title = "Song Update";
	data.text = API.getMedia().title + " by " + API.getMedia().author;
	firePPEvent(data);
}

function ppDJUpdate(){
	var data = {};
	data.image = "http://www.plug.dj/images/avatars/thumbs/" + API.getDJs()[0].avatarID + ".png";
	data.title = "New DJ";
	data.text = "DJ " + API.getDJs()[0].username + " is now playing.";
	firePPEvent(data);
}

/* Additional Functions */

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value + "; path="+document.location.pathname; //Force one cookie per room.
}

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}
