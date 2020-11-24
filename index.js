const url = "https://e7306d01.eu-de.apigw.appdomain.cloud/fresenius/";
const getSession = "cognosSession";
const getDash = "getDashboard";
const login = "login";

var cognosApi = undefined;
var password = "";

function showCognos(){
  $("body").html('<div id = "cognos-iframe"></div>');

  $.ajax({
    url: url+getSession,
    headers: {apikey: password},
    data: {webDomain: window.location.href},
    success: function(data) {
      console.log("Got session token", data);

      cognosApi = new CognosApi({
      	cognosRootURL: data.cognos_api_url,
      	node: document.getElementById('cognos-iframe'),
      	sessionCode: data.sessionCode,
      	language: 'en'
      });

      cognosApi.initialize().then(() => {
        $.ajax({
          url: url+getDash,
          headers: {apikey: password},
          data: {webDomain: window.location.href},
          success: function(data) {
            var dash = data;
            cognosApi.dashboard.openDashboard({
              dashboardSpec: dash
            });
          }
        });
      });
    }
  });
}

function showLogin(){
  var loginPage = `
  <div class="hero is-bold animate__animated animate__backInLeft" id="passTab">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Please, insert the password
        </h1>
        <div class="subtitle field has-addons">
          <div class="control">
            <input class="input" type="password" placeholder="password" id="pass">
          </div>
          <div class="control">
            <a class="button is-ghost" onclick="passCheck()" onkeypress="()">
              Send
            </a>
          </div>
        </div>
        <div id="msg"></div>
      </div>
    </div>
  </div>`;

  $("body").html(loginPage);

  $('#pass').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        passCheck();
    }
});
}

function passCheck(e){
  var pwd = document.getElementById("pass").value;

  $.ajax(
    {
      url: url+login,
      headers: {apikey: pwd},
      success: function(data) {
        //console.log(data);
        console.log("Password is correct");
        password = pwd;
        document.getElementById("passTab").classList.add("animate__backOutRight");
        setTimeout(showCognos, 470);
      },
      error: function(data) {
        console.log("Password is not correct");
        $("#msg").html(`
          <div class="notification is-danger animate__animated animate__bounceInLeft" style="width: fit-content;">
            The password is not correct
          </div>`
        );
      }
    });
}

function main(){
  showLogin();
}
