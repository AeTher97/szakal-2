import {useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

const wsUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL + "/ws";

const useWsTopic = (topic) => {
    const [state, setState] = useState(0);
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!topic) {
            return null;
        }
        const socket = new SockJS(wsUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => {
                console.debug(str);
            },
            onConnect: () => {
                console.debug('Connected to WebSocket');
                stompClient.subscribe(`/topic/${topic}`, (response) => {
                    console.debug(`Received update message for topic ${topic}:`, response.body);
                    setState(prevState => prevState + 1);
                });
            },
            onStompError: (frame) => {
                console.debug('Broker reported error: ' + frame.headers['message']);
                console.debug('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [topic]);


    return state;

};

export default useWsTopic;