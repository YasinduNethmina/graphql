import { useState } from "react";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
      yearOfPublication
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query GetMovieByName($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

const DisplayData = () => {
  // Movie Search String
  const [movieSearched, setMovieSearched] = useState("");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  // Query Data
  const { data: userData, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);

  // Fetch Searched Movie
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  // Create A User
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name..."
        />
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username..."
        />
        <input
          type="number"
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age..."
        />
        <input
          type="text"
          onChange={(e) => setNationality(e.target.value.toUpperCase())}
          placeholder="Nationality..."
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });
            refetch();
          }}
        >
          Create User
        </button>
      </div>

      {userData &&
        userData.users.map((user) => {
          return (
            <div>
              <h1>Name: {user.name}</h1>
              <h1>Username: {user.username}</h1>
              <h1>Age: {user.age}</h1>
              <h1>Nationality: {user.nationality}</h1>
            </div>
          );
        })}

      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div>
              <h1>Name: {movie.name}</h1>
              <h1>Username: {movie.yearOfPublication}</h1>
            </div>
          );
        })}

      <div>
        <input
          onChange={(e) => setMovieSearched(e.target.value)}
          type="text"
          placeholder="Type a movie name..."
        />
        <button
          onClick={() =>
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            })
          }
        >
          Fetch Data
        </button>

        <div>
          {movieSearchedData && (
            <div>
              <h1>Movie Name: {movieSearchedData.movie.name}</h1>
              <h1>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </h1>
            </div>
          )}
        </div>

        <div>
          {movieError && <h1>There was an error fetching the data.</h1>}
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
