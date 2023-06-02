import { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { AuthContext } from '../Context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import FriendRequest from './FriendRequest';
import { ChatContext } from '../Context/ChatContext';
import { NotificationsNone, NotificationsActive, People, Bookmark } from '@mui/icons-material';

function Sidebar() {
  const [opens, setOpens] = useState(true);
  const [openF, setOpenF] = useState(true);
  const [openN, setOpenN] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null); // Track the selected friend

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleFriendRequestProcessed = (requestId) => {
    setFriendRequests((prevState) =>
      prevState.filter((request) => request.id !== requestId)
    );
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        const user = userSnapshot.data();
        const friends = [];

        if (user && user.friends) {
          const friendIds = Object.keys(user.friends);
          for (const friendId of friendIds) {
            const friendRef = doc(db, 'users', friendId);
            const friendSnapshot = await getDoc(friendRef);
            const friend = friendSnapshot.data();
            if (friend) {
              friends.push(friend);
            }
          }
        }

        console.log('Friends:', friends); // Debug statement
        setFriends(friends);
      } catch (error) {
        console.log('Error fetching friends:', error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const friendRequestsRef = collection(db, 'friendRequests');
        const querySnapshot = await getDocs(
          query(friendRequestsRef, where('receiverId', '==', currentUser.uid))
        );
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        console.log('Friend Requests:', requests); // Debug statement
        setFriendRequests(requests);
      } catch (error) {
        console.log('Error fetching friend requests:', error);
      }
    };

    fetchFriends();
    fetchFriendRequests();
  }, [currentUser]);

  const startChatWithFriend = (friend) => {
    // Logic to start a chat with the selected friend
    console.log(`Starting chat with friend ${friend.displayName}`);

    // Dispatch an action to change the user in the chat
    dispatch({ type: 'CHANGE_USER', payload: friend });

    setSelectedFriendId(friend.uid); // Update the selected friend ID

    // Close the Friends tab
    setOpenF(false);
  };

  return (
    <>
      <div className={`sidebar ${opens ? 'open' : ''}`}>
        <Navbar />
        <Search />
        <div className={`tab ${opens ? 'open' : ''}`}>
          <h3 onClick={() => setOpens(!opens)}>
            <Bookmark />
            RECENT CHATS
          </h3>
          {opens && <Chats className="chat-open" selectedFriendId={selectedFriendId} />}
        </div>
        <div className={`tab ${openN ? 'open' : ''}`}>
          <h3 onClick={() => setOpenN(!openN)}>
            {friendRequests.length > 0 ? <NotificationsActive /> : <NotificationsNone />}
            NOTIFICATIONS
          </h3>
          {openF &&
            friendRequests.map((request) => (
              <FriendRequest
                key={request.id}
                request={request.requestId}
                senderDisplayName={request.senderDisplayName}
                senderId={request.senderId}
                receiverId={request.receiverId}
                onFriendRequestProcessed={handleFriendRequestProcessed}
              />
            ))}
        </div>
        <div className={`tab ${openF ? 'open' : ''}`}>
          <h3 onClick={() => setOpenF(!openF)}>
            <People />
            FRIENDS
          </h3>
          {friends.map((friend) => (
            <div
              className={`friend-item ${selectedFriendId === friend.uid ? 'selected' : ''}`} // Highlight the selected friend
              key={friend.uid}
              onClick={() => startChatWithFriend(friend)}
            >
              <img src={friend.photoURL} alt="" />
              <span>{friend.displayName}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`darkboi ${opens ? 'open' : ''}`} onClick={() => setOpens(false)}></div>
    </>
  );
}

export default Sidebar;
