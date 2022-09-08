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
    if (row.display == 'fullscreen' && screenIndex == 1) {
        launchIntoFullscreen(document.documentElement);
    }
    else if (row.display == 'final_score' && screenIndex == 0) {
        _accuracy = gorilla.retrieve('accuracy', 0, true);
        var percentile: number = 0;
        if (_accuracy > 85) {
            percentile = 15;
        }
        else if (_accuracy > 85) {
            percentile = 15;
        }
        else if (_accuracy > 75) {
            percentile = 25;
        }
        else if (_accuracy > 65) {
            percentile = 35;
        }
        else if (_accuracy > 55) {
            percentile = 45;
        }
        else if (_accuracy > 45) {
            percentile = 55;
        }
        else if (_accuracy > 35) {
            percentile = 65;
        }
        else if (_accuracy > 25) {
            percentile = 75;
        }
        else {
            percentile = 15;
        }
        var comp_percentile: number = 100 - percentile;
        gorilla.storeMany({'percentile': percentile, 'comp_percentile': comp_percentile}, true)
    }
})
