function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
  
  var _accuracy: number = 0;
  
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
  
  gorillaTaskBuilder.preProcessSpreadsheet((spreadsheet: any[]) => {
      var assignedLeft = gorilla.retrieve('Left', null);
      var assignedRight = gorilla.retrieve('Right', null);
      var assignedUp = gorilla.retrieve('Up', null);
      var assignedDown = gorilla.retrieve('Down', null);
      
      gorilla.storeMany({'recent_correct': 0, 'recent_incorrect': 0, 'recent_total': 0}, true);
      
      if (!assignedLeft) {
          var choices = ['Blue', 'Red', 'Green', 'Yellow'];
          shuffleArray(choices);
          
          assignedLeft = choices[0];
          assignedRight = choices[1];
          assignedUp = choices[2];
          assignedDown = choices[3];
          
          gorilla.storeMany({
              'Left': assignedLeft,
              'Right': assignedRight,
              'Up': assignedUp,
              'Down': assignedDown
          }, true);
      }
      
      var modifiedSpreadsheet = [];
      
      for (var i = 0; i < spreadsheet.length; i++) {
          if (spreadsheet[i]['Left'] && spreadsheet[i]['Left'].length > 0){
                  spreadsheet[i]['Left'] = assignedLeft;
                  spreadsheet[i]['Right'] = assignedRight;
                  spreadsheet[i]['Up'] = assignedUp;
                  spreadsheet[i]['Down'] = assignedDown;
                  modifiedSpreadsheet.push(spreadsheet[i]);
          } else
              modifiedSpreadsheet.push(spreadsheet[i]);
      }
      
      return modifiedSpreadsheet;
  });
  
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
  
  