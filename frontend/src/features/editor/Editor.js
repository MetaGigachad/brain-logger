import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addMessage, confirmMessage } from "../messages/messagesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { wallet, contractId } from "../../wallet.js";

export function Editor() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  let sendMessage = async function sendMessage() {
    if (inputRef.current.innerText.length === 0) {
      return;
    }
    const text = inputRef.current.innerText;
    inputRef.current.innerText = "";
    const id = nanoid();
    dispatch(
      addMessage({
        sender: wallet.accountId,
        timestamp: new Date().getTime(),
        text,
        sending: true,
        id,
      })
    );
    await wallet.callMethod({
      contractId: contractId,
      method: "push_message",
      args: { text },
    });
    dispatch(confirmMessage({ id }));
  };

  return (
    <div className="main__editor main--widget">
      <div
        className="editor__text-input main--box"
        contentEditable="plaintext-only"
        ref={inputRef}
      ></div>
      <button className="editor__send-button main--box" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
