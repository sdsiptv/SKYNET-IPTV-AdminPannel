import React, { useEffect, useState } from 'react';
import {
    Grid,
    Button,
    CssBaseline,
    Container,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { GREEN } from 'utils/constant/color';
import apis from 'app/api';
import MaterialTables from 'app/components/MaterialTables';
import { failureNotification, toastMessage } from 'utils/helper';
import EditIcon from '@material-ui/icons/Edit';

import useStyles from 'styles/globalStyles';

export default function ListKeyRotation() {
    const classes = useStyles();
    const history = useHistory();
    const [OTTCategory, setOTTCategory] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    const columns = [
        { field: 'key', title: 'Key' },
        {
            field: 'actions',
            title: 'Actions',
            sorting: false,
            render: rowData => (
                <Tooltip title="Edit">
                    <IconButton
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => {
                            setIsEditMode(true);
                            history.push('EditKeyRotation', {
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

    const getTuneVersion = () => {
        apis
            .getKeyRotation()
            .then(res => {
                setOTTCategory(res?.data);
            })
            .catch(() => {
                failureNotification('Network error');
            });
    };

    useEffect(() => {
        getTuneVersion();
    }, []);

    // const deleteHandler = data => {
    //     let filter = data.map(obj => obj.id);
    //     if (filter.length > 0) {
    //         apis.deleteTuneVersion(filter).then(res => {
    //             toastMessage('Successfully Deleted');
    //             getwebURL();
    //         });
    //     }
    // };

     const deleteHandler = data => {
        let filter = data.map(obj => obj.id);
        apis.deleteKeyRotation(JSON.stringify(filter)).then(res => {
            toastMessage('Successfully Deleted');
            getTuneVersion();
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
                            {(!isEditMode && OTTCategory.length === 0) && (
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: GREEN }}
                                    onClick={() => {
                                        history.push('/AddKeyRotation');
                                    }}
                                >
                                    Add Key Rotation
                                </Button>
                            )}
                        </div>
                    </Grid>


                    <Grid item xs={12}>
                        <MaterialTables
                            title={'Key Rotation'}
                            columns={columns}
                            data={OTTCategory}
                            deleteHandler={deleteHandler}
                        />
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}
