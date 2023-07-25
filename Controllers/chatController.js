const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");

const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const createChatUsingCodeReferral = async (req, res) => {
  try {
    const { firstId, codeReferral } = req.body;
    console.log("first Id " + firstId + ", second Id " + codeReferral);
    const partition = await userModel.findOne({
      codereferral: codeReferral,
    });

    if (!partition) return res.status(400).json("Code Referral Invalid!!!");

    const secondId = partition._id.valueOf();
    console.log(secondId);

    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findUserChat = async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log("userId : ", userId);
    const chats = await chatModel.aggregate([
      {
        $match: { members: { $in: [userId] } },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$chatId", "$$chatId"],
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
          ],
          as: "message",
        },
      },
      // {
      //   $sort: {"message[0].createdAt": -1}
      // }
    ]);
    // console.log(chats);
    if (!chats) return res.status(200).json("Anda Belum Memiliki History Chat Apapun");
    const newchats = await Promise.all(
      chats.map(async (item) => {
        if (item.members[0] == userId) {
          // console.log(item.members[1]);
          const user = await userModel.findById(item.members[1]);
          return { ...item, recipientName: user.name, recipientId: user._id, recipientAvatar: user.avatar };
        } else {
          const user = await userModel.findById(item.members[0]);
          return { ...item, recipientName: user.name, recipientId: user._id, recipientAvatar: user.avatar };
        }
      })
    );

    // console.log(newchats);
    if (newchats.length > 1) {
      function custom_sort(a, b) {
        if (!a.message[0] && !b.message[0]) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (!a.message[0]) {
          return new Date(b.message[0].createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (!b.message[0]) {
          return new Date(b.createdAt).getTime() - new Date(a.message[0].createdAt).getTime();
        } else {
          return (
            new Date(b.message[0].createdAt).getTime() - new Date(a.message[0].createdAt).getTime()
          );
        }
      }
      newchats.sort(custom_sort);
    }
    res.status(200).json(newchats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (!chat) return res.status(200).json("Anda Belum Memulai Chat dengan Orang ini");

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const tryfindChat = async (req, res) => {
  try {
    const { userId } = req.body;

    const chats = await chatModel.aggregate([
      {
        $match: { members: { $in: [userId] } },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$chatId", "$$chatId"],
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
          ],
          as: "message",
        },
      },
    ]);
    if (!chats) return res.status(200).json("Anda Belum Memulai Chat dengan Orang ini");
    const newchats = await Promise.all(
      chats.map(async (item) => {
        if (item.members[0] == userId) {
          console.log(item.members[1]);
          const user = await userModel.findById(item.members[1]);
          return { ...item, name: user.name };
        } else {
          const user = await userModel.findById(item.members[0]);
          return { ...item, name: user.name };
        }
      })
    );

    res.status(200).json(newchats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;

    const deleteC = await chatModel.findByIdAndRemove(chatId);

    res.status(200).json(deleteC);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  createChat,
  findChat,
  findUserChat,
  createChatUsingCodeReferral,
  tryfindChat,
  deleteChat,
};
