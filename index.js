//----------------Getting elements----------------
//---for the 'login' screen---
const mainDispEl = document.getElementById('mainDispEl');
    const grayFilter = document.getElementById('greyFilter');

    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    const name3 = document.getElementById('name3');
    const name4 = document.getElementById('name4');

    const topLeft = document.getElementById('topLeft');
    const topRight = document.getElementById('topRight');
    const bottomLeft = document.getElementById('bottomLeft');
    const bottomRight = document.getElementById('bottomRight');
//---for the homepage screen---
const homepageDispEl = document.getElementById('homepageDispEl');
    const welcomeNameEl = document.getElementById('welcomeNameEl');
    const addTaskButton = document.getElementById('addTaskButton');
        const ttopDiv = document.getElementById('ttopDiv');
            const profileSetting = document.getElementById('profileSetting');
    const stats = document.getElementById('stats');
    const proBarPoints = document.getElementById('proBarPoints');

    const taskTitle = document.getElementById('taskTitle');
    const tasksDiv = document.getElementById('tasksDiv');
        const placeholderTask = document.getElementById('placeholderTask');
        const taskDescrip = document.getElementById('taskDescrip');
        const taskP = document.getElementById('taskP');

    //---for the add task screen---
    const addTaskScreenEl = document.getElementById('addTaskScreenEl');
        const buttons = document.querySelectorAll('.points');
        const finishButton = document.getElementById('finishButton');
        const inputText = document.getElementById('inputText');

    //---for the profile pic screen---
    const profileSettingScreen = document.getElementById('profileSettingScreen');
        const nameInput = document.getElementById('nameInput');
        const colorInput = document.getElementById('colorInput');
        const profilePicInput = document.getElementById('profilePicInput');
        const saveChanges = document.getElementById('saveChanges');


//---------------Functions-----------------
//---to hide show something and hide other thing---
function hideTTHISshowTTHAT(tthis, thisCSS, tthat, thatCSS){
    tthis.classList.remove(thisCSS);
    tthis.classList.add('none');

    grayFilter.style.display = 'none';

    tthat.classList.remove('none');
    tthat.classList.add(thatCSS);
}
//---to add the 'addTaskButton'---
function addTaskButtonFunction() {
    addTaskButton.classList.add('addTaskButton');
    ttopDiv.style.gridTemplateColumns = "1fr 1fr";
}
//---to not add the 'addTaskButton'---
function notAddTaskButtonFunction() {
    addTaskButton.classList.remove('addTaskButton');
    addTaskButton.classList.add('none');
    ttopDiv.style.gridTemplateColumns = "1fr";
}
//---show something---
function showTTHIS(ttthis, type){
    ttthis.style.display = type;
}
//---hide something---
function hideTTHIS(ttthis, type){
    ttthis.style.display = type;
}
//---function to create and append placeholder task elements---
function createPlaceholderTasks(tasksArray) {
    // get the tasksDiv element
    const tasksDiv = document.getElementById('tasksDiv');
    
    // clear the tasksDiv before appending new tasks
    tasksDiv.innerHTML = '';
    
    for (let i = 0; i < tasksArray.length; i++) {
      let taskName = tasksArray[i].name;
      let taskPoints = tasksArray[i].points;
  
      // create a new placeholderTask div
      let placeholderTask = document.createElement('div');
      placeholderTask.className = 'placeholderTask';
  
      // create and set the task name element
      let taskDescrip = document.createElement('p');
      taskDescrip.id = 'taskDescrip';
      taskDescrip.innerHTML = taskName;
      placeholderTask.appendChild(taskDescrip);
  
      // create and set the task points element
      let taskP = document.createElement('p');
      taskP.id = 'taskP';
      taskP.innerHTML = taskPoints + 'p';
      placeholderTask.appendChild(taskP);
  
      // create and set the check icon element
      let checkIcon = document.createElement('i');
      checkIcon.setAttribute('class', 'fa-sharp fa-solid fa-check');
      placeholderTask.appendChild(checkIcon);
  
      // append the new placeholderTask div to the tasksDiv div
      tasksDiv.appendChild(placeholderTask);
    }
  
    tasksDiv.style.gridTemplateRows = `repeat(${tasksArray.length}, 30%)`;
}
//---show points---
function showPoints(documentID){
    yeye = documentID;
    db.collection("person").doc(yeye).onSnapshot((doc) => {
        let points = doc.data().points;
        proBarPoints.innerHTML = `Du har ${points} poeng`;
});
}
//---get points from placeholder task
function deleteTask(documentID){
    db.collection("tasks").doc(documentID).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}
