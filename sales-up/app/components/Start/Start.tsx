import React from "react";
import style from "./style.module.scss";
import { useRouter } from "next/navigation";

const Start = ({ onStart }: { onStart: () => void }) => {
  const router = useRouter();

  return (
    <div className={style.container}>
      <h1 className={style.title}>Sales Up!</h1>
      <button
        className={style.btn}
        onClick={() => {
          onStart();
          router.push("/game");
        }}
      >
        Start Game
      </button>
    </div>
  );
};

export default Start;
