import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import '../assets/stylesheets/Search.css';
import Pagination from '../components/Pagination';
import star from '../assets/images/star.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from '../assets/images/nopicture.png';
import 'react-lazy-load-image-component/src/effects/blur.css';

type MovieTableProps = {
  id: string;
  image: string;
  title: string;
  genres: string;
  imDbRating: string;
};

const SearchMovies = () => {
  //const server_url = 'http://localhost:4000'; //development
  const server_url = process.env.REACT_APP_API_URI; //production
  const [searchMovie, setSearchMovie] = useState('');
  const [movies, setMovies] = useState<MovieTableProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);
  const [moviesLength, setMoviesLength] = useState(1);

  useEffect(() => {
    const shuffle = (array: MovieTableProps[]) => {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };
    const getMovies = async () => {
      try {
        const response = await axios.get(`${server_url}/get-movie`);
        const moviesData = shuffle(response.data);
        setMovies(moviesData);
        setMoviesLength(response.data.length);
      } catch (err) {
        console.log(err);
      }
    };
    getMovies();
  }, [server_url]);

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const lastIndex = currentPage * moviesPerPage;
  const firstIndex = lastIndex - moviesPerPage;

  const filterMovies = (title: string) => {
    if (title) {
      setSearchMovie(title);

      const filterMoviesLength = movies.filter((filterCheck) =>
        filterCheck.title.toLowerCase().includes(title.toLowerCase())
      ).length;
      setMoviesLength(filterMoviesLength);
      // console.log('Searching: ' + filterMoviesLength);
    } else {
      setSearchMovie('');
      const filterMoviesLength = movies.filter((filterCheck) =>
        filterCheck.title.toLowerCase().includes(title.toLowerCase())
      ).length;
      setMoviesLength(filterMoviesLength);
      // console.log('No Search:' + filterMoviesLength);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchMovie(e.target.value);
    filterMovies(e.target.value);
  };

  const NoImageFound = (e: any) => {
    e.target.src = 'https://imdb-api.com/images/original/nopicture.jpg';
  };
  return (
    <div>
      <div className='searchDiv'>
        {/* fetch the values of title and task from the props */}

        <input
          type='search'
          placeholder='Search Movie'
          value={searchMovie}
          className='filter_movie'
          onChange={handleChange}
        />
      </div>
      <div className='tableDisplay'>
        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              {/* <th scope='col'>id</th> */}
              <th scope='col'>Movie</th>
              <th scope='col'></th>
              <th scope='col'>Genres</th>
              <th scope='col'>IMDB Ratings</th>
            </tr>
          </thead>
          {movies
            .filter((filterCheck) =>
              filterCheck.title
                .toLowerCase()
                .includes(searchMovie.toLowerCase())
            )
            .slice(firstIndex, lastIndex)
            .map((movie) => (
              <tbody>
                <tr>
                  <NavLink to={`/movie/${movie.id}`}>
                    {/* <th scope='row'>{movie.id}</th> */}
                    <td>
                      <LazyLoadImage
                        className='searchmovieImg'
                        src={movie.image}
                        alt={movie.title}
                        onError={NoImageFound}
                        placeholderSrc={PlaceholderImage}
                        effect='blur'
                      />
                    </td>
                  </NavLink>
                  <td className='tableBody'>
                    <NavLink to={`/movie/${movie.id}`} className='s-movieTitle'>
                      {movie.title}
                    </NavLink>
                  </td>

                  <td className='tableBody'>{movie.genres}</td>
                  <td className='tableBody'>
                    <LazyLoadImage
                      src={star}
                      alt='Not available'
                      className='star-img'
                    />
                    {movie?.imDbRating != null ? (
                      <span>{movie?.imDbRating}/10</span>
                    ) : (
                      '-/10'
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
        </table>

        <Pagination
          moviesPerPage={moviesPerPage}
          totalMovies={moviesLength}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default SearchMovies;
