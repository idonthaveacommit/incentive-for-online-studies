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
                  console.log(accuracy);
                  // check for feedback point
                  console.log(screenIndex);
                  if(screenIndex == 0) {
                      if (accuracy < 0.35) {
                          return {new_screenName: 'negative_feedback'};
                      }
                      else if (accuracy > 0.75) {
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