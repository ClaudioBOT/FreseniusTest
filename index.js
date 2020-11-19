var cognosApi = undefined;

function main(){
  var url = "https://eu-de.functions.appdomain.cloud/api/v1/web/943986b9-04ad-4948-a1fe-6ecec8b20dec/cognos/";
  var getSession = "cognosSession";
  var getDash = "getDashboard";

  console.log("Requesting cognos session token");
  $.get(url+getSession+".json",  {webDomain: window.location.href}, function(data, status){
    console.log("Got session token", data);

    cognosApi = new CognosApi({
    	cognosRootURL: data.cognos_api_url,
    	node: document.getElementById('cognos-iframe'),
    	sessionCode: data.sessionCode,
    	language: 'en'
    });

    cognosApi.initialize().then(() => {
      $.get(url+getDash+".json",  {webDomain: window.location.href}, function(data, status){
        var dash = data;
        cognosApi.dashboard.openDashboard({
          dashboardSpec: dash
        });
      });
    });
  });
}