//---add points from task---
function addPointsToDB(personID, amount){
    personID = String(personID)
    let parsedAmount = parseFloat(amount); 

    db.collection("person").doc(personID).update({
        points: firebase.firestore.FieldValue.increment(parsedAmount)
    })
    .then(() => {
        console.log("Points successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating points: ", error);
    });
};
//---for updating personal info---
function updateProfileInfo(personID) {
  const updateData = {};
  if (nameInput.value !== '') {
    updateData.name = nameInput.value;
  }
  if (colorInput.value !== '#000000') {
    updateData.favColor = colorInput.value;
  }
  if (profilePicInput.value !== '') {
    updateData.profilePic = profilePicInput.value;
  }

  db.collection('person')
    .doc(personID)
    .update(updateData)
    .then(() => {
        hideTTHIS(profileSettingScreen, 'none');
        welcomeNameEl.innerHTML = 'Hei ' + nameInput.value;
        document.documentElement.style.setProperty('--primary-color', colorInput.value);
        profileSetting.style.backgroundImage = `url(${profilePicInput.value})`;
    });
}



//-------------------hide divs and clear inputs on window load---------------------
window.addEventListener('load', () => {
    profileSettingScreen.style.display = "none";
    addTaskScreenEl.style.display = "none";
    finishButton.style.display = "none";

    nameInput.value = "";
    colorInput.value = "rgb(0, 0, 0)";
    profilePicInput.value = "";
});

//------------------reset points sunday midnight--------------------
setInterval(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
  
    if (currentDay === 0 && currentHour === 0 && currentMinute === 0) {
        db.collection("person").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({points: 0});
            });
        });
    }
}, 60000);

// -------------------------------------------------------------------------------------------------------------------------------

//---set persons info when their pic is clicked---
let mainPerson = {};
let tasksArray = [];
let person = {};
let persons = [];
//-------------Get info from 'tasks' collection -----------------

