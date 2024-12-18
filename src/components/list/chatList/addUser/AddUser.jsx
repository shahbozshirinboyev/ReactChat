import "./addUser.css";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore"

function AddUser() {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUser(userData);
      } else {
        alert("User not found");
        setUser(null);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      alert("Error searching for user. Please try again.");
      setUser(null);
    }
  };
  const handleAdd = async () => {
    if (user.id === currentUser.id) {
      alert("You cannot add yourself!");
      return;
    }

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Check if chat already exists
      const currentUserDoc = await getDoc(doc(userChatsRef, currentUser.id));
      if (currentUserDoc.exists()) {
        const existingChats = currentUserDoc.data().chats || [];
        const chatExists = existingChats.some(chat => chat.receiverId === user.id);
        
        if (chatExists) {
          alert("Chat already exists with this user!");
          return;
        }
      }

      // Create new chat
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Create or update userchats for both users
      const userChatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        updatedAt: Date.now()
      };

      // Update current user's chats
      const currentUserChatRef = doc(userChatsRef, currentUser.id);
      const currentUserChatDoc = await getDoc(currentUserChatRef);
      
      if (!currentUserChatDoc.exists()) {
        await setDoc(currentUserChatRef, { chats: [{ ...userChatData, receiverId: user.id }] });
      } else {
        await updateDoc(currentUserChatRef, {
          chats: arrayUnion({ ...userChatData, receiverId: user.id })
        });
      }

      // Update other user's chats
      const otherUserChatRef = doc(userChatsRef, user.id);
      const otherUserChatDoc = await getDoc(otherUserChatRef);
      
      if (!otherUserChatDoc.exists()) {
        await setDoc(otherUserChatRef, { chats: [{ ...userChatData, receiverId: currentUser.id }] });
      } else {
        await updateDoc(otherUserChatRef, {
          chats: arrayUnion({ ...userChatData, receiverId: currentUser.id })
        });
      }

      alert("User added successfully!");
      setUser(null);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;