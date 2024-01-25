import React, { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

//On definit une variable globale
const confirmAction = {
  //la prop current permet de pouvoir redéfinir la fonction quand on veut !
  current: () => Promise.resolve(true), //initialisation avec une promesse résolue (c'est juste pour dire que la fonction est du style à renvoyer une promesse)
};

export const confirmAlert = (props) => {
  return confirmAction.current(props);
};

const ConfirmGlobal = ({ isPopUp = false }) => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState({});
  const resolveRef = useRef(() => {});
  //Quand le composant ConfirmGlobal est monté on redéfinit la fonction confirmAction
  confirmAction.current = (props) =>
    new Promise((resolve) => {
      setProps(props); //la fonction passe les props de confirmAlert à ConfirmGlobal qui va les passer à ConfirmDialog
      setOpen(true); //la fonction ouvre la boite de dialogue
      resolveRef.current = resolve; //permet de sortir resolve du contexte de la fonction et pouvoir la passer à ConfirmDialog
    });

  return (
    open && (
      <ConfirmDialog
        onConfirm={() => {
          resolveRef.current(true); //on execute resolve(true) ( on va donc avoir confirmAlert(props) = true )
          setOpen(false);
        }}
        onCancel={() => {
          resolveRef.current(false); //on execute resolve(false)) ( on va donc avoir confirmAlert(props) = false )
          setOpen(false);
        }}
        open={open}
        {...props}
        isPopUp={isPopUp}
      />
    )
  );
};

export default ConfirmGlobal;
