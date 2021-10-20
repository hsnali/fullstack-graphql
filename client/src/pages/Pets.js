import React, { useState, useEffect, Fragment } from "react";
import nanoid from "nanoid";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PET_FIELDS = gql`
  fragment PetFields on Pet {
    id
    name
    type
    img
    vaccinated @client
  }
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetFields
    }
  }
  ${PET_FIELDS}
`;

const ADD_PET = gql`
  mutation AddPetMutation($input: NewPetInput!) {
    addPet(input: $input) {
      ...PetFields
    }
  }
  ${PET_FIELDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);

  const { data: { pets } = {}, loading } = useQuery(ALL_PETS);

  const [addPet] = useMutation(ADD_PET, {
    update(cache, { data: { addPet } }) {
      const { pets } = cache.readQuery({ query: ALL_PETS });
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...pets] },
      });
    },
  });

  const onSubmit = (input) => {
    setModal(false);
    if (input) {
      addPet({
        variables: { input },
        optimisticResponse: {
          __typename: "Mutation",
          addPet: {
            __typename: "Pet",
            id: nanoid(),
            ...input,
            img: "https://via.placeholder.com/300",
            vaccinated: true,
          },
        },
      });
    }
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
      {modal ? Modal : List}
    </Fragment>
  );
}
