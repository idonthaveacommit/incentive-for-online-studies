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
    // Retrieve our current total scores.  If we don't them ser yet, initialise them to zero
    if(row.display == 'trials'){
        var recentTotal: number = gorilla.retrieve('recent_total', 0, true);
        recentTotal += 1;
        switch(screenIndex){
            case 1:
                // Correct answer screen
                var recentCorrect: number = gorilla.retrieve('recent_correct', 0, true);
                recentCorrect += 1;
                gorilla.storeMany({'recent_correct': recentCorrect, 'recent_total': recentTotal}, true);
                break;
                
            case 2:
                // Incorrect answer screen
                var recentIncorrect: number = gorilla.retrieve('recent_incorrect', 0, true);
                recentIncorrect += 1;
                gorilla.storeMany({'recent_incorrect': recentIncorrect, 'recent_total': recentTotal}, true);
                break;
        }
    }
    
    else if (row.display == 'fullscreen' && screenIndex == 1) {
        launchIntoFullscreen(document.documentElement);
    }
})

gorillaTaskBuilder.onScreenRedirect((spreadsheet: any[], rowIndex: number, screenIndex: number, row: any, 
    response: any, correct: boolean, timeOut: boolean, attempt: number) => {
        
        if(row.display == 'trials') {
            if (screenIndex == 3 || screenIndex == 4) {
                gorilla.storeMany({'recent_correct': 0, 'recent_incorrect': 0, 'recent_total': 0}, true);
                return null;
            }
            
            var total: number = gorilla.retrieve('recent_total', 0, true);
            console.log(total);
            
            if (total >= 16) {
                var recentCorrect: number = gorilla.retrieve('recent_correct', 0, true);
                var accuracy = recentCorrect / total;
                if(screenIndex == 0) {
                    if (accuracy <= 0.4) {
                        return {new_screenName: 'negative_feedback'};
                    }
                    else if (accuracy >= 0.65) {
                        return {new_screenName: 'positive_feedback'};
                    }
                    else {
                        gorilla.storeMany({'recent_correct': 0, 'recent_incorrect': 0, 'recent_total': 0}, true);
                    }
                }
            }
        }
        return null;
    })