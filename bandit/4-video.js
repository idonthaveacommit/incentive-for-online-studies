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

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
}

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

var _requiredColumnOne = 'Stimuli 1';
var _requiredColumnTwo = 'Stimuli 2';
var _requiredColumnThree = 'Stimuli 3';
var _requiredColumnFour = 'Stimuli 4';
var _shuffledAlready: string = 'shuffledAlready';
var _faIndex = 0;
var finalAnswers = [];


gorillaTaskBuilder.preProcessSpreadsheet((spreadsheet: any[]) => {

  var shuffledArray = gorilla.retrieve(_shuffledAlready, null, true);
  var stimuliList = []
  var n_trials = 16;
  var n_blocks = 9;
  var arms = 4;

  if (!shuffledArray) {
      
      shuffledArray = [];
      // var img_num = Array.from({length: 9}, () => Math.floor(Math.random() * 9 + 1));
      // for (var i = 0; i < 9; i++) {
      //   shuffledArray.push(Array(n_trials).fill('bandit-' + img_num[i] + '.png'));
      // }
      
      for (var i = 0; i < n_blocks; i++) {
          var blockArray = [];
          for (var j = 0; j < n_trials; j++) {
              trialArray = [];
              for (var k = 0; k < arms; k++) {
                  trialArray.push('bandit-' + (i+1) + '-' + k + '.png');
              }
              shuffleArray(trialArray);
              blockArray.push(trialArray);
          }
          shuffledArray.push(blockArray);
      }
      
      // shuffledArray = shuffledArray.flat()
      gorilla.store(_shuffledAlready, shuffledArray, true);
  }
  
  var choice_list = ['left', 'top', 'right', 'bottom'];
  
  var practice = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],    // 14/16
      [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
      [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
      [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
  ];
  
  var trials_list = [
      [
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],    // 14/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],    // 12/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],    // 14/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],    // 12/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],    // 10/16
          [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],    // 6/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],    // 10/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],    // 10/16
          [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],    // 6/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],    // 2/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
      [
          [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],    // 10/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 4/16
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]     // 2/16
      ],
  ];
  
  shuffleArray(practice);
  for (var i = 0; i < 4; i++) {
    shuffleArray(practice[i]);
  }
  
  shuffleArray(trials_list);
  for (var i = 0; i < trials_list.length; i++) {
      shuffleArray(trials_list[i]);
      for (var j = 0; j < 4; j++) {
        shuffleArray(trials_list[i][j]);
      }
  }
  
  for (var j = 0; j < n_trials; j++) {
      var answer_arr = [];
      for (var i = 0; i < 4; i++) {
          if (practice[i][j]) {
              answer_arr.push(choice_list[shuffledArray[0][j].indexOf(shuffledArray[0][0][i])]);
          }
      }
      finalAnswers.push(answer_arr);
  }
  
  for (var i = 0; i < trials_list.length; i++) {
      for (var k = 0; k < n_trials; k++) {
          var answer_arr = [];
          for (var j = 0; j < 4; j++) {
              if (trials_list[i][j][k])
                  answer_arr.push(choice_list[shuffledArray[i+1][k].indexOf(shuffledArray[i+1][0][j])]);
          }
          finalAnswers.push(answer_arr);
      }
  }
  
  shuffledArray = shuffledArray.flat();
  var modifiedSpreadsheet = [];
  var shuffledArrayIndex: number = 0;
  var finalAnswersIndex: number = 0;
  
  for(var i = 0; i < spreadsheet.length; i++){
      if(spreadsheet[i][_requiredColumnOne] && spreadsheet[i][_requiredColumnOne].length > 0){
          if (spreadsheet[i]['display'] == 'final_choice') {
              spreadsheet[i][_requiredColumnOne] = modifiedSpreadsheet[modifiedSpreadsheet.length - 1][_requiredColumnOne];
              spreadsheet[i][_requiredColumnTwo] = modifiedSpreadsheet[modifiedSpreadsheet.length - 1][_requiredColumnTwo];
              spreadsheet[i][_requiredColumnThree] = modifiedSpreadsheet[modifiedSpreadsheet.length - 1][_requiredColumnThree];
              spreadsheet[i][_requiredColumnFour] = modifiedSpreadsheet[modifiedSpreadsheet.length - 1][_requiredColumnFour];
              modifiedSpreadsheet.push(spreadsheet[i]);
          }
          else if(shuffledArrayIndex <= shuffledArray.length){
              spreadsheet[i][_requiredColumnOne] = shuffledArray[shuffledArrayIndex][0];
              spreadsheet[i][_requiredColumnTwo] = shuffledArray[shuffledArrayIndex][1];
              spreadsheet[i][_requiredColumnThree] = shuffledArray[shuffledArrayIndex][2];
              spreadsheet[i][_requiredColumnFour] = shuffledArray[shuffledArrayIndex][3];
              spreadsheet[i]['Correct Answers'] = finalAnswers[finalAnswersIndex];
              modifiedSpreadsheet.push(spreadsheet[i]);
              shuffledArrayIndex++;
              finalAnswersIndex++;
          } else {
              console.log('Somehow, we have gone out of bounds on the contents of the shuffled column.  Double check the code for errors');
          }
      } else {
          modifiedSpreadsheet.push(spreadsheet[i]);
      }
  }

  gorilla.store(_faIndex, 0, true);
  return modifiedSpreadsheet;
  
});

var _displayName1 = 'task';
var _displayName2 = 'practice';
var _screenIndexNum = 0;

gorillaTaskBuilder.isCorrect((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, response: string, zoneName: string, zoneType: string) => {
 
  if(row.display == _displayName1 || row.display == _displayName2){
      if(screenIndex == _screenIndexNum){
          var r = gorilla.retrieve(_faIndex, null, true);
          gorilla.store(_faIndex, r+1, true);
          if(finalAnswers[r].includes(response)){
              return { newCorrect: true; }
          }
      }
  }
  
  return null;
});

gorillaTaskBuilder.onScreenStart((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string) => {
  if (row.display == 'ready' && screenIndex == 0) {
      checkVideoPerm();
  }
  
  else if (row.display == 'fullscreen' && screenIndex == 1) {
      launchIntoFullscreen(document.documentElement);
  }
})
