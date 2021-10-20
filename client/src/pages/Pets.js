import React, { useState, useEffect, Fragment } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PET_FIELDS = `
  id
  name
  type
  img
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ${PET_FIELDS}
    }
  }
`;

const ADD_PET = gql`
  mutation AddPetMutation($input: NewPetInput!) {
    addPet(input: $input) {
      ${PET_FIELDS}
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data: { pets } = {}, loading } = useQuery(ALL_PETS);
  const [addPet, { loading: addPetLoading }] = useMutation(ADD_PET, {
    update(cache, { data: { addPet } }) {
      const { pets } = cache.readQuery({ query: ALL_PETS });
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...pets] },
      });
    },
  });

  const onSubmit = (input) => {
    if (input) addPet({ variables: { input } });
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
      {(loading || addPetLoading) && <Loader />}
      {modal ? Modal : List}
    </Fragment>
  );
}
