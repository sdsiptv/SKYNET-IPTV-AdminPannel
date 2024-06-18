import {
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@material-ui/core';
import apis from 'app/api';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import useStyles from 'styles/globalStyles';
import { GREEN, LIGHT_GREY } from 'utils/constant/color';
import { failureNotification, toastMessage } from 'utils/helper';

export default function ServerConfig() {
    const history = useHistory();
    const classes = useStyles();
    const [selectedOption, setSelectedOption] = React.useState("primary");

    const primaryDatabaseServer = "https://192.168.1.11/";
    const backupDatabaseServer = "http://127.0.0.1/";

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const { register, handleSubmit } = useForm({
        defaultValues: { enabled: false },
    });

    const onSubmit = (data) => {
        const selectedServerUrl = selectedOption === "primary" ? primaryDatabaseServer : backupDatabaseServer;
        const payload = {
            server_url: selectedServerUrl
        };

        apis
            .addUpdateDomine(payload.server_url)
            .then(res => {
                toastMessage('Successfully added');
                history.push('/');
            })
            .catch(err => {
                console.log('Error', err);
                failureNotification('Network error');
            });
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" className={classes.title}>
                                Server Config
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="primarydatabaseserver"
                                label="Primary DataBase Server"
                                type="text"
                                id="primarydatabaseserver"
                                value={primaryDatabaseServer}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="backupdatabaseserver"
                                label="Backup DataBase Server"
                                type="text"
                                id="backupdatabaseserver"
                                value={backupDatabaseServer}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Types</Typography>
                            <RadioGroup value={selectedOption} onChange={handleRadioChange} row>
                                <FormControlLabel
                                    value="primary"
                                    control={<Radio />}
                                    label="Use Primary"
                                />
                                <FormControlLabel
                                    value="backup"
                                    control={<Radio />}
                                    label="Use Backup"
                                />
                            </RadioGroup>
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
                                        variant="contained"
                                        style={{ backgroundColor: GREEN, width: 200,marginRight:"5px" }}
                                    >
                                        Update
                                    </Button>
                                </div>

                                <div>
                                    <Button
                                        required
                                        fullWidth
                                        variant="contained"
                                        style={{ backgroundColor: LIGHT_GREY.length, width: 150 }}
                                        onClick={() => {
                                            history.push('/');
                                        }}
                                    >
                                        BACK
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
