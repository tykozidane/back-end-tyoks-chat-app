const messageModel = require("../Models/messageModel");
// Initialize Cloud Storage and get a reference to the service
const {storage} = require("../firebase");
const { ref, deleteObject} = require("firebase/storage")

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text, typeMessage } = req.body;
    console.log("createMessage " + text);
    if(!text) return res.status(400).json("Text tidak boleh kosong");
    const newMessage = new messageModel({
      chatId,
      typeMessage,
      senderId,
      text,
    });

    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getMessage = async (req, res) => {
  try {
    const { chatId } = req.body;

    const messages = await messageModel.find({ chatId });

    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const {chatId} = req.body;
    // console.log("chatId Delete : " + chatId)
    let countFail = 0
    const dataChat = await messageModel.find({chatId: chatId});
    dataChat.filter((e)=> { return e.typeMessage == "image"}).map((e)=> {
      const delFile  = deletImageFirebase(e.text);
      if(delFile === false) {
        countFail++;
      }
    })
    const deleteM = await messageModel.deleteMany({chatId: chatId});
    console.log(deleteM);
    res.status(200).json({deleteM, countFail});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);

  }
};

function deletImageFirebase(url) {
  const indexOfEndPath = url.indexOf("?");
  
      let imagePath = url.substring(0,indexOfEndPath);
      
      //  imagePath = imagePath.replace("%2F","/");
      
      let fileName = imagePath.split("%2F")
      const storageRef = storage.ref();
  const delref = storageRef.child(`images/${fileName[1]}`);
  // Delete the file
 delref.delete().then(() => {
  console.log("berhasil hapus");
  return true;
}).catch((error) => {
  console.log("gagal hapus :"+ error);
  return false;
});
}

const deleteImage = async (req, res) => {
  try {
    function getPathStorageFromUrl(url){

      // const baseUrl = "https://firebasestorage.googleapis.com/v0/b/project-80505.appspot.com/o/";
  
      // let imagePath = url.replace(baseUrl,"");
  
      const indexOfEndPath = url.indexOf("?");
  
      let imagePath = url.substring(0,indexOfEndPath);
      
      //  imagePath = imagePath.replace("%2F","/");
      
      let fileName = imagePath.split("%2F")
      return fileName[1];
  }
  const {url} = req.body;
  const path = getPathStorageFromUrl(url);
  const storageRef = storage.ref();
  const delref = storageRef.child(`images/${path}`);
  // Delete the file
 delref.delete().then(() => {
  console.log("berhasil hapus");
}).catch((error) => {
  console.log("gagal hapus :"+ error);
});
  res.status(200).json(path);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

module.exports = {
  createMessage,
  getMessage,
  deleteMessage,
  deleteImage
};
