import React, {useState} from 'react';
import {Divider, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import UserAvatar from "../UserAvatar";
import {formatLocalDateTime} from "../../utils/DateUtils";
import {useSelector} from "react-redux";
import {TextAreaWithLimit} from "../../utils/InputWithLimit";

const JourneyComments = ({addComment, journey}) => {

    const {userId} = useSelector(state => state.auth)
    const [comment, setComment] = useState("");

    console.log(journey.comments)
    return (
        <div style={{flex: 1}}>
            <Typography level={"h3"}>Komentarze</Typography>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (comment.length > 1000) {
                    return;
                }
                if (comment !== "") {
                    addComment(userId, comment);
                }
                setComment("")
            }}>
                <div style={{display: "flex"}}>
                    <Stack spacing={1} style={{flex: 1}}>
                        <Typography level={"title-lg"}>Dodaj komentarz</Typography>
                        <TextAreaWithLimit limit={1000} minRows={2} value={comment} onChange={(e) => {
                            setComment(e.target.value)
                        }} placeholder={"Komentarz"} required/>
                        <Button type={"submit"}>Dodaj</Button>
                    </Stack>
                </div>
            </form>
            {journey.comments.sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? -1 : 1;
            }).map(comment => {
                return <div key={comment.id} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    margin: 5
                }}>
                    <div style={{display: "flex", gap: 5, alignItems: "center"}}>
                        <UserAvatar name={comment.user.name}
                                    id={comment.user.id}
                                    surname={comment.user.surname}
                                    image={comment.user.profilePicture}
                                    overrideMobile={true}
                                    size={"sm"}/>

                    </div>
                    <Typography level={"body-md"}>{comment.comment}</Typography>
                    <Typography
                        level={"body-xs"}>{formatLocalDateTime(comment.date)}</Typography>
                    <Divider/>

                </div>
            })}
            {journey.comments.length === 0 &&
                <div style={{padding: 10, display: "flex", justifyContent: "center"}}>
                    <Typography>Brak komentarzy</Typography>
                </div>}
        </div>
    );
};

export default JourneyComments;