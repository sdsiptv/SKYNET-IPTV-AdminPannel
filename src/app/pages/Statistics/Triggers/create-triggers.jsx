import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { GREEN } from 'utils/constant/color';
import useStyles from './styles';
import { useForm } from 'react-hook-form';
import apis from 'app/api';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';

export default function CreateTriggers() {
  const history = useHistory();
  const classes = useStyles();
  const { handleSubmit } = useForm();

  const [customerData, setCustomerData] = useState([]);
  const [type] = useState([
    { id: 'forceLogout', name: 'Force Logout' },
    { id: 'blacklist', name: 'Black List' },
  ]);
  const [selectedType, setSelectedType] = useState('');

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    handleGetCustomer();
  }, []);

  const handleGetCustomer = () => {
    apis.getCustomerUser().then(res => {
      setCustomerData(res.data);
    });
  };

  const onSubmit = () => {
    apis
      .postTriggerList({
        userId: userId,
        type: selectedType,
      })
      .then(res => {
        toast('Successfully added', {
          position: 'top-right',
          autoClose: 2000,
        });
        history.push('/Triggers');
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
                Create Triggers
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} maxwidth="xs">
                <Grid item xs={6}>
                  <Autocomplete
                    id="Customer"
                    options={customerData}
                    getOptionLabel={option => option?.id + ' - ' + option?.name}
                    onChange={(event, newValue) => {
                      setUserId(newValue.id);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Customer"
                        variant="outlined"
                        helperText="Please select your Customer"
                        required
                        autoFocus
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} maxwidth="xs">
                <Grid item xs={6}>
                  <Autocomplete
                    id="Type"
                    options={type}
                    getOptionLabel={option => option?.name}
                    onChange={(event, newValue) => {
                      setSelectedType(newValue.id);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Trigger Type"
                        variant="outlined"
                        helperText="Please select trigger type"
                        required
                        autoFocus
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} maxwidth="xs">
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: GREEN }}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </form>
    </Container>
  );
}
