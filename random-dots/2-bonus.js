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

    if (row.display == 'final_score') {
        if (screenIndex == 0) {
            _accuracy = gorilla.retrieve('accuracy', 0, true);
            var bonus: number = 0;
            if (_accuracy >= 85) {
                gorilla.metric ({
                    trial_number: 'bonusAwarded',
                    response: 'true',
                });
                bonus = 1;
            }
            else {
                gorilla.metric ({
                    trial_number: 'bonusAwarded',
                    response: 'false',
                });
                bonus = 0;
            }
            gorilla.store('bonus_flag', bonus, true);
        }
    }
    
    else if (row.display == 'fullscreen' && screenIndex == 1) {
        launchIntoFullscreen(document.documentElement);
    }
})

gorillaTaskBuilder.onScreenRedirect((spreadsheet: any[], rowIndex: number, screenIndex: number, row: any, 
    response: any, correct: boolean, timeOut: boolean, attempt: number) => {
        
        if (row.display == 'final_score' && screenIndex == 0) {
            
            var bonus: number = gorilla.retrieve('bonus_flag', -1, true);
            console.log(bonus);
            
            if (bonus == 1) {
                return {new_screenName: 'yes_bonus'};
            }
            else if (bonus == 0) {
                return {new_screenName: 'no_bonus'};
            }
            else {
                return {new_screenName: 'end'};
            }
        }
        return null;
    })