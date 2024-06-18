import {
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Chip
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import apis from 'app/api';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { GREEN, LIGHT_GREY } from 'utils/constant/color';
import { failureNotification, toastMessage } from 'utils/helper';
import { encrypt } from 'utils/helper/cryptography.js';
import useStyles from './styles';

export default function AddVODMedia() {
  const hiddenFileInput = React.useRef(null);
  const history = useHistory();
  const classes = useStyles();
  const [imageObj, setImageObj] = useState(undefined);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [vodCategories, setVodCategories] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [title, setTitle] = useState();
  const [titleId, setTitleId] = useState();
  const [inputTitle, setInputTitle] = useState();
  const { register, handleSubmit, control, getValues, setValue } = useForm();
  const [provider, setProvider] = useState('');
  const [vodProvider, setVodProvider] = useState([]);
  const [isTmdbChecked, setIsTmdbChecked] = useState(true);
  const [tmdbId, setTmdbId] = useState('');
  const [showInputTitle, setShowInputTitle] = useState(false);
  const [imageUrls, setImageUrl] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [tmdbPosterPath, setTmdbPosterPath] = useState('');
  const [imageKey, setImageKey] = useState(0);

  const [vodLanguage, setVodLanguage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);

  const [GenresData, setGenresData] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  useEffect(() => {
    apis.getVodLanguage().then(res => {
      setVodLanguage(res.data);
    });
  }, []);

  const handleGenresChange = (event) => {
    setSelectedGenres(event.target.value);
  };

  useEffect(() => {
    apis.getVodGenres().then(res => {
      setGenresData(res.data);
      console.log('hello', res.data)
    });
  }, []);

  const handleImageChange = (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded && fileUploaded.name === imageObj?.name) {
      setImageKey((prevKey) => prevKey + 1);
    } else {
      setImageObj(fileUploaded);
    }
    console.log('setImageObj', fileUploaded);
  };

  const onSubmit = () => {
    setIsSubmitting(true);

    let data = new FormData();
    const finalTitle = isTmdbChecked ? title : getValues('Title');
    const finalTitleId = isTmdbChecked ? titleId : getValues('MovTitle');
    data.append('title', finalTitle);
    data.append('movtitle', finalTitleId);
    data.append('tmdb_id', getValues('TmdbId'));
    data.append('category_id', category);
    data.append('provider_id', provider);
    data.append('country', getValues('Country'));
    data.append('director', getValues('Director'));
    data.append('actors', getValues('Actors'));
    data.append('trailer', getValues('Trailer'));
    data.append('duration', getValues('Duration'));
    data.append('year', getValues('Year'));
    data.append('rating', getValues('Rating'));
    data.append('language', selectedLanguage);
    data.append('genres', isTmdbChecked ? getValues('Genres') : selectedGenres);
    data.append('tmdb_rating', getValues('TmdbRating'));
    data.append('releaseDate', getValues('ReleaseDate'));
    data.append('description', getValues('Description'));
    data.append('comments', getValues('Comment'));
    data.append('enabled', getValues('enabled') ? getValues('enabled') : 0);
    data.append(
      'video_music',
      getValues('videoMusic') ? getValues('videoMusic') : 0,
    );
    data.append('image', isChecked ? null : imageObj ? imageObj : '');

    data.append('url', encrypt(getValues('urlLink')));
    data.append('image_url', imageUrls != "" ? imageUrls : '');

    apis.addVodMedia(data)
      .then(data => {
        toastMessage('Successfully added');
        history.push('/VODMedia');
      })
      .catch(error => {
        setIsSubmitting(false);

        if (error.response && error.response.status) {
          const statusCode = error.response.status;
          if (statusCode === 409) {
            failureNotification('Resource Already Exists');
          } else if (statusCode === 500) {
            failureNotification('Internal server error');
          } else {
            failureNotification(`An error occurred with status code: ${statusCode}`);
          }
        } else {
          console.error('API Error:', error);
          toastMessage('An error occurred while making the API request');
        }
      });
  }

  useEffect(() => {
    apis.getVodCategory().then(res => {
      setVodCategories(res.data);
    });
  }, []);


  const getVodProvider = () => {
    apis.getVodProviders().then(res => {
      setVodProvider(res?.data);
    });
  };

  useEffect(() => {
    getVodProvider();
  }, []);



  const handleGetMovieDetails = id => {
    if (!id) {
      setValue('TmdbId', '');
      setValue('MovTitle', '');
      setIsChecked(false);
      setValue('Trailer', '');
      setValue('Actors', '');
      setValue('Director', '');
      setValue('Description', '');
      setValue('ReleaseDate', '');
      setValue('Language', '');
      setValue('Genres', '');
      setValue('Duration', '');
      setValue('Comment', '');
      setValue('Rating', '');
      setValue('TmdbRating', '');
      setValue('Country', '');
      setValue('Year', '');
      setValue('urlLink', '');
      return;
    }
    if (isTmdbChecked) {
      apis.getTMDBMovieData(id).then(res => {
        let info = res;
        let cast = [];
        let director = info.credits.crew.find(({ job }) => job === 'Director');
        for (var i = 0; i <= 2; i++) {
          cast.push(info.credits.cast[i].name);
        }
        let temp = cast.toString();
        setValue('Actors', temp);
        let genre_info = [];
        for (var j = 0; j < info.genres.length; j++) {
          genre_info.push(info.genres[j].id);
          console.log('genres', genre_info)
        }

        console.log('eeeecast11:', temp);
        console.log('eeeecasttostring:', cast.toString());
        console.log('eeeecast:', setValue('Actors', temp));

        setTmdbPosterPath(info.poster_path);

        console.log("1");
        setTitle(info.title)
        setValue('Title', info.title);
        setValue('image_url', info.poster_path)
        setValue('TmdbId', info.id)
        setValue('Director', director?.name);
        setValue('Description', info.overview);
        setValue('ReleaseDate', info.release_date);
        setValue('Language', info.spoken_languages[0]?.english_name);
        setValue('Genres', genre_info);
        setValue('Duration', info.runtime);
        setValue('Rating', info.vote_average);
        setValue('TmdbRating', info.popularity);
        setValue('Country', info.production_countries[0]?.name);
        setValue(
          'Year',
          info?.release_date ? new Date(info?.release_date).getFullYear() : '',
        );
      });
    } else {
      const director = getValues('Director');
      const info = {
        overview: getValues('Description'),
      };
      const release_date = getValues('ReleaseDate');
      const duration = getValues('Duration');
      const rating = getValues('Rating');
      const tmdbrating = getValues('TmdbRating');
      const country = getValues('Country');
      const year = getValues('Year');
      const urlImage = getValues('urlImage');
      const language = getValues('language');

      setValue('Director', director);
      setValue('Description', info.overview);
      setValue('ReleaseDate', release_date);
      setValue('Duration', duration);
      setValue('Rating', rating);
      setValue('TmdbRating', tmdbrating);
      setValue('Country', country);
      setValue('Year', year);
      setValue('urlImage', urlImage);
      setValue('language', language);
    }
  };

  const handleGetMovieIdDetails = id => {
    if (!id) {
      setValue('Actors', '');
      setValue('Director', '');
      setValue('Description', '');
      setValue('ReleaseDate', '');
      setValue('Duration', '');
      setValue('Genres', '');
      setValue('Rating', '');
      setValue('TmdbRating', '');
      setValue('Country', '');
      setValue('Year', '');
      return;
    }

    if (isTmdbChecked) {

      apis.getTMDBMovieId(id)
        .then(res => {
          if (res.status === 404) {
            console.error('Movie not found');
            setValue("")
          } else {
            let info = res;
            let cast = [];
            let director = info.credits.crew.find(({ job }) => job === 'Director');
            for (var i = 0; i <= 2; i++) {
              cast.push(info.credits.cast[i].name);
            }
            let temp = cast.toString();
            setValue('Actors', temp);
            let genre_info = [];
            for (var j = 0; j < info.genres.length; j++) {
              genre_info.push(info.genres[j].id);
              console.log('genresid', genre_info)
            }
            setTmdbPosterPath(info.poster_path);

            setShowInputTitle(true);
            console.log('hiiiiiii', info.title);
            setTitle(info.title)
            console.log("3");
            setInputTitle(info.title);
            setTitle(info.title)
            setShowInputTitle(true);
            setValue('MovTitle', info.title);
            setValue('TmdbId', info.id);
            setValue('Director', director?.name);
            setValue('Description', info.overview);
            setValue('ReleaseDate', info.release_date);
            setValue('Language', info.original_language);
            setValue('Genres', genre_info);
            setValue('Duration', info.runtime);
            setValue('Rating', info.vote_average);
            setValue('TmdbRating', info.popularity);
            setValue('Country', info.production_countries[0]?.name);
            setValue(
              'Year',
              info?.release_date ? new Date(info?.release_date).getFullYear() : '',
            );
          }
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    } else {
      const director = getValues('Director');
      const title = getValues('Title')
      const info = {
        overview: getValues('Description'),
      };
      const release_date = getValues('ReleaseDate');
      const duration = getValues('Duration');
      const rating = getValues('Rating');
      const tmdbrating = getValues('TmdbRating');
      const country = getValues('Country');
      const year = getValues('Year');
      const language = getValues('language');
      console.log("4");
      setValue('Title', title)
      setValue('Director', director);
      setValue('Description', info.overview);
      setValue('ReleaseDate', release_date);
      setValue('Duration', duration);
      setValue('Rating', rating);
      setValue('TmdbRating', tmdbrating);
      setValue('Country', country);
      setValue('Year', year);
      setValue('language', language);

    }
  };

  const handleTmdbIdChange = (event) => {
    setTmdbId(event.target.value);
  };

  const handleGetMovie = query => {
    apis.getTMDBSearch(query).then(res => {
      let result = res?.results;
      let dataList = result?.map(value => {
        return {
          value: value.title,
          id: value.id,
        };
      });
      setMovieList(dataList);
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (!e.target.checked) {
      setImageUrl('');
      setImage('');
      setImageObj(null);
      hiddenFileInput.current.value = '';
    } else {
      const fullImageUrl = "https://image.tmdb.org/t/p/w500/" + tmdbPosterPath;
      setImageUrl(fullImageUrl);
      console.log('seee', fullImageUrl) // Automatically fill the URL with the poster_path
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5" className={classes.title}>
                Add Video on Demand
              </Typography>
            </Grid>

            <Grid item xs={6}>
              {isTmdbChecked ? (
                <Autocomplete
                  value={title}
                  options={movieList}
                  getOptionLabel={(option) => option.value}
                  onChange={(event, newValue) => {
                    setTitle(newValue?.value);
                    setTmdbId(newValue?.id);
                    handleGetMovieDetails(newValue?.id);
                  }}
                  inputValue={inputTitle}
                  onInputChange={(event, newInputTitle) => {
                    setInputTitle(newInputTitle);
                    if (newInputTitle?.length > 0) {
                      handleGetMovie(newInputTitle);
                    }
                  }}
                  id="Title"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Title"
                      variant="outlined"
                      placeholder="Title"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              ) : (
                <TextField
                variant="outlined"
                required
                fullWidth
                name="title"
                label="Title"
                type="text"
                InputLabelProps={{ shrink: true }}
                id="title"
                {...register('Title', { required: true })}
              />
              )}
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="videoMusic"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      label="VideoMusic"
                      control={
                        <Checkbox
                          onChange={e => {
                            field.onChange(e);

                            setValue(
                              'videoMusic',
                              Number(getValues('videoMusic')),
                            );
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      label="Enabled"
                      control={
                        <Checkbox
                          onChange={e => {
                            field.onChange(e);
                            setValue('enabled', Number(getValues('enabled')));
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="Movies"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      label="Movies"
                      control={
                        <Checkbox
                          checked={isTmdbChecked}
                          onChange={e => {
                            setIsTmdbChecked(e.target.checked);
                            field.onChange(e.target.checked);
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              {isTmdbChecked ? (
                <div style={{ display: "flex" }}>
                  <Grid item xs={8}>
                    {/* Input for tmdbId */}
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="tmdbId"
                      label="tmdb id"
                      type="number"
                      helperText={"TMDB ID will be Number"}
                      InputLabelProps={{ shrink: true }}
                      id="tmdbId"
                      {...register('TmdbId', { required: true })}
                      value={tmdbId}
                      onChange={handleTmdbIdChange}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {/* Button to get movie details */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleGetMovieIdDetails(tmdbId)}
                      style={{ marginTop: "8px", marginLeft: "5px" }}
                    >
                      Get
                    </Button>
                  </Grid>

                </div>
              ) : (
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="tmdbId"
                  label="tmdb id"
                  type="number"
                  helperText={"TMDB ID will be Number"}
                  InputLabelProps={{ shrink: true }}
                  id="tmdbId"
                  {...register('TmdbId', { required: true })}
                />
              )}

            </Grid>

            <Grid item xs={6}>
              <div>
                {showInputTitle && (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="Tmdb title"
                    label="Tmdb Title"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    id="title"
                    {...register('MovTitle', { required: true })}
                    disabled
                  />
                )}
              </div>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                select
                name="category"
                label="Category"
                type="text"
                id="category"
                onChange={e => {
                  setCategory(e.target.value);
                }}
              >
                {vodCategories.map(ele => (
                  <MenuItem key={ele.categoryId} value={ele.categoryId}>
                    {ele.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                select
                name="providers"
                label="Providers"
                type="text"
                id="providers"
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  setProvider(e.target.value);
                }}
              >
                {vodProvider.map(ele => (
                  <MenuItem key={ele.sno} value={ele.sno}>
                    {ele.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                label="Country"
                type="text"
                id="country"
                {...register('Country', { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="director"
                label="Director"
                type="text"
                InputLabelProps={{ shrink: true }}
                id="director"
                {...register('Director', { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                key="actors"
                name="actors"
                InputLabelProps={{ shrink: true }}
                label="Actors"
                type="text"
                {...register('Actors', { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  multiple
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip key={value} label={vodLanguage.find((language) => language.language_id === value).name} />
                      ))}
                    </div>
                  )}
                >
                  {vodLanguage.map(ele => (
                    <MenuItem key={ele.language_id} value={ele.language_id}>
                      <Checkbox checked={selectedLanguage.includes(ele.language_id)} />
                      {ele.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              {isTmdbChecked ? (
                <Grid item >
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="Genres"
                    label="Genres"
                    type="text"
                    id="Genres"
                    InputLabelProps={{ shrink: true }}
                    {...register('Genres', { required: true })}
                  />
                </Grid>
              ) : (
                <Grid item >
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Genres</InputLabel>
                    <Select
                      multiple
                      value={selectedGenres}
                      onChange={handleGenresChange}
                      renderValue={(selectedGenre) => (
                        <div>
                          {selectedGenre.map((values) => (
                            <Chip key={values} label={GenresData.find((genres) => genres.genres_id === values).genres_name} />
                          ))}
                        </div>
                      )}
                    >
                      {GenresData.map(index => (
                        <MenuItem key={index.genres_id} value={index.genres_id}>
                          <Checkbox checked={selectedGenres.includes(index.genres_id)} />
                          {index.genres_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="trailer"
                label="Trailer"
                type="text"
                id="trailer"
                InputLabelProps={{ shrink: true }}
                {...register('Trailer', { required: true })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="duration"
                label="Duration in Mintues"
                type="number"
                helperText={"Duraition will be Minutes"}
                id="duration"
                InputLabelProps={{ shrink: true }}
                {...register('Duration', { required: true })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="year"
                label="Year"
                InputLabelProps={{ shrink: true }}
                type="number"
                helperText={"Year will be Number"}
                id="year"
                {...register('Year', { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="rating"
                label="Rating"
                type="text"
                helperText={"Rating will be Number"}
                id="rating"
                InputLabelProps={{ shrink: true }}
                {...register('Rating', { required: true })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="tmdbRating"
                label="tmdb Rating"
                type="text"
                helperText={"TMDB Rating will be Number"}
                id="tmdbRating"
                InputLabelProps={{ shrink: true }}
                {...register('TmdbRating', { required: true })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="releaseDate"
                label="Release Date"
                placeholder="Date in YYYYMMDD Format"
                type="text"
                helperText={"Use Format YYYY-MM-DD"}
                InputLabelProps={{ shrink: true }}
                id="releaseDate"
                {...register('ReleaseDate', { required: true })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="description"
                label="Description"
                type="text"
                InputLabelProps={{ shrink: true }}
                id="description"
                {...register('Description', { required: true })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="comment"
                label="Comment"
                type="text"
                InputLabelProps={{ shrink: true }}
                id="comment"
                {...register('Comment', { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <div style={{ display: 'flex' }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={hiddenFileInput}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  id="contained-button-file"
                  disabled={isChecked} 
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    htmlFor="contained-button-file"
                    disabled={isChecked} 
                  >
                    Add LOGO
                  </Button>
                </label>
                {imageObj && !isChecked && (
                  <div key={imageKey}>
                    <img
                      src={
                        typeof imageObj === 'object'
                          ? URL.createObjectURL(imageObj)
                          : image
                      }
                      alt=""
                      style={{ paddingLeft: '10px', width: '100px' }}
                    />
                  </div>
                )}
              </div>
            </Grid>

            <Grid item xs={12}>
              <Grid item xs={6}>
                <div>
                  <div>
                    <label>
                      <Checkbox
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      Image URL
                    </label>
                  </div>
                  {isChecked && (
                    <div style={{ display: 'flex' }}>
                      <div>

                        <TextField
                          name="urlImage"
                          label="Image URL"
                          type="text"
                          variant="outlined"
                          id='urlImage'
                          value={imageUrls}
                          {...register('urlImage')}
                          disabled
                        />
                      </div>
                      {imageUrls && (
                        <div>
                          <img
                            src={imageUrls}
                            alt="Preview"
                            style={{ paddingLeft: '10px', width: '100px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography component="h6" variant="h6" style={{ fontSize: 15 }}>
                Select a way
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="url"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      label="URL"
                      control={
                        <Checkbox
                          checked={true}
                          onChange={e => {
                            field.onChange(e);
                            setValue('url', Number(getValues('url')));
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="localfile"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      label="Local File"
                      control={
                        <Checkbox
                          checked={false}
                          onChange={e => {
                            field.onChange(e);
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <div>
                {/* <TextField
                  name="urltitle"
                  label="Title"
                  variant="outlined"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  {...register('urlTitle')}
                /> */}
                <TextField
                  name="urlLink"
                  label="URL"
                  variant="outlined"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  {...register('urlLink')}
                  style={{ width: 700, marginRight: 10 }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <Button
                required
                fullWidth
                style={{ backgroundColor: 'white', height: 100 }}
              >
                Drop a video or Click
              </Button>
            </Grid>

            <Grid item xs={12}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <div>
                  <Button
                    type="submit"
                    required
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: GREEN, width: 200 }}
                    // Disable the button when isSubmitting is true
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </Button>
                </div>
                <div>
                  <Button
                    required
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: LIGHT_GREY.length, width: 200 }}
                    onClick={() => {
                      history.push('/VODMedia');
                    }}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </form>
    </Container>
  );
}
