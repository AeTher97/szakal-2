import React, { useState } from 'react';
import {Divider, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import UserAvatar from "../../misc/UserAvatar";
import {formatLocalDateTime} from "../../../utils/DateUtils";
import {useSelector} from "react-redux";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import PropTypes from "prop-types";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";

const JourneyComments = ({addComment, editComment, journey}) => {

    const {userId} = useSelector(state => state.auth)
    const comment = UseFieldValidation();

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentValue, setEditingCommentValue] = useState("");

    const isFormValid = comment.isValid;

    const handleEdit = (commentId, commentValue) => {
        setEditingCommentId(commentId);
        setEditingCommentValue(commentValue);
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingCommentValue !== "") {
            editComment(editingCommentId, editingCommentValue, userId);
            setEditingCommentId(null);
            setEditingCommentValue("");
        }
    }

    return (
        <div style={{flex: 1}}>
            <Typography level={"h3"}>Komentarze</Typography>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!isFormValid) {
                    return;
                }
                if (comment.value !== "") {
                    addComment(userId, comment.value);
                }
                comment.reset();
            }}>
                <div style={{display: "flex"}}>
                    <Stack spacing={1} style={{flex: 1}}>
                        <Typography level={"title-lg"}>Dodaj komentarz</Typography>
                        <TextAreaWithLimit minRows={2} required
                                           value={comment.value}
                                           limit={comment.limit}
                                           isValid={comment.isValid}
                                           onChange={comment.handleChange}
                                           placeholder={"Komentarz"}
                        />
                        <Button type={"submit"} disabled={!isFormValid}>Dodaj</Button>
                    </Stack>
                </div>
            </form>
            <div data-testid="cypress-journey-comments">
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
                            <UserAvatar
                                id={comment.user.id}
                                name={comment.user.name}
                                surname={comment.user.surname}
                                committee={comment.user.committee}
                                image={comment.user.profilePicture}
                                overrideMobile={true}
                                size={"sm"}/>

                    </div>
                    {editingCommentId === comment.id ? (
                        <form onSubmit={handleEditSubmit}>
                            <TextAreaWithLimit minRows={2} required
                                                  value={editingCommentValue}
                                                  limit={comment.limit}
                                                  isValid={true}
                                                  onChange={(e) => setEditingCommentValue(e.target.value)}
                                                  placeholder={"Komentarz"}
                            />
                            <Button type={"submit"}>Zapisz</Button>
                            <Button onClick={() => setEditingCommentId(null)}>Anuluj</Button>
                        </form>
                        ) : (
                            <>
                                <Typography level={"body-md"}>{comment.comment}</Typography>
                                <Button onClick={() => handleEdit(comment.id, comment.comment)}>Edytuj</Button>
                            </>
                    )}
                    <Typography
                        level={"body-xs"}>{formatLocalDateTime(comment.date)}</Typography>
                    <Divider/>

                    </div>
                })}
            </div>
            {journey.comments.length === 0 &&
                <div style={{padding: 10, display: "flex", justifyContent: "center"}}>
                    <Typography>Brak komentarzy</Typography>
                </div>}
        </div>
    );
};

JourneyComments.propTypes = {
    addComment: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    journey: PropTypes.object.isRequired
}

export default JourneyComments;