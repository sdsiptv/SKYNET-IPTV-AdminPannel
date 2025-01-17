import {
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
  } from '@material-ui/core';
  import apis from 'app/api';
  import React, { useEffect } from 'react';
  import { Controller, useForm } from 'react-hook-form';
  import { useHistory, useLocation } from 'react-router-dom';
  import { GREEN, LIGHT_GREY } from 'utils/constant/color';
  import { toastMessage } from 'utils/helper';
  import useStyles from './styles';
  
  export default function EditVODGenre() {
    const history = useHistory();
    const classes = useStyles();
    const location = useLocation();
    const { register, handleSubmit, control, setValue, getValues, watch } =
      useForm();
  
    const onSubmit = data => {
      apis.editVodGenres(data.genres_id, data.genres_name).then(res => {
        toastMessage('Successfully Deleted');
        history.push('/VODGenre');
      });
    };
  
    useEffect(() => {
      if (location.state) {
        let params = location.state.state.data;
        setValue('genres_name', params.genres_name);
        setValue('genres_id', params.genres_id);
        console.log('idd',params.genres_id)
      }
    }, []);
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Update Video Genres
                </Typography>
              </Grid>
  
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  id="name"
                  {...register('genres_name', { required: true })}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="position"
                  label="Position"
                  type="number"
                  id="position"
                  {...register('position', { required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Enabled"
                      control={
                        <Checkbox
                          checked={watch('enabled') === 1}
                          onChange={e => {
                            field.onChange(e);
                            setValue('enabled', Number(getValues('enabled')));
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}
  
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
                      variant="contained"
                      style={{ backgroundColor: GREEN, width: 200 }}
                    >
                      Update
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: LIGHT_GREY, width: 200 }}
                      onClick={() => {
                        history.push('/VODGenre');
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
  