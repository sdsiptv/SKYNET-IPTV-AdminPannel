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
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { GREEN, LIGHT_GREY } from 'utils/constant/color';
import useStyles from './styles';
import { failureNotification, toastMessage } from 'utils/helper';

export default function AddEditUserEngineering({ pageMode = 'add' }) {
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const { register, handleSubmit, setValue, control } = useForm();
    const [enabledUserId, setEnabledUserId] = useState(true);
    const [enabledAuditMode, setEnabledAuditMode] = useState(false);

    const handleUserIdCheckboxChange = (e) => {
        setEnabledUserId(e.target.checked);
        if (e.target.checked) {
            setEnabledAuditMode(false);
            setValue('area_code', '');
        }
    };

    const handleAuditModeCheckboxChange = (e) => {
        setEnabledAuditMode(e.target.checked);
        if (e.target.checked) {
            setEnabledUserId(false);
            setValue('user_id', '');
        }
    };

    const onSubmit = ({ user_id, area_code, audit_mode, low_profile_mode, stream_type, bootup, channel_change, first_play, language, id }) => {
        const apiCall =
            pageMode === 'add'
                ? apis.addUserEngineering(user_id, area_code, audit_mode, low_profile_mode, stream_type, bootup, channel_change, first_play, language)
                : apis.editUserEngineering(user_id, area_code, audit_mode, low_profile_mode, stream_type, bootup, channel_change, first_play, language, id);

        apiCall
            .then(res => {
                toastMessage(
                    pageMode === 'add' ? `Successfully Added ` : `Successfully updated`,
                );
                history.push('/UserEngineerings');
            })
            .catch(err => {
                failureNotification('Network error');
            });
    };

    useEffect(() => {
        if (location.state) {
            let params = location.state.state.data;
            setValue('id', params.id);
            setValue('user_id', params.user_id);
            setValue('area_code', params.area_code);
            setValue('audit_mode', params.audit_mode);
            setValue('low_profile_mode', params.low_profile_mode);
            setValue('stream_type', params.stream_type);
            setValue('bootup', params.bootup);
            setValue('channel_change', params.channel_change);
            setValue('first_play', params.first_play);
            setValue('language', params.language);

        } else {
            history.push('/AddUserEngineering');
        }
    }, []);

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" className={classes.title}>
                                {pageMode === 'add' ? 'ADD' : 'EDIT'} User Engineering
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={enabledUserId}
                                        onChange={handleUserIdCheckboxChange}
                                        name="enableUserId"
                                    />
                                }
                                label="User ID"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="user_id"
                                label="User ID"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                id="user_id"
                                {...register('user_id')}
                                disabled={!enabledUserId}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={enabledAuditMode}
                                        onChange={handleAuditModeCheckboxChange}
                                        name="enableAuditMode"
                                    />
                                }
                                label="Area Code"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="area_code"
                                label="Area Code"
                                type="number"
                                helperText={"Area Code will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="area_code"
                                {...register('area_code')}
                                disabled={!enabledAuditMode}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="audit_mode"
                                label="Audit Mode"
                                type="number"
                                helperText={"Audit Mode will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="audit_mode"
                                {...register('audit_mode')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="low_profile_mode"
                                label="Low Profile Mode"
                                type="number"
                                helperText={"Low Profile Mode will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="low_profile_mode"
                                {...register('low_profile_mode', { required: true })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="stream_type"
                                label="Stream Type"
                                type="number"
                                helperText={"Stream Type will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="stream_type"
                                {...register('stream_type', { required: true })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="bootup"
                                label="Boot Up"
                                type="number"
                                helperText={"Boot UP will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="bootup"
                                {...register('bootup', { required: true })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="channel_change"
                                label="Channel Change"
                                type="number"
                                helperText={"Channel Change will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="channel_change"
                                {...register('channel_change', { required: true })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="first_play"
                                label="First Play"
                                type="number"
                                helperText={"First Play will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="first_play"
                                {...register('first_play', { required: true })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="language"
                                label="Language"
                                type="number"
                                helperText={"Language will be Number"}
                                InputLabelProps={{ shrink: true }}
                                id="language"
                                {...register('language', { required: true })}
                            />
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
                                        style={{ backgroundColor: GREEN, width: 150 }}
                                    >
                                        {pageMode === 'add' ? 'CREATE' : 'UPDATE'}
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        required
                                        fullWidth
                                        variant="contained"
                                        style={{ backgroundColor: LIGHT_GREY.length, width: 150 }}
                                        onClick={() => {
                                            history.push('/UserEngineerings');
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
