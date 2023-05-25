import { createRoot } from "react-dom/client";
import App from "./App.js";
import { wallet } from "./wallet.js";

const container = document.getElementById("root");
const root = createRoot(container);

window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  root.render(<App isSignedIn={isSignedIn}/>);
};
