import { Group } from "../models/Group.mode.js";
import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";

export const getGroup = async (req, res) => {
  try {
    const { _id } = req?.user;
    console.log("hii");
    console.log(_id);
    const allowToSend = await User.findOne({ _id }).select("allowToSendMsg").lean()
    
    const groups = await Group.find({ members: _id });

    const modifyGroup = groups?.map(
      ({
        _id: groupId,
        name: groupName,
        avatar: groupTheam,
        roomId,
        createdBy: creator,
      }) => ({
        groupId,
        groupName,
        groupTheam,
        roomId,
        creator,
      })
    );
    return res.status(200).json({ success: true, group: modifyGroup , allowToSend:allowToSend?.allowToSendMsg});
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getGroupMessage = async (req, res) => {
  try {
    const { groupId } = req?.params;
    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "group not found", data: [] });
    }

    const messages = await Message.find({ group: groupId }).populate(
      "sender",
      "name avatar"
    );

    return res.status(200).json({ success: true, message: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getMyGroup = async (req, res) => {
  try {
    const userId = req?.user;
    const group = await Group.find({ createdBy: userId })
      .select("name")
      .populate({ path: "course", select: "thumbnail" });

    return res.status(200).json({ success: true, group });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getGroupStudents = async (req, res) => {
  try {
    const { groupId } = req?.params;
    console.log(groupId);
    const students = await Group.find({ _id: groupId }, { members: 1, _id: 0 })
      .populate({ path: "members", select: "name email avatar allowToSendMsg" })
      .select("name emai avatar")
      .lean();

    return res.status(200).json({ success: true, students });
  } catch (error) {}
};
