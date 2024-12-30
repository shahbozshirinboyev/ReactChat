import { useState, useEffect } from "react";
import "./chatList.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  console.log(chats)

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
      try {
        const data = res.data();
        if (!data) {
          setChats([]);
          return;
        }
        
        const items = data.chats || [];
        const promises = items.map(async(item) => {
          try {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data()
            return { ...item, user };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return { ...item, user: null };
          }
        });
        const chatData = await Promise.all(promises)
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      } catch (error) {
        console.error("Error in chat subscription:", error);
        setChats([]);
      }
    });
    
    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const handleSelect = async(chat) => {
    changeChat(chat.chatId, chat.user);
  }

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => {
            setAddMode(!addMode);
          }}
        />
      </div>

      {chats.map((chat) => (
        <div key={chat.chatId} className="item" onClick={()=>{ handleSelect(chat) }}>
          <img src={chat.user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user?.username || "Unknown User"}</span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
