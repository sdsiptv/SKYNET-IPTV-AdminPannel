import { Button, Container, CssBaseline, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import apis from 'app/api';
import MaterialTables from 'app/components/MaterialTables';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GREEN } from 'utils/constant/color';
import { toastMessage } from 'utils/helper';
import useStyles from 'styles/globalStyles';

export default function VODGenre() {
  const classes = useStyles();
  const history = useHistory();
  const [VODCategory, setVODCategory] = useState([]);

  const columns = [
    { field: 'genres_name', title: 'Name' },
    { field: 'genres_id', title: 'Genres ID' },
    // { field: 'position', title: 'Position' },
    {
      field: 'createdAt',
      title: 'Created At',
      render: rowData => moment(rowData.createdAt).format('YYYY-MM-DD HH:MM'),
    },
    // { field: 'enabled', title: 'Enabled' },
    {
      field: 'actions',
      title: 'Actions',
      sorting: false,
      render: rowData => (
        <Tooltip title="Edit">
          <IconButton
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              history.push('EditVODGenre', {
                state: { data: rowData },
              });
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const getVodGenres = () => {
    apis.getVodGenres().then(res => {
      setVODCategory(res?.data);
    });
  };

  useEffect(() => {
    getVodGenres();
  }, []);

  const deleteHandler = data => {
    let filter = data.map(obj => obj.genres_id);
    apis.deleteVodGenres(JSON.stringify(filter)).then(res => {
      toastMessage('Successfully Deleted');
      getVodGenres();
    });
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Grid container spacing={1} alignItems="flex-end"></Grid>
          </Grid>
          <Grid item xs={3}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: GREEN }}
                onClick={() => {
                  history.push('/AddVODGenre');
                }}
              >
                Add Genres
              </Button>
            </div>
          </Grid>

          <Grid item xs={12}>
            <MaterialTables
              title={'VOD Genres'}
              columns={columns}
              data={VODCategory}
              deleteHandler={deleteHandler}
            />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
