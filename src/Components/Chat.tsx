import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Grid, Box, TextField, Paper, Button } from '@material-ui/core';
const useChatStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        maxHeight: 200,
        backgroundColor: theme.palette.background.paper,
        overflow: "auto"
    },
    inline: {
        display: 'inline',
    },
}));

interface IMenssages {
    username: string,
    message: string,
}

const Chat: React.FC<any> = ({ }) => {
    const [hubConnection, setHubConnection] = useState<HubConnection>(
        // Haciendo la conexion.
        new HubConnectionBuilder()
            .withUrl("https://localhost:5001/chathub")
            .configureLogging(LogLevel.Information)
            .build());
    const [username, setUsername] = useState<string>('');
    const [messages, setMessages] = useState<Array<IMenssages>>([]);
    const [message, setMessage] = useState('')

    const classes = useChatStyles();
    // Set the Hub Connection on mount.
    useEffect(() => {

        createHubConnection();
    }, []);

    // Esto es para estalecer la connecion con signalR.
    const createHubConnection = async () => {

        await hubConnection.start().then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :(', err))

        // Aqui tengo la conexion establecida con el hub ("Estoy escuchando el puerto")
        hubConnection.on("ReceiveMessage", (username, message) => {


            setMessages(mesage => [...mesage, { "username": username, "message": message }])


        })

    }


    const sendMessage = () => {

        console.log("Se ejecuto", message);
        if (hubConnection && message !== '') {

            hubConnection.invoke("SendMessage", username, message).catch(error => console.log(error))

        }
    }
    return (
        <Grid
            style={{ marginTop: 250 }}
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
        >

            <Grid item xs={2}>
                <Box flexDirection="colunm" display="flex" justifyContent="center">

                    <Paper style={{ padding: 10 }}>
                        <TextField value={username} onChange={event => setUsername(event.target.value)} label="Name" />
                        <TextField value={message} onChange={event => setMessage(event.target.value)} label="Message" />
                        <Button onClick={sendMessage} style={{ marginTop: 10 }} variant="contained" color="primary">Enviar Mensaje </Button>
                    </Paper>

                </Box>
            </Grid>
            <Grid item xs={4}>



                <Paper style={{ padding: 10 }}>
                    <List className={classes.root}>
                        {messages.map((message, index) => (
                            <ListItem alignItems="flex-start" key={index}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={message.username}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                            </Typography>
                                            {message.message}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        ))}

                    </List>
                </Paper>




            </Grid>

        </Grid>)
}
export default Chat;