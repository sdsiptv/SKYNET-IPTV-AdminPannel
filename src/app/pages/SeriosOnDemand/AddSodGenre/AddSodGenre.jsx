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
  import React, { useState } from 'react';
  import { Controller, useForm } from 'react-hook-form';
  import { useHistory } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { GREEN, LIGHT_GREY } from 'utils/constant/color';
  import useStyles from './styles';
  
  export default function AddSODGenre() {
    const history = useHistory();
    const classes = useStyles();
    const { register, handleSubmit, control } = useForm();
    const [enabled, setEnabled] = useState(false);
  
    const onSubmit = data => {
      apis.addSodGenres(data.genres_name,data.genres_id).then(res => {
        toast('Successfully added', {
          position: 'top-right',
          autoClose: 2000,
        });
        history.push('/SODGenre');
      });
    };
  
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Add Video SOD Genres
                </Typography>
              </Grid>
  
              <Grid item xs={10}>
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

              <Grid item xs={10}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="genres_id"
                  label="Genres Id"
                  type="number"
                  helperText={"Genres ID will be Number"}
                  id="genres_id"
                  {...register('genres_id', { required: true })}
                />
              </Grid>
  
              {/* <Grid item xs={12}>
                <Controller
                  name="Enable"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        label="Enabled"
                        control={
                          <Checkbox
                            onChange={e => {
                              field.onChange(e);
                            }}
                          />
                        }
                      />
                    );
                  }}
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
                      variant="contained"
                      style={{ backgroundColor: GREEN, width: 200 }}
                      type="submit"
                    >
                      Create
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: LIGHT_GREY, width: 200 }}
                      onClick={() => {
                        history.push('/SODGenres');
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
  