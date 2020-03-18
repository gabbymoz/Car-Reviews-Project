var firebaseConfig = {
    apiKey: "AIzaSyBdHlHn0CYo7HMgF8YuhFfT7UqZRW-lLKo",
    authDomain: "car-reviews-406b3.firebaseapp.com",
    databaseURL: "https://car-reviews-406b3.firebaseio.com",
    projectId: "car-reviews-406b3",
    storageBucket: "car-reviews-406b3.appspot.com",
    messagingSenderId: "770150404662",
    appId: "1:770150404662:web:6d1363d844f4b53c89fe97",
};

const FB_COLLECTION = "messages";
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let database = firebase.firestore();
async function getMessagesAsync() {
    let messages = [];
    try {
        let snapshot = await database.collection(FB_COLLECTION).get();
        messages = snapshot.docs.map(doc => {
            return doc;
        });
    } catch (err) {
        console.log(err);
    }
    return messages;
  }
  async function getMessageByIdAsync(id) {
    let message;
    try {
        product = await database.doc(`${FB_COLLECTION}/${id}`).get();
    } catch (err) {
        console.log(err);
    }
    return message;
}
async function deleteMessageByIdAsync(id) {
    try {
        await database.doc(`${FB_COLLECTION}/${id}`).delete();
        return true;
    } catch (err) {
        console.log(err);
      }
    
      return false;
    }