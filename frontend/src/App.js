// import "regenerator-runtime/runtime";
import "../assets/global.css";
import { Header } from "./features/header/Header.js";
import { Editor } from "./features/editor/Editor.js";
import { Messages } from "./features/messages/Messages.js";
import { Provider } from "react-redux";
import store from "./store.js";

export default function App({ isSignedIn }) {
  return (
    <Provider store={store}>
      <div className="container">
        <Header isSignedIn={isSignedIn} />
        <main>
          <Editor />
          <Messages />
        </main>
      </div>
    </Provider>
  );
}