db.collection("person").get().then((querySnapshot) => {
    db.collection("person").onSnapshot((querySnapshot) => {
        //---set each person document as a pbject and then in a array
        querySnapshot.forEach((doc) => {
            let person = {
                id: doc.id,
                name: doc.data().name,
                parent: doc.data().parent,
                points: doc.data().points,
                profilePic: doc.data().profilePic,
                favColor: doc.data().favColor
            };
            persons.push(person);
        });

        //---push name and profile pic into array and use them for "login screen"---
        const name = [];
        const profilePic = [];
        querySnapshot.forEach((doc) => {
          name.push(doc.data().name);
          profilePic.push(doc.data().profilePic);
        });
      
        //---show the name---
        name1.innerHTML = name[0];
        name2.innerHTML = name[1];
        name3.innerHTML = name[2];
        name4.innerHTML = name[3];
      
        //--show the pictures---
        topLeft.style.backgroundImage = `url(${profilePic[0]})`;
        topRight.style.backgroundImage = `url(${profilePic[1]})`;
        bottomLeft.style.backgroundImage = `url(${profilePic[2]})`;
        bottomRight.style.backgroundImage = `url(${profilePic[3]})`;
    });



    topLeft.addEventListener('click', () => {
        let mainPerson = {
            id: persons[0].id,
            name: persons[0].name,
            parent: persons[0].parent,
            points: persons[0].points,
            profilePic: persons[0].profilePic,
            favColor: persons[0].favColor
        };
        
        //---check if person is a parent
        if (mainPerson.parent === true){
            //--if true, then add the 'addtaskbutton' and show next screen--
            addTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        } else {
            //--if false, show next screen without the button--
            notAddTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        }
        welcomeNameEl.innerHTML = 'Hei ' + mainPerson.name;
        document.documentElement.style.setProperty('--primary-color', mainPerson.favColor);
        profileSetting.style.backgroundImage = `url(${mainPerson.profilePic})`;


        showPoints(mainPerson.id);

        db.collection("tasks").onSnapshot((querySnapshot) => {
            let checkIcons = document.querySelectorAll('.fa-sharp.fa-solid.fa-check');
            checkIcons.forEach(icon => {
                icon.addEventListener('click', () => {
                const task = {
                    taskDescription: icon.parentNode.querySelector('#taskDescrip').textContent,
                    taskPoints: icon.parentNode.querySelector('#taskP').textContent
                };
                addPointsToDB(mainPerson.id, task.taskPoints);
                deleteTask(task.taskDescription)
                });
            });
        });
        
        saveChanges.addEventListener('click', () => {
            updateProfileInfo(mainPerson.id)
        });
    });
    
    topRight.addEventListener('click', () => {
        let mainPerson = {
            id: persons[1].id,
            name: persons[1].name,
            parent: persons[1].parent,
            points: persons[1].points,
            profilePic: persons[1].profilePic,
            favColor: persons[1].favColor
        };

        //---check if person is a parent
        if (mainPerson.parent === true){
            //--if true, then add the 'addtaskbutton' and show next screen--
            addTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        } else {
            //--if false, show next screen without the button--
            notAddTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        }
        welcomeNameEl.innerHTML = 'Hei ' + mainPerson.name;
        document.documentElement.style.setProperty('--primary-color', mainPerson.favColor);
        profileSetting.style.backgroundImage = `url(${mainPerson.profilePic})`;


        showPoints(mainPerson.id);

        db.collection("tasks").onSnapshot((querySnapshot) => {
            let checkIcons = document.querySelectorAll('.fa-sharp.fa-solid.fa-check');
            checkIcons.forEach(icon => {
                icon.addEventListener('click', () => {
                const task = {
                    taskDescription: icon.parentNode.querySelector('#taskDescrip').textContent,
                    taskPoints: icon.parentNode.querySelector('#taskP').textContent
                };
                addPointsToDB(mainPerson.id, task.taskPoints);
                deleteTask(task.taskDescription)
                });
            });
        });
        
        saveChanges.addEventListener('click', () => {
            updateProfileInfo(mainPerson.id)
        });
    });
    
    bottomLeft.addEventListener('click', () => {
        let mainPerson = {
            id: persons[2].id,
            name: persons[2].name,
            parent: persons[2].parent,
            points: persons[2].points,
            profilePic: persons[2].profilePic,
            favColor: persons[2].favColor
        };
        
        //---check if person is a parent
        if (mainPerson.parent === true){
            //--if true, then add the 'addtaskbutton' and show next screen--
            addTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        } else {
            //--if false, show next screen without the button--
            notAddTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        }
        welcomeNameEl.innerHTML = 'Hei ' + mainPerson.name;
        document.documentElement.style.setProperty('--primary-color', mainPerson.favColor);
        profileSetting.style.backgroundImage = `url(${mainPerson.profilePic})`;


        showPoints(mainPerson.id);

        db.collection("tasks").onSnapshot((querySnapshot) => {
            let checkIcons = document.querySelectorAll('.fa-sharp.fa-solid.fa-check');
            checkIcons.forEach(icon => {
                icon.addEventListener('click', () => {
                const task = {
                    taskDescription: icon.parentNode.querySelector('#taskDescrip').textContent,
                    taskPoints: icon.parentNode.querySelector('#taskP').textContent
                };
                addPointsToDB(mainPerson.id, task.taskPoints);
                deleteTask(task.taskDescription)
                });
            });
        });
        
        saveChanges.addEventListener('click', () => {
            updateProfileInfo(mainPerson.id)
        });
    });
    
    bottomRight.addEventListener('click', () => {
        let mainPerson = {
            id: persons[3].id,
            name: persons[3].name,
            parent: persons[3].parent,
            points: persons[3].points,
            profilePic: persons[3].profilePic,
            favColor: persons[3].favColor
        };
        
        //---check if person is a parent
        if (mainPerson.parent === true){
            //--if true, then add the 'addtaskbutton' and show next screen--
            addTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        } else {
            //--if false, show next screen without the button--
            notAddTaskButtonFunction();
            hideTTHISshowTTHAT(mainDispEl, 'mainDisp',  homepageDispEl, 'homepageDisp');
        }
        welcomeNameEl.innerHTML = 'Hei ' + mainPerson.name;
        document.documentElement.style.setProperty('--primary-color', mainPerson.favColor);
        profileSetting.style.backgroundImage = `url(${mainPerson.profilePic})`;


        showPoints(mainPerson.id);

        db.collection("tasks").onSnapshot((querySnapshot) => {
            let checkIcons = document.querySelectorAll('.fa-sharp.fa-solid.fa-check');
            checkIcons.forEach(icon => {
                icon.addEventListener('click', () => {
                const task = {
                    taskDescription: icon.parentNode.querySelector('#taskDescrip').textContent,
                    taskPoints: icon.parentNode.querySelector('#taskP').textContent
                };
                addPointsToDB(mainPerson.id, task.taskPoints);
                deleteTask(task.taskDescription)
                });
            });
        });
        
        saveChanges.addEventListener('click', () => {
            updateProfileInfo(mainPerson.id)
        });
    });
});



