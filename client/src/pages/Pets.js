import React, { useState, Fragment } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const GET_PETS = gql`
  query GetPets {
    pets {
      name
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data: { pets } = {}, loading } = useQuery(GET_PETS);
  const onSubmit = (input) => {
    setModal(false);
  };

  const Modal = (
    <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  );

  const List = (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={pets} />
      </section>
    </div>
  );

  return (
    <Fragment>
      {loading && <Loader />}
      {modal && Modal}
      {!modal && List}
    </Fragment>
  );
}
