import { CreateLobby } from "../components/CreateLobby";
import { JoinLobby } from "../components/JoinLobby";

import "../styles/HomePage.css";


export default function HomePage() {


  return (
    <>
      <section id="center">
        <div className="hero">
          <h1>Yahtzee</h1>
        </div>
        <div className="button-container">
            <CreateLobby />
            <JoinLobby />
        </div>
      </section>
      <section id="spacer"></section>
    </>
  )
}