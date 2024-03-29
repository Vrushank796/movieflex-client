import './movieList.css';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, Edit } from '@material-ui/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

type MovieDataProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  runtimeStr: string;
  genres: string;
  genreList: string[];
  contentRating: string;
  imDbRating: string;
  imDbRatingVotes: string;
  plot: string;
  stars: string;
  starList: string[];
}[];

const MovieList = () => {
  //const server_url = 'http://localhost:4000'; //development
  const server_url = process.env.REACT_APP_API_URI; //production
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState<MovieDataProps>([]);

  const getAllMovie = async () => {
    try {
      const url = `${server_url}/get-all-movie`;
      console.log(url);
      const response = await axios.get(url);
      setMovieData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMovie();
  }, [id, server_url]);

  const handleMovieDelete = async (movieId: any) => {
    try {
      const url = `${server_url}/delete-movie/${movieId}`;
      const response = await axios.delete(url);
      if (response.data.status) {
        alert(response.data.msg);
        getAllMovie();
        navigate('/admin/movies');
      } else {
        alert(response.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 110 },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      renderCell: (params: any) => {
        return (
          <div className='movieListItem'>
            <LazyLoadImage
              className='movieListImg'
              src={params.row.image}
              alt=''
              effect='blur'
            />
            {params.row.title}
          </div>
        );
      },
    },
    { field: 'genres', headerName: 'Genres', width: 260 },
    {
      field: 'imDbRating',
      headerName: 'Rating',
      width: 120,
    },
    {
      field: 'stars',
      headerName: 'Stars',
      width: 460,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params: any) => {
        return (
          <>
            <Link to={'/admin/movies/' + params.row.id}>
              <Edit className='movieListEdit' />
            </Link>
            <DeleteOutline
              className='movieListDelete'
              onClick={() => handleMovieDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className='movieList'>
      <div className='movieTitleContainer'>
        <h1>Movies</h1>
        <Link to='/admin/newMovie'>
          <button className='movieAddButton'>Add New Movie</button>
        </Link>
      </div>
      <DataGrid
        rows={movieData!}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        columns={columns}
        pageSize={25}
      />
    </div>
  );
};

export default MovieList;
