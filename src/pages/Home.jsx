import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import ProfilePage from '../components/ProfilePage' 
function Home(){
  return (
    <div className="homeContainer">
        <div className="container">
            <Sidebar/>
            <Chat/>
            <ProfilePage/>
        </div>
    </div>
  )
}

export default Home