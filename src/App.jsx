import { useState } from "react";
import axios from "axios";
import "./App.css";

const config = {
  headers: {
    "x-api-key": import.meta.env.VITE_API,
    "Content-Type": "application/json",
  },
};

function App() {
  const [count, setCount] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    const responde1 = {
      role: "user",
      content: message,
    };
    setCount([...count, responde1]);
    const data = {
      sourceId: import.meta.env.VITE_SRC,
      messages: [
        ...count,
        {
          role: "user",
          content: message,
        },
      ],
    };
    axios
      .post("https://api.chatpdf.com/v1/chats/message", data, config)
      .then((response) => {
        console.log(response.data);
        const responde = {
          role: "assistant",
          content: response.data.content,
        };
        setCount([...count, responde1, responde]);
      })
      .catch((error) => {
        console.log(error);
        const responde = {
          role: "assistant",
          content:
            "Ocurrio un error al obtener una respuesta, vuelva a intentar",
        };
        setCount([...count, responde]);
      });
  };

  return (
    <>
      <div className="container_MSG">
        {count.map((item, index) => {
          return (
            <div className={item.role} key={index}>
              <div className="msg-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.content.replace(/\n/g, "<br />"),
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>send</button>
      </form>
    </>
  );
}

export default App;