// -------------------------------------------------------------------------------------------------------------------------------

let checkIcons = null;
db.collection("tasks").onSnapshot((querySnapshot) => {
    tasksArray.length = 0;

    querySnapshot.forEach((doc) => {
        let taskName = doc.data().description;
        let taskPoints = doc.data().points;
        tasksArray.push({ name: taskName, points: taskPoints });
    });
    
    //---task info and amount of task shown
    if (tasksArray.length === 0){
        taskTitle.innerHTML = "Det er ingen oppgaver tilgjengelig";
    } else if(tasksArray.length === 1){
        taskTitle.innerHTML = tasksArray.length + ' oppgave tilgjengelig';
    }else {
        taskTitle.innerHTML = tasksArray.length + ' oppgaver tilgjengelig';
    }

    createPlaceholderTasks(tasksArray);
});


// -------------------------------------------------------------------------------------------------------------------------------


//---show addtask screen---
addTaskButton.addEventListener('click', () => {
    showTTHIS(addTaskScreenEl, 'grid')
    homepageDispEl.removeEventListener('click', homepageDispClickHandler);
});

//---change the color of a button and make it a button---
let selectedButton = null;
buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedButton = parseInt(button.innerHTML);
    });
  });


//---shows the add task button if requirments are met---
setInterval(() => {
    if (inputText.value !== '' && selectedButton !== null){
        showTTHIS(finishButton, 'grid');
        finishButton.classList.add('finishButton');
    } else {
        hideTTHIS(finishButton, 'none');  
    };
}, 100);

//---add task into db---
let description = '';
finishButton.addEventListener('click', () => {
    let description = inputText.value;
    let points = selectedButton;
    db.collection('tasks').doc(description).set({
        description: description,
        points: points
    }).then(docRef => {
        console.log('Document succesfully added with id')
        inputText.value = ''
        buttons.forEach(btn => btn.classList.remove('selected'));
        hideTTHIS(addTaskScreenEl, 'none')
    }).catch(error => {
        console.error('Error adding document:', error);
    });
});



//--Show profile setting screen---
profileSetting.addEventListener('click', () => {
    showTTHIS(profileSettingScreen, 'grid')
});