// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD0rJexrPM7FcqtVemxTlUc1XZ52KSeB5w",
    authDomain: "kam-na-rande-54802.firebaseapp.com",
    projectId: "kam-na-rande-54802",
    storageBucket: "kam-na-rande-54802.appspot.com",
    messagingSenderId: "344926999376",
    appId: "1:344926999376:web:6162e833cdb2cae8855255",
    measurementId: "G-M5DRYDCZ4E"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore service
var db = firebase.firestore();

var generateBtn = document.getElementById('generate-btn');
var confirmBtn = document.getElementById('confirm-btn');
var dateIdeaDiv = document.getElementById('date-idea');


var currentIdea = null;

generateBtn.addEventListener('click', function() {
    // Fetch all date ideas from Firestore
    db.collection('dateIdeas').get()
        .then((snapshot) => {
            let ideas = [];
            let weights = [];
            let totalWeight = 0;
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                const daysSinceLastDate = (new Date() - new Date(data.lastDate.seconds * 1000)) / (1000 * 60 * 60 * 24);
                
                // Calculate the weight. You can adjust the formula as needed.
                const weight = daysSinceLastDate + 1; // "+ 1" ensures every idea has a non-zero weight
                
                ideas.push({ id: doc.id, idea: data.idea });
                weights.push(weight);
                totalWeight += weight;
            });
            
            // Select a random idea based on weights
            const randomNum = Math.random() * totalWeight;
            let sum = 0;
            let selectedIdea = null;
            
            for (let i = 0; i < ideas.length; i++) {
                sum += weights[i];
                if (randomNum <= sum) {
                    selectedIdea = ideas[i];
                    break;
                }
            }
            
            currentIdea = selectedIdea;
            dateIdeaDiv.innerText = selectedIdea.idea;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });
});


confirmBtn.addEventListener('click', function() {

    if (currentIdea) {
        db.collection('dateIdeas').doc(currentIdea.id).update({
            lastDate: new Date()
        })
        .then(() => {
            console.log('Date successfully updated!');
            currentIdea = null;
            dateIdeaDiv.innerText = '';
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
        });
    }
});
    