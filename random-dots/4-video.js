function checkVideoPerm() {
    constraints = {
        video: true
    };
    var successCallback = function(error) {
    };
    var errorCallback = function(error) {
        gorilla.metric({
            trial_number: 'webcamPermission',
            response: 'false',
        });
    };
    navigator.mediaDevices.getUserMedia(constraints).then(successCallback, errorCallback);
}

function launchIntoFullscreen(element){
    if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

gorillaTaskBuilder.onScreenStart((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string) => {
    if (row.display == 'ready' && screenIndex == 0) {
        checkVideoPerm();
    }
    else if (row.display == 'fullscreen' && screenIndex == 1) {
        launchIntoFullscreen(document.documentElement);
    }
})

