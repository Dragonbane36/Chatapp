useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, 'chats'),
          where(`users.${currentUser.uid}.unread`, '==', true)
        );
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((doc) => {
          notifications.push(doc.data());
        });
        console.log('Notifications:', notifications); // Debug statement
        setNotifications(notifications);
      } catch (error) {
        console.log('Error fetching notifications:', error);
      }
    };

    {friendRequests.length > 0 ? <NotificationsActive /> : <NotificationsNone />}