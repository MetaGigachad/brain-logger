import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Message } from "../message/Message.js";
import { useDispatch } from "react-redux";
import { fetchLatestBlock, fetchPrevBlock, fetchNextBlock } from "./messagesSlice.js";
import { Loader } from "../loader/Loader.js";

export function Messages() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);


  useEffect(() => {
    dispatch(fetchLatestBlock());
    const interval = setInterval(() => dispatch(fetchNextBlock()), 2000);
    return () => clearInterval(interval);
  }, []);

  if (!messages.loaded) {
    return <div className="loader"></div>;
  }

  return (
    <div className="main__messages main--widget">
      {messages.data
        .map((message, id) => <Message message={message} key={id} />)
        .reverse()}
      {messages.start_id !== 0 && <Loader onEnterViewport={() => dispatch(fetchPrevBlock())} />}
    </div>
  );
}
